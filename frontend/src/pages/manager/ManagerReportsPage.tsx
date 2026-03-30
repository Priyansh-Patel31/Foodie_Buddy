import { useState, useRef } from 'react';
import { useAppSelector } from '../../store/hooks';
import { FileBarChart, Calendar, IndianRupee, Package, TrendingUp, CheckCircle2, Printer, X } from 'lucide-react';

export default function ManagerReportsPage() {
  const { orders, menuItems, users, transactions, totalBalance } = useAppSelector(state => state.admin);
  const [selectedReport, setSelectedReport] = useState<string | null>(null);
  const [showPrintPreview, setShowPrintPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const todayOrders = orders.filter(o => {
    const orderDate = new Date(o.date).toDateString();
    return orderDate === new Date().toDateString();
  });

  const totalRevenue = orders.reduce((s, o) => s + o.charge, 0);
  const totalProfit = orders.reduce((s, o) => s + o.profit, 0);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.charge, 0);
  const todayProfit = todayOrders.reduce((sum, o) => sum + o.profit, 0);
  const totalCustomers = users.filter(u => u.role === 'ROLE_CUSTOMER').length;
  const staffCount = users.filter(u => u.role !== 'ROLE_CUSTOMER' && u.role !== 'ROLE_ADMIN').length;
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0;

  const topDish = menuItems.length > 0 ? menuItems[0] : null;

  // Revenue breakdown by category
  const revenueByType = transactions.reduce((acc, t) => {
    const key = t.type || 'OTHER';
    acc[key] = (acc[key] || 0) + Math.abs(t.amount);
    return acc;
  }, {} as Record<string, number>);

  const handleExportPDF = () => {
    setShowPrintPreview(true);
    setTimeout(() => {
      window.print();
    }, 300);
  };

  const reports = [
    {
      id: 'daily',
      title: 'Daily Sales Report',
      description: 'Complete breakdown of today\'s sales, orders, and revenue.',
      icon: Calendar,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      id: 'weekly',
      title: 'Weekly Performance',
      description: 'Week-over-week comparison of KPIs and growth metrics.',
      icon: TrendingUp,
      color: 'bg-green-100 text-green-600',
    },
    {
      id: 'financial',
      title: 'Financial Summary',
      description: 'Profit-loss overview, payroll costs, and balance sheet.',
      icon: IndianRupee,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      id: 'inventory',
      title: 'Menu & Inventory Report',
      description: 'Stock levels, popular items, and menu performance data.',
      icon: Package,
      color: 'bg-purple-100 text-purple-600',
    },
  ];

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      <div className="print-hide">
        <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
          <FileBarChart className="text-rose-600" size={32} /> EOD Reports
        </h1>
        <p className="text-gray-500 font-medium mt-1">Generate and review end-of-day operational summaries.</p>
        <p className="text-xs font-bold text-gray-400 mt-2 uppercase tracking-widest">{today}</p>
      </div>

      {/* Today's Quick Summary */}
      <div className="print-hide glass rounded-3xl p-8 border border-white/60 shadow-xl bg-gradient-to-br from-white/60 to-primary-50/30">
        <h2 className="text-xl font-black text-gray-800 mb-6 flex items-center gap-2">
          <CheckCircle2 className="text-green-500" size={24} /> Today's End-of-Day Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Orders Processed</p>
            <p className="text-3xl font-black text-gray-900">{todayOrders.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Revenue Earned</p>
            <p className="text-3xl font-black text-primary-600">₹{todayRevenue.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Net Profit</p>
            <p className={`text-3xl font-black ${todayProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{todayProfit.toLocaleString()}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Account Balance</p>
            <p className="text-3xl font-black text-gray-900">₹{totalBalance.toLocaleString()}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-6 pt-6 border-t border-gray-100">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Menu Items Live</p>
            <p className="text-xl font-black text-gray-800">{menuItems.filter(m => m.isAvailable).length} / {menuItems.length}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Active Customers</p>
            <p className="text-xl font-black text-gray-800">{totalCustomers}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Staff on Roster</p>
            <p className="text-xl font-black text-gray-800">{staffCount}</p>
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Top Dish</p>
            <p className="text-xl font-black text-gray-800">{topDish?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      {/* Report Types Grid */}
      <div className="print-hide">
        <h2 className="text-lg font-black text-gray-800 mb-4">Generate Reports</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map(report => {
            const Icon = report.icon;
            const isSelected = selectedReport === report.id;
            return (
              <div
                key={report.id}
                onClick={() => setSelectedReport(isSelected ? null : report.id)}
                className={`glass rounded-3xl p-6 border shadow-lg cursor-pointer transition-all hover:shadow-xl group ${
                  isSelected ? 'border-primary-300 bg-primary-50/30 scale-[1.01]' : 'border-white/60 bg-white/40'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${report.color} group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-black text-gray-900 text-lg">{report.title}</h3>
                    <p className="text-sm font-medium text-gray-500 mt-1">{report.description}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="mt-6 pt-4 border-t border-gray-100 animate-fade-in">
                    <div className="bg-white/60 rounded-2xl p-5 border border-gray-100">
                      <p className="text-sm font-bold text-gray-700 mb-3">Report Preview:</p>
                      <div className="space-y-2 text-sm text-gray-600">
                        <p>• Total Orders: <span className="font-black text-gray-900">{orders.length}</span></p>
                        <p>• Total Revenue: <span className="font-black text-green-600">₹{totalRevenue.toLocaleString()}</span></p>
                        <p>• Total Profit: <span className={`font-black ${totalProfit >= 0 ? 'text-green-600' : 'text-red-600'}`}>₹{totalProfit.toLocaleString()}</span></p>
                        <p>• Avg Order Value: <span className="font-black text-gray-900">₹{avgOrderValue}</span></p>
                        <p>• Transactions Logged: <span className="font-black text-gray-900">{transactions.length}</span></p>
                      </div>
                    </div>
                    <button 
                      onClick={(e) => { e.stopPropagation(); handleExportPDF(); }}
                      className="mt-4 flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white font-black px-6 py-3 rounded-xl shadow-lg transition-all w-full justify-center"
                    >
                      <Printer size={18} /> Export as PDF
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================= */}
      {/* PRINTABLE EOD REPORT — visible during print, hidden on screen */}
      {/* ============================================================= */}
      <div 
        ref={printRef}
        className="hidden print:block"
      >
        <style>{`
          @media print {
            .print-report { display: block !important; }
            .print-report * { color-adjust: exact; -webkit-print-color-adjust: exact; }
          }
        `}</style>
        <div className="print-report" style={{ fontFamily: "'Outfit', sans-serif", padding: '20px' }}>
          {/* Report Header */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px', marginBottom: '32px', borderBottom: '3px solid #ea580c', paddingBottom: '20px' }}>
            <div style={{ width: '48px', height: '48px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{ position: 'absolute', width: '100%', height: '100%', border: '2px solid #fb923c', borderRadius: '50%' }}></div>
              <div style={{ width: '32px', height: '32px', background: 'linear-gradient(to bottom right, #fb923c, #ea580c, #c2410c)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 900, fontSize: '20px', fontFamily: 'sans-serif', zIndex: 10 }}>F</div>
            </div>
            <div style={{ textAlign: 'left' }}>
              <h1 style={{ fontSize: '32px', fontWeight: 900, color: '#111827', margin: 0, lineHeight: 1 }}>Foodie-Buddy <span style={{ color: '#ea580c' }}>Hub</span></h1>
              <p style={{ fontSize: '14px', color: '#6b7280', fontWeight: 800, margin: '4px 0 0 0', textTransform: 'uppercase', letterSpacing: '1px' }}>End-of-Day Operations Report • {today}</p>
            </div>
          </div>

          {/* KPI Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '16px', marginBottom: '24px' }}>
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Total Orders</p>
              <p style={{ fontSize: '28px', fontWeight: 900, color: '#111827' }}>{orders.length}</p>
            </div>
            <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Revenue</p>
              <p style={{ fontSize: '28px', fontWeight: 900, color: '#ea580c' }}>₹{totalRevenue.toLocaleString()}</p>
            </div>
            <div style={{ background: totalProfit >= 0 ? '#f0fdf4' : '#fef2f2', border: `1px solid ${totalProfit >= 0 ? '#bbf7d0' : '#fecaca'}`, borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Net Profit</p>
              <p style={{ fontSize: '28px', fontWeight: 900, color: totalProfit >= 0 ? '#16a34a' : '#dc2626' }}>₹{totalProfit.toLocaleString()}</p>
            </div>
            <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '12px', padding: '16px', textAlign: 'center' }}>
              <p style={{ fontSize: '10px', fontWeight: 900, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Balance</p>
              <p style={{ fontSize: '28px', fontWeight: 900, color: '#111827' }}>₹{totalBalance.toLocaleString()}</p>
            </div>
          </div>

          {/* Operational Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '12px', marginBottom: '28px', padding: '16px', background: '#fafafa', borderRadius: '12px', border: '1px solid #e5e7eb' }}>
            <div><p style={{ fontSize: '10px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase' }}>Menu Items</p><p style={{ fontSize: '18px', fontWeight: 900 }}>{menuItems.filter(m => m.isAvailable).length}/{menuItems.length}</p></div>
            <div><p style={{ fontSize: '10px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase' }}>Customers</p><p style={{ fontSize: '18px', fontWeight: 900 }}>{totalCustomers}</p></div>
            <div><p style={{ fontSize: '10px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase' }}>Staff Active</p><p style={{ fontSize: '18px', fontWeight: 900 }}>{staffCount}</p></div>
            <div><p style={{ fontSize: '10px', fontWeight: 900, color: '#9ca3af', textTransform: 'uppercase' }}>Avg Order</p><p style={{ fontSize: '18px', fontWeight: 900 }}>₹{avgOrderValue}</p></div>
          </div>

          {/* Transaction Breakdown Table */}
          <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Transaction Breakdown</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb' }}>
                <th style={{ textAlign: 'left', padding: '10px 12px', fontWeight: 900, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Type</th>
                <th style={{ textAlign: 'right', padding: '10px 12px', fontWeight: 900, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '1.5px' }}>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(revenueByType).map(([type, amount]) => (
                <tr key={type} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '10px 12px', fontWeight: 700 }}>{type.replace(/_/g, ' ')}</td>
                  <td style={{ padding: '10px 12px', textAlign: 'right', fontWeight: 900, color: type.includes('REVENUE') || type.includes('ORDER') ? '#16a34a' : '#dc2626' }}>₹{amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Recent Orders Table */}
          <h3 style={{ fontSize: '14px', fontWeight: 900, color: '#374151', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>Recent Orders (Last 10)</h3>
          <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '28px', fontSize: '12px' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e5e7eb', background: '#f9fafb' }}>
                <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 900, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase' }}>Order ID</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 900, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase' }}>Customer</th>
                <th style={{ textAlign: 'left', padding: '8px 10px', fontWeight: 900, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase' }}>Status</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', fontWeight: 900, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase' }}>Charge</th>
                <th style={{ textAlign: 'right', padding: '8px 10px', fontWeight: 900, color: '#6b7280', fontSize: '10px', textTransform: 'uppercase' }}>Profit</th>
              </tr>
            </thead>
            <tbody>
              {orders.slice(0, 10).map(order => (
                <tr key={order.id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                  <td style={{ padding: '8px 10px', fontWeight: 700, fontFamily: 'monospace', fontSize: '11px' }}>{order.id.slice(0, 8)}...</td>
                  <td style={{ padding: '8px 10px', fontWeight: 600 }}>{order.customerName}</td>
                  <td style={{ padding: '8px 10px' }}>
                    <span style={{ 
                      fontSize: '10px', fontWeight: 900, textTransform: 'uppercase', letterSpacing: '0.5px',
                      padding: '2px 8px', borderRadius: '6px',
                      background: order.status === 'DELIVERED' ? '#dcfce7' : order.status === 'PREPARING' ? '#fef3c7' : '#f3f4f6',
                      color: order.status === 'DELIVERED' ? '#16a34a' : order.status === 'PREPARING' ? '#d97706' : '#374151'
                    }}>{order.status}</span>
                  </td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 700 }}>₹{order.charge}</td>
                  <td style={{ padding: '8px 10px', textAlign: 'right', fontWeight: 900, color: order.profit >= 0 ? '#16a34a' : '#dc2626' }}>₹{order.profit}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Footer */}
          <div style={{ borderTop: '2px solid #ea580c', paddingTop: '16px', marginTop: '24px', textAlign: 'center' }}>
            <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600 }}>Generated by Foodie Buddy Manager Hub • {new Date().toLocaleString('en-IN')}</p>
            <p style={{ fontSize: '10px', color: '#d1d5db', fontWeight: 500, marginTop: '4px' }}>This is a system-generated report. Data accuracy is synced with the live database.</p>
          </div>
        </div>
      </div>

      {/* Print Preview Overlay (on-screen indicator) */}
      {showPrintPreview && (
        <div className="print-hide fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
          <div className="glass rounded-3xl p-8 border border-white/60 shadow-2xl max-w-md text-center">
            <Printer size={48} className="text-primary-600 mx-auto mb-4" />
            <h3 className="text-xl font-black text-gray-900 mb-2">Generating PDF Report</h3>
            <p className="text-sm text-gray-500 font-medium mb-6">Your browser's print dialog should appear. Choose "Save as PDF" for best results.</p>
            <button 
              onClick={() => setShowPrintPreview(false)}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-black px-6 py-3 rounded-xl transition-all mx-auto"
            >
              <X size={16} /> Dismiss
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
