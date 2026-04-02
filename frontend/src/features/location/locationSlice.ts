import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// ─── Restaurant Location: Vaishnodevi Circle, Ahmedabad ─────────────────────
export const RESTAURANT_COORDS: [number, number] = [72.5146, 23.0735];
export const RESTAURANT_NAME = 'Foodie Buddy — Vaishnodevi Circle';

// ─── Delivery Fee Logic ─────────────────────────────────────────────────────
const FREE_DELIVERY_RADIUS_KM = 1.5;
const PER_KM_CHARGE = 10; // ₹10 per km after free radius
const MAX_DELIVERY_FEE = 150;
const MAX_DELIVERY_RADIUS_KM = 15;

/** Haversine formula — returns distance in km between two [lng, lat] points */
export function haversineDistance(
  [lng1, lat1]: [number, number],
  [lng2, lat2]: [number, number]
): number {
  const R = 6371; // Earth radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/** Compute delivery fee from distance */
export function computeDeliveryFee(distanceKm: number): number {
  if (distanceKm <= FREE_DELIVERY_RADIUS_KM) return 0;
  const extra = distanceKm - FREE_DELIVERY_RADIUS_KM;
  const fee = Math.ceil(extra) * PER_KM_CHARGE;
  return Math.min(fee, MAX_DELIVERY_FEE);
}

/** Check if delivery is available */
export function isDeliveryAvailable(distanceKm: number): boolean {
  return distanceKm <= MAX_DELIVERY_RADIUS_KM;
}

// ─── Well-known Ahmedabad Areas for Search Suggestions ──────────────────────
export const AHMEDABAD_AREAS = [
  { name: 'SG Highway', coords: [72.5117, 23.0302] as [number, number] },
  { name: 'Prahlad Nagar', coords: [72.5050, 23.0128] as [number, number] },
  { name: 'Satellite', coords: [72.5070, 23.0210] as [number, number] },
  { name: 'Vastrapur', coords: [72.5290, 23.0320] as [number, number] },
  { name: 'Bodakdev', coords: [72.5020, 23.0350] as [number, number] },
  { name: 'Thaltej', coords: [72.4960, 23.0505] as [number, number] },
  { name: 'Sola', coords: [72.5100, 23.0630] as [number, number] },
  { name: 'Gota', coords: [72.5340, 23.1020] as [number, number] },
  { name: 'Chandkheda', coords: [72.5830, 23.1080] as [number, number] },
  { name: 'Motera', coords: [72.5960, 23.0910] as [number, number] },
  { name: 'Naroda', coords: [72.6530, 23.0770] as [number, number] },
  { name: 'Maninagar', coords: [72.6140, 23.0070] as [number, number] },
  { name: 'Navrangpura', coords: [72.5560, 23.0350] as [number, number] },
  { name: 'Paldi', coords: [72.5630, 23.0125] as [number, number] },
  { name: 'Ellis Bridge', coords: [72.5600, 23.0260] as [number, number] },
  { name: 'Ambawadi', coords: [72.5490, 23.0290] as [number, number] },
  { name: 'Bopal', coords: [72.4680, 23.0270] as [number, number] },
  { name: 'South Bopal', coords: [72.4670, 23.0120] as [number, number] },
  { name: 'Shilaj', coords: [72.4680, 23.0590] as [number, number] },
  { name: 'Science City', coords: [72.5100, 23.0700] as [number, number] },
  { name: 'Vaishnodevi Circle', coords: RESTAURANT_COORDS },
  { name: 'Tragad', coords: [72.5490, 23.1010] as [number, number] },
  { name: 'Sabarmati', coords: [72.5750, 23.0700] as [number, number] },
  { name: 'Ashram Road', coords: [72.5720, 23.0380] as [number, number] },
  { name: 'CG Road', coords: [72.5520, 23.0260] as [number, number] },
  { name: 'Drive In Road', coords: [72.5250, 23.0470] as [number, number] },
  { name: 'Jodhpur', coords: [72.5230, 23.0280] as [number, number] },
  { name: 'Makarba', coords: [72.4910, 23.0100] as [number, number] },
  { name: 'Ghatlodiya', coords: [72.5370, 23.0660] as [number, number] },
  { name: 'Ranip', coords: [72.5680, 23.0720] as [number, number] },
];

// ─── Slice ──────────────────────────────────────────────────────────────────
interface LocationState {
  deliveryCoords: [number, number] | null;
  deliveryAddress: string;
  distanceKm: number;
  deliveryFee: number;
  routeCoordinates: [number, number][];
  isAvailable: boolean;
}

const saved = (() => {
  try {
    const raw = localStorage.getItem('foodieBuddyLocationData');
    if (raw) return JSON.parse(raw);
  } catch {}
  return null;
})();

const initialState: LocationState = {
  deliveryCoords: saved?.deliveryCoords || null,
  deliveryAddress: saved?.deliveryAddress || '',
  distanceKm: saved?.distanceKm || 0,
  deliveryFee: saved?.deliveryFee ?? 49,
  routeCoordinates: [],
  isAvailable: saved?.isAvailable ?? true,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation(
      state,
      action: PayloadAction<{
        coords: [number, number];
        address: string;
      }>
    ) {
      const { coords, address } = action.payload;
      state.deliveryCoords = coords;
      state.deliveryAddress = address;
      state.distanceKm = haversineDistance(RESTAURANT_COORDS, coords);
      state.deliveryFee = computeDeliveryFee(state.distanceKm);
      state.isAvailable = isDeliveryAvailable(state.distanceKm);

      // Persist
      try {
        localStorage.setItem(
          'foodieBuddyLocationData',
          JSON.stringify({
            deliveryCoords: coords,
            deliveryAddress: address,
            distanceKm: state.distanceKm,
            deliveryFee: state.deliveryFee,
            isAvailable: state.isAvailable,
          })
        );
        // Also keep legacy key
        localStorage.setItem('foodieBuddyLocation', address);
      } catch {}
    },
    setRoute(state, action: PayloadAction<[number, number][]>) {
      state.routeCoordinates = action.payload;
    },
    clearLocation(state) {
      state.deliveryCoords = null;
      state.deliveryAddress = '';
      state.distanceKm = 0;
      state.deliveryFee = 49;
      state.routeCoordinates = [];
      state.isAvailable = true;
      try {
        localStorage.removeItem('foodieBuddyLocationData');
        localStorage.removeItem('foodieBuddyLocation');
      } catch {}
    },
  },
});

export const { setLocation, setRoute, clearLocation } = locationSlice.actions;
export default locationSlice.reducer;
