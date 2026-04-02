import { useState, useEffect, useMemo, useCallback } from 'react';
import { MapPin, X, Search, Truck, ChevronRight, Loader2, LocateFixed } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setLocation, setRoute, RESTAURANT_COORDS, AHMEDABAD_AREAS, haversineDistance, computeDeliveryFee, isDeliveryAvailable } from '../../features/location/locationSlice';
import { setDeliveryFee } from '../../features/cart/cartSlice';
import {
  Map,
  MapMarker,
  MarkerContent,
  MarkerPopup,
  MapControls,
  MapRoute,
} from '@/components/ui/map';

interface LocationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectLocation?: (address: string) => void;
}

export default function LocationModal({ isOpen, onClose, onSelectLocation }: LocationModalProps) {
  const dispatch = useAppDispatch();
  const locationState = useAppSelector(state => state.location);

  const [search, setSearch] = useState('');
  const [pinCoords, setPinCoords] = useState<[number, number]>(
    locationState.deliveryCoords || [72.5146, 23.0550]
  );
  const [detecting, setDetecting] = useState(false);
  const [routeCoords, setRouteCoords] = useState<[number, number][]>([]);
  const [showPopup, setShowPopup] = useState(false);

  const distance = useMemo(() => haversineDistance(RESTAURANT_COORDS, pinCoords), [pinCoords]);
  const fee = useMemo(() => computeDeliveryFee(distance), [distance]);
  const available = useMemo(() => isDeliveryAvailable(distance), [distance]);

  // Fetch road route from OSRM
  const fetchRoute = useCallback(async (dest: [number, number]) => {
    try {
      const [lng1, lat1] = RESTAURANT_COORDS;
      const [lng2, lat2] = dest;
      const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?overview=full&geometries=geojson`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.routes?.[0]?.geometry?.coordinates) {
        setRouteCoords(data.routes[0].geometry.coordinates);
      }
    } catch {
      // Fallback: straight line
      setRouteCoords([RESTAURANT_COORDS, dest]);
    }
  }, []);

  // Fetch route whenever pin moves
  useEffect(() => {
    if (isOpen) {
      const timeout = setTimeout(() => fetchRoute(pinCoords), 400);
      return () => clearTimeout(timeout);
    }
  }, [pinCoords, isOpen, fetchRoute]);

  // Prevent body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      setTimeout(() => setShowPopup(true), 600);
    } else {
      document.body.style.overflow = 'auto';
      setShowPopup(false);
    }
    return () => { document.body.style.overflow = 'auto'; };
  }, [isOpen]);

  // Filter suggestions
  const suggestions = useMemo(() => {
    if (search.length < 1) return [];
    const q = search.toLowerCase();
    return AHMEDABAD_AREAS.filter(a =>
      a.name.toLowerCase().includes(q)
    ).slice(0, 8);
  }, [search]);

  // Handlers
  const handleDetect = () => {
    setDetecting(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const coords: [number, number] = [pos.coords.longitude, pos.coords.latitude];
          setPinCoords(coords);
          setSearch('');
          setDetecting(false);
        },
        () => {
          setDetecting(false);
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setDetecting(false);
    }
  };

  const handleAreaSelect = (area: typeof AHMEDABAD_AREAS[0]) => {
    setPinCoords(area.coords);
    setSearch(area.name);
  };

  const handleConfirm = () => {
    const address = search || getNearestAreaName(pinCoords);
    dispatch(setLocation({ coords: pinCoords, address }));
    dispatch(setRoute(routeCoords));
    dispatch(setDeliveryFee(fee));
    onSelectLocation?.(address);
    onClose();
  };

  const getNearestAreaName = (coords: [number, number]) => {
    let minDist = Infinity;
    let name = 'Selected Location';
    AHMEDABAD_AREAS.forEach(a => {
      const d = haversineDistance(coords, a.coords);
      if (d < minDist) { minDist = d; name = a.name; }
    });
    return minDist < 2 ? `Near ${name}` : name;
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', bounce: 0.15, duration: 0.4 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
            onClick={onClose}
          >
            <div
              className="bg-white rounded-3xl shadow-2xl w-full max-w-3xl overflow-hidden flex flex-col max-h-[92vh]"
              onClick={(e) => e.stopPropagation()}
            >
              {/* ── Header ── */}
              <div className="flex items-center justify-between px-6 pt-5 pb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 bg-gradient-to-br from-orange-100 to-orange-200 rounded-2xl flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-orange-600" />
                  </div>
                  <div>
                    <h2 className="text-lg font-black text-gray-900 font-outfit">Set Delivery Location</h2>
                    <p className="text-xs text-gray-500 font-medium">Ahmedabad • Tap or drag pin on map</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* ── Search + Detect ── */}
              <div className="px-6 pb-3 space-y-2.5">
                <div className="relative">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search areas in Ahmedabad..."
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-900 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-orange-500/30 focus:border-orange-400 transition-all"
                  />
                  {/* Suggestions Dropdown */}
                  {suggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-xl shadow-xl z-20 overflow-hidden max-h-52 overflow-y-auto">
                      {suggestions.map(area => {
                        const d = haversineDistance(RESTAURANT_COORDS, area.coords);
                        return (
                          <button
                            key={area.name}
                            onClick={() => handleAreaSelect(area)}
                            className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-orange-50 transition-colors text-left"
                          >
                            <div className="flex items-center gap-2.5">
                              <MapPin className="w-3.5 h-3.5 text-gray-400 shrink-0" />
                              <span className="text-sm font-semibold text-gray-700">{area.name}</span>
                            </div>
                            <span className="text-[10px] font-bold text-gray-400">{d.toFixed(1)} km</span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                <button
                  onClick={handleDetect}
                  disabled={detecting}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 border border-dashed border-orange-300 rounded-xl hover:border-orange-400 hover:bg-orange-50/50 transition-all group"
                >
                  <div className="w-8 h-8 bg-orange-50 rounded-lg flex items-center justify-center group-hover:bg-orange-100 transition-colors">
                    {detecting ? (
                      <Loader2 className="w-4 h-4 text-orange-500 animate-spin" />
                    ) : (
                      <LocateFixed className="w-4 h-4 text-orange-500" />
                    )}
                  </div>
                  <span className="font-bold text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                    {detecting ? 'Detecting your location...' : 'Use my current location'}
                  </span>
                </button>
              </div>

              {/* ── Map ── */}
              <div className="mx-6 rounded-2xl overflow-hidden border-2 border-orange-100 shadow-inner h-[300px] sm:h-[340px] relative">
                <Map
                  center={pinCoords}
                  zoom={13}
                  styles={{
                    light: 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json',
                  }}
                  theme="light"
                >
                  <MapControls
                    position="top-right"
                    showZoom={true}
                    showLocate={true}
                    onLocate={(coords) => {
                      setPinCoords([coords.longitude, coords.latitude]);
                    }}
                  />

                  {/* Route Line */}
                  {routeCoords.length >= 2 && (
                    <MapRoute
                      id="delivery-route"
                      coordinates={routeCoords}
                      color="#f97316"
                      width={4}
                      opacity={0.7}
                    />
                  )}

                  {/* Restaurant Marker */}
                  <MapMarker
                    longitude={RESTAURANT_COORDS[0]}
                    latitude={RESTAURANT_COORDS[1]}
                  >
                    <MarkerContent>
                      <div className="flex flex-col items-center">
                        <div className="bg-orange-500 text-white p-1.5 rounded-full shadow-lg shadow-orange-500/40 border-2 border-white">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 2h18l-2 9H5L3 2z" />
                            <path d="M5 11l-1 9h16l-1-9" />
                            <path d="M12 15v4" />
                          </svg>
                        </div>
                        <div className="w-0 h-0 border-l-[5px] border-r-[5px] border-t-[6px] border-l-transparent border-r-transparent border-t-orange-500 -mt-0.5" />
                      </div>
                    </MarkerContent>
                    {showPopup && (
                      <MarkerPopup className="bg-white border-orange-200 px-3 py-2 rounded-xl shadow-lg -mt-1">
                        <p className="text-xs font-black text-orange-600">🍕 Foodie Buddy</p>
                        <p className="text-[10px] text-gray-500 font-medium">Vaishnodevi Circle</p>
                      </MarkerPopup>
                    )}
                  </MapMarker>

                  {/* Delivery Pin — Draggable */}
                  <MapMarker
                    longitude={pinCoords[0]}
                    latitude={pinCoords[1]}
                    draggable={true}
                    onDragEnd={(lngLat) => {
                      setPinCoords([lngLat.lng, lngLat.lat]);
                      setSearch(getNearestAreaName([lngLat.lng, lngLat.lat]));
                    }}
                  >
                    <MarkerContent>
                      <div className="flex flex-col items-center animate-bounce-slow">
                        <div className="bg-blue-600 text-white p-2 rounded-full shadow-lg shadow-blue-600/40 border-2 border-white relative">
                          <MapPin className="w-4 h-4" />
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full border border-white animate-pulse" />
                        </div>
                        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent border-t-blue-600 -mt-0.5" />
                        <div className="w-2 h-2 rounded-full bg-blue-600/20 mt-0.5 animate-ping" />
                      </div>
                    </MarkerContent>
                  </MapMarker>
                </Map>

                {/* Distance Pill — overlaid on map  */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <div className="bg-white/95 backdrop-blur rounded-xl px-3 py-2 shadow-lg border border-gray-200/60 flex items-center gap-2">
                    <Truck className="w-4 h-4 text-orange-500" />
                    <span className="text-xs font-bold text-gray-700">{distance.toFixed(1)} km</span>
                  </div>

                  {!available ? (
                    <div className="bg-red-500 text-white rounded-xl px-3 py-2 shadow-lg text-xs font-black">
                      Too far for delivery
                    </div>
                  ) : fee === 0 ? (
                    <div className="bg-green-500 text-white rounded-xl px-3 py-2 shadow-lg text-xs font-black flex items-center gap-1">
                      <Truck className="w-3.5 h-3.5" /> FREE Delivery
                    </div>
                  ) : (
                    <div className="bg-white/95 backdrop-blur rounded-xl px-3 py-2 shadow-lg border border-gray-200/60 text-xs font-black text-gray-700">
                      Delivery ₹{fee}
                    </div>
                  )}
                </div>
              </div>

              {/* ── Footer: Fee breakdown + Confirm ── */}
              <div className="px-6 py-4 space-y-3">
                {/* Fee breakdown */}
                <div className="flex items-center justify-between px-4 py-3 bg-gray-50 rounded-xl border border-gray-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Delivery To</span>
                    <span className="text-sm font-bold text-gray-800 mt-0.5">
                      {search || getNearestAreaName(pinCoords)}
                    </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Fee</span>
                    {fee === 0 ? (
                      <span className="text-sm font-black text-green-600 mt-0.5">FREE</span>
                    ) : (
                      <span className="text-sm font-black text-gray-800 mt-0.5">₹{fee}</span>
                    )}
                  </div>
                </div>

                {distance <= 1.5 && (
                  <p className="text-center text-[10px] font-bold text-green-600 bg-green-50 rounded-lg px-3 py-1.5 border border-green-100">
                    🎉 You're within 1.5 km — FREE delivery!
                  </p>
                )}

                {!available && (
                  <p className="text-center text-[10px] font-bold text-red-600 bg-red-50 rounded-lg px-3 py-1.5 border border-red-100">
                    ⚠️ Sorry, we deliver up to 15 km from our restaurant
                  </p>
                )}

                {/* Confirm Button */}
                <button
                  onClick={handleConfirm}
                  disabled={!available}
                  className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-black text-sm transition-all shadow-lg ${
                    available
                      ? 'bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white hover:shadow-xl hover:shadow-orange-500/30 active:scale-[0.98]'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  <MapPin className="w-4 h-4" />
                  Confirm Location
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
