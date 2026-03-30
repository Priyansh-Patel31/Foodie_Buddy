import { useState } from 'react';
import { useAppSelector } from '../../store/hooks';
import { MessageSquareText, Star, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface Complaint {
  id: string;
  customerId: string;
  customerName: string;
  orderId: string;
  type: 'Refund Request' | 'Quality Issue' | 'Late Delivery' | 'Compliment';
  message: string;
  status: 'Open' | 'Resolved';
  date: string;
  priority: 'High' | 'Medium' | 'Low';
}

export default function ManagerCRMPage() {
  const { users } = useAppSelector(state => state.admin);
  const customers = users.filter(u => u.role === 'ROLE_CUSTOMER');
  
  // Built-in realistic complaint data
  const [complaints, setComplaints] = useState<Complaint[]>([
    { id: 'CMP-001', customerId: 'U1', customerName: 'Happy Customer', orderId: 'ORD-001', type: 'Compliment', message: 'The truffle pasta was absolutely divine! Best I have ever had. The delivery was super quick too.', status: 'Resolved', date: '2026-03-29', priority: 'Low' },
    { id: 'CMP-002', customerId: 'U2', customerName: 'Alice Smith', orderId: 'ORD-002', type: 'Quality Issue', message: 'My pizza arrived slightly cold. The box was damaged during transport. Would appreciate a replacement or credit.', status: 'Open', date: '2026-03-29', priority: 'High' },
    { id: 'CMP-003', customerId: 'U3', customerName: 'Tom Hanks', orderId: 'ORD-004', type: 'Late Delivery', message: 'The order for my office party arrived 45 minutes late. However, the food quality was excellent once it got here.', status: 'Open', date: '2025-12-25', priority: 'Medium' },
    { id: 'CMP-004', customerId: 'U1', customerName: 'Happy Customer', orderId: 'ORD-003', type: 'Refund Request', message: 'I was charged twice for the same order. Please process a refund for the duplicate charge of ₹1,550.', status: 'Open', date: '2026-02-14', priority: 'High' },
    { id: 'CMP-005', customerId: 'U2', customerName: 'Alice Smith', orderId: 'ORD-002', type: 'Compliment', message: 'Despite the cold pizza, the customer support was fantastic. Very impressed with the team!', status: 'Resolved', date: '2026-03-29', priority: 'Low' },
  ]);

  const [selectedComplaint, setSelectedComplaint] = useState<Complaint | null>(null);

  const resolveComplaint = (id: string) => {
    setComplaints(prev => prev.map(c => c.id === id ? { ...c, status: 'Resolved' as const } : c));
    setSelectedComplaint(null);
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Refund Request': return 'bg-red-100 text-red-700 border-red-200';
      case 'Quality Issue': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Late Delivery': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Compliment': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Refund Request': return <AlertTriangle size={14} />;
      case 'Quality Issue': return <ThumbsDown size={14} />;
      case 'Late Delivery': return <AlertTriangle size={14} />;
      case 'Compliment': return <ThumbsUp size={14} />;
      default: return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-red-500 text-white';
      case 'Medium': return 'bg-yellow-500 text-white';
      case 'Low': return 'bg-gray-300 text-gray-700';
      default: return 'bg-gray-200 text-gray-600';
    }
  };

  const openCount = complaints.filter(c => c.status === 'Open').length;
  const resolvedCount = complaints.filter(c => c.status === 'Resolved').length;

  return (
    <div className="space-y-8 animate-fade-in max-w-7xl mx-auto pb-20">
      <div>
        <h1 className="text-3xl font-black text-gray-900 font-outfit flex items-center gap-3">
          <MessageSquareText className="text-orange-600" size={32} /> Customer Hub
        </h1>
        <p className="text-gray-500 font-medium mt-1">Handle customer feedback, reviews, complaints, and refund requests.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40 flex items-center gap-4">
          <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center"><MessageSquareText className="text-blue-600" size={20} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total Tickets</p>
            <p className="text-2xl font-black text-gray-900">{complaints.length}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-red-50/50 flex items-center gap-4">
          <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center"><AlertTriangle className="text-red-500" size={20} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-red-600">Open Issues</p>
            <p className="text-2xl font-black text-red-700">{openCount}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-green-50/50 flex items-center gap-4">
          <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center"><CheckCircle2 className="text-green-600" size={20} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-green-600">Resolved</p>
            <p className="text-2xl font-black text-green-700">{resolvedCount}</p>
          </div>
        </div>
        <div className="glass rounded-2xl p-5 border border-white/60 shadow-lg bg-white/40 flex items-center gap-4">
          <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center"><Star className="text-orange-600" size={20} /></div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Customers</p>
            <p className="text-2xl font-black text-gray-900">{customers.length}</p>
          </div>
        </div>
      </div>

      {/* Tickets List */}
      <div className="space-y-4">
        {complaints.map(complaint => (
          <div
            key={complaint.id}
            onClick={() => setSelectedComplaint(complaint)}
            className={`glass rounded-3xl p-6 border shadow-lg cursor-pointer transition-all hover:shadow-xl hover:scale-[1.005] ${
              complaint.status === 'Open' ? 'border-orange-200 bg-white/50' : 'border-white/60 bg-white/30 opacity-80'
            }`}
          >
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-orange-400 rounded-full flex items-center justify-center text-white font-black text-lg shrink-0">
                  {complaint.customerName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-black text-gray-900">{complaint.customerName}</h3>
                    <span className="text-xs font-mono text-gray-400">{complaint.id}</span>
                    <span className={`px-2 py-0.5 rounded-full text-[9px] font-black ${getPriorityBadge(complaint.priority)}`}>
                      {complaint.priority}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1 line-clamp-1">{complaint.message}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${getTypeBadge(complaint.type)}`}>
                      {getTypeIcon(complaint.type)} {complaint.type}
                    </span>
                    <span className="text-xs text-gray-400 font-bold">Order: {complaint.orderId}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-bold text-gray-400">{new Date(complaint.date).toLocaleDateString()}</span>
                <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full ${
                  complaint.status === 'Open' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'
                }`}>
                  {complaint.status}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Detail Modal */}
      {selectedComplaint && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={() => setSelectedComplaint(null)} />
          <div className="glass shadow-2xl rounded-3xl w-full max-w-2xl border border-white p-8 relative z-10 animate-fade-in">
            <button onClick={() => setSelectedComplaint(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 text-gray-400">
              <X size={20} />
            </button>

            <div className="flex items-center gap-4 mb-6">
              <div className="w-14 h-14 bg-gradient-to-br from-primary-500 to-orange-400 rounded-full flex items-center justify-center text-white font-black text-xl">
                {selectedComplaint.customerName.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-black text-gray-900">{selectedComplaint.customerName}</h2>
                <p className="text-sm font-bold text-gray-400">{selectedComplaint.id} • Order {selectedComplaint.orderId}</p>
              </div>
            </div>

            <div className="flex gap-2 mb-4">
              <span className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-black uppercase tracking-wider rounded-full border ${getTypeBadge(selectedComplaint.type)}`}>
                {getTypeIcon(selectedComplaint.type)} {selectedComplaint.type}
              </span>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${getPriorityBadge(selectedComplaint.priority)}`}>
                {selectedComplaint.priority} Priority
              </span>
            </div>

            <div className="bg-gray-50/50 rounded-2xl p-5 border border-gray-100 mb-6">
              <p className="text-sm font-medium text-gray-700 leading-relaxed">{selectedComplaint.message}</p>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-400">Filed: {new Date(selectedComplaint.date).toLocaleDateString()}</span>
              {selectedComplaint.status === 'Open' && (
                <button
                  onClick={() => resolveComplaint(selectedComplaint.id)}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white font-black px-6 py-3 rounded-xl shadow-lg transition-all"
                >
                  <CheckCircle2 size={18} /> Mark Resolved
                </button>
              )}
              {selectedComplaint.status === 'Resolved' && (
                <span className="flex items-center gap-2 bg-green-100 text-green-700 font-black px-4 py-2 rounded-xl">
                  <CheckCircle2 size={16} /> Already Resolved
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
