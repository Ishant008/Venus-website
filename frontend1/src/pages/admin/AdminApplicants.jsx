import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Users, Download, Trash2, Mail, Phone } from 'lucide-react';
import api from '../../lib/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const statusStyles = {
  new: 'bg-blue-50 text-blue-600',
  reviewed: 'bg-amber-50 text-amber-600',
  shortlisted: 'bg-brand-50 text-brand-700',
  rejected: 'bg-red-50 text-red-600',
};

export default function AdminApplicants() {
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [filter, setFilter] = useState('all');

  const load = () => {
    setLoading(true);
    api
      .get('/applicants')
      .then(({ data }) => setApplicants(data.applicants))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/applicants/${id}/status`, { status });
      setApplicants((prev) => prev.map((a) => (a._id === id ? { ...a, status } : a)));
      toast.success('Status updated');
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/applicants/${deleteTarget._id}`);
      toast.success('Applicant record deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  const filtered = filter === 'all' ? applicants : applicants.filter((a) => a.status === filter);

  return (
    <div>
      <h1 className="font-title text-2xl">Applicants</h1>
      <p className="mt-1 text-sm text-ink-muted">Review candidates who applied through your Careers page.</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {['all', 'new', 'reviewed', 'shortlisted', 'rejected'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${
              filter === s ? 'bg-ink text-white' : 'bg-white text-ink-soft hover:bg-brand-50'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading ? (
          <Loader />
        ) : filtered.length === 0 ? (
          <EmptyState icon={Users} title="No applicants" description="Applications will appear here once candidates apply." />
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-ink-border bg-white">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-ink-border bg-ink-surface text-xs uppercase text-ink-muted">
                <tr>
                  <th className="px-5 py-3">Candidate</th>
                  <th className="px-5 py-3">Applied For</th>
                  <th className="px-5 py-3">Contact</th>
                  <th className="px-5 py-3">Status</th>
                  <th className="px-5 py-3">Resume</th>
                  <th className="px-5 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((a) => (
                  <tr key={a._id} className="border-b border-ink-border last:border-0">
                    <td className="px-5 py-4">
                      <p className="font-medium text-ink">{a.name}</p>
                      {a.message && <p className="mt-0.5 line-clamp-1 max-w-xs text-xs text-ink-muted">{a.message}</p>}
                    </td>
                    <td className="px-5 py-4 text-ink-soft">{a.vacancy?.title || '—'}</td>
                    <td className="px-5 py-4">
                      <a href={`mailto:${a.email}`} className="flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand">
                        <Mail size={12} /> {a.email}
                      </a>
                      <a href={`tel:${a.phone}`} className="mt-1 flex items-center gap-1.5 text-xs text-ink-muted hover:text-brand">
                        <Phone size={12} /> {a.phone}
                      </a>
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={a.status}
                        onChange={(e) => updateStatus(a._id, e.target.value)}
                        className={`rounded-full border-0 px-3 py-1.5 text-xs font-medium capitalize ${statusStyles[a.status]}`}
                      >
                        {Object.keys(statusStyles).map((s) => (
                          <option key={s} value={s}>
                            {s}
                          </option>
                        ))}
                      </select>
                    </td>
                    <td className="px-5 py-4">
                      <a href={a.resume} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-xs font-medium text-brand hover:underline">
                        <Download size={13} /> View
                      </a>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <button onClick={() => setDeleteTarget(a)} className="text-red-500 hover:text-red-700">
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {deleteTarget && (
        <ConfirmDialog
          title="Delete applicant"
          message={`Delete the application from "${deleteTarget.name}"?`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
