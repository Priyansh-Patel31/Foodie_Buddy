import { Outlet } from 'react-router-dom';

export default function AdminLayout() {
  return (
    <div className="min-h-screen bg-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-800 text-white flex flex-col hidden md:flex fixed h-full">
        <div className="h-16 flex items-center justify-center font-bold text-xl border-b border-slate-700">
          Admin Portal
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <a href="#" className="block p-3 rounded bg-slate-700 text-white">Dashboard</a>
          <a href="#" className="block p-3 rounded text-slate-300 hover:bg-slate-700">Restaurants</a>
          <a href="#" className="block p-3 rounded text-slate-300 hover:bg-slate-700">Orders</a>
          <a href="#" className="block p-3 rounded text-slate-300 hover:bg-slate-700">Users</a>
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col md:ml-64">
        {/* Top Header */}
        <header className="bg-white h-16 shadow-sm flex items-center justify-between px-6 sticky top-0 z-40">
          <div className="font-semibold text-gray-800">Dashboard</div>
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Admin User</span>
            <div className="w-8 h-8 rounded-full bg-slate-200"></div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
