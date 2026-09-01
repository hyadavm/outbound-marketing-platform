import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  Plus, 
  Filter, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Mail,
  Phone,
  Building,
  Briefcase
} from 'lucide-react';
import { api } from '../api/client';
import { Lead, LeadStatus } from '../types';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';

export const Leads: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New Lead Form State
  const [newFirstName, setNewFirstName] = useState('');
  const [newLastName, setNewLastName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [newTitle, setNewTitle] = useState('');
  const [newPhone, setNewPhone] = useState('');
  const [newStatus, setNewStatus] = useState<LeadStatus>('New');

  const navigate = useNavigate();

  const fetchLeads = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/leads?page=${page}&limit=10&search=${search}&status=${statusFilter}`);
      setLeads(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (err) {
      console.error('Failed to fetch leads:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeads();
  }, [page, statusFilter]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchLeads();
  };

  const handleCreateLead = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/leads', {
        first_name: newFirstName,
        last_name: newLastName,
        email: newEmail,
        company: newCompany,
        title: newTitle,
        phone: newPhone,
        status: newStatus,
        score: 60
      });
      setIsModalOpen(false);
      // Reset form
      setNewFirstName('');
      setNewLastName('');
      setNewEmail('');
      setNewCompany('');
      setNewTitle('');
      setNewPhone('');
      fetchLeads();
    } catch (err: any) {
      alert(err.message || 'Failed to create lead');
    }
  };

  const handleDeleteLead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    try {
      await api.delete(`/leads/${id}`);
      fetchLeads();
    } catch (err) {
      console.error('Delete lead failed:', err);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Leads Database</h1>
          <p className="text-sm text-slate-500">Manage and segment your outbound prospects</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm shadow-indigo-200 transition"
        >
          <Plus className="w-4 h-4" />
          Add Single Lead
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-4 items-center justify-between">
        <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by name, email, or company..."
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white text-slate-900"
          />
        </form>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <Filter className="w-4 h-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
            className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">All Statuses</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="Qualified">Qualified</option>
            <option value="Converted">Converted</option>
            <option value="Unsubscribed">Unsubscribed</option>
          </select>
        </div>
      </div>

      {/* Leads Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-400">Loading leads...</div>
        ) : leads.length === 0 ? (
          <div className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-700 mb-1">No Leads Found</h3>
            <p className="text-xs text-slate-500 mb-4">Try clearing search filters or add new leads.</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold"
            >
              Add Lead
            </button>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-500 uppercase tracking-wider">
                <th className="py-3 px-6">Lead Name</th>
                <th className="py-3 px-6">Company & Title</th>
                <th className="py-3 px-6">Email</th>
                <th className="py-3 px-6">Status</th>
                <th className="py-3 px-6">Score</th>
                <th className="py-3 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {leads.map((lead) => (
                <tr
                  key={lead.id}
                  onClick={() => navigate(`/leads/${lead.id}`)}
                  className="hover:bg-slate-50 cursor-pointer transition"
                >
                  <td className="py-3.5 px-6 font-semibold text-slate-900">
                    {lead.first_name} {lead.last_name}
                  </td>
                  <td className="py-3.5 px-6">
                    <div className="font-medium text-slate-800">{lead.company || '—'}</div>
                    <div className="text-xs text-slate-500">{lead.title || '—'}</div>
                  </td>
                  <td className="py-3.5 px-6 text-slate-600 font-mono text-xs">{lead.email}</td>
                  <td className="py-3.5 px-6">
                    <Badge status={lead.status} />
                  </td>
                  <td className="py-3.5 px-6">
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold bg-indigo-50 text-indigo-700">
                      {lead.score} / 100
                    </span>
                  </td>
                  <td className="py-3.5 px-6 text-right">
                    <button
                      onClick={(e) => handleDeleteLead(e, lead.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition"
                      title="Delete Lead"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* Pagination Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>
            Page <strong className="text-slate-900">{page}</strong> of <strong className="text-slate-900">{totalPages}</strong>
          </span>
          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage(page + 1)}
              className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-50"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Add Lead Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add New Lead">
        <form onSubmit={handleCreateLead} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">First Name *</label>
              <input
                type="text"
                required
                value={newFirstName}
                onChange={(e) => setNewFirstName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white"
                placeholder="Sarah"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Last Name *</label>
              <input
                type="text"
                required
                value={newLastName}
                onChange={(e) => setNewLastName(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white"
                placeholder="Jenkins"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Email Address *</label>
            <input
              type="email"
              required
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white"
              placeholder="sarah@acme.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Company</label>
              <input
                type="text"
                value={newCompany}
                onChange={(e) => setNewCompany(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white"
                placeholder="Acme Corp"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Job Title</label>
              <input
                type="text"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white"
                placeholder="VP of Marketing"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Phone</label>
              <input
                type="text"
                value={newPhone}
                onChange={(e) => setNewPhone(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white"
                placeholder="+1 (555) 000-0000"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Status</label>
              <select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value as LeadStatus)}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 focus:bg-white"
              >
                <option value="New">New</option>
                <option value="Contacted">Contacted</option>
                <option value="Qualified">Qualified</option>
                <option value="Converted">Converted</option>
              </select>
            </div>
          </div>

          <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
            <button
              type="button"
              onClick={() => setIsModalOpen(false)}
              className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold shadow-sm"
            >
              Create Lead
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
