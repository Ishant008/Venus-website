import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import api from '../../lib/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const emptyForm = {
  title: '',
  department: '',
  location: 'India',
  employmentType: 'Full-time',
  experience: '',
  description: '',
  requirements: '',
  tags: '',
  isOpen: true,
};

export default function AdminVacancies() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/vacancies/admin/all')
      .then(({ data }) => setVacancies(data.vacancies))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (v) => {
    setEditing(v);
    setForm({
      title: v.title,
      department: v.department || '',
      location: v.location || '',
      employmentType: v.employmentType,
      experience: v.experience || '',
      description: v.description,
      requirements: (v.requirements || []).join('\n'),
      tags: (v.tags || []).join(', '),
      isOpen: v.isOpen,
    });
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = {
        ...form,
        requirements: form.requirements.split('\n').map((r) => r.trim()).filter(Boolean),
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (editing) {
        await api.put(`/vacancies/${editing._id}`, payload);
        toast.success('Job opening updated');
      } else {
        await api.post('/vacancies', payload);
        toast.success('Job opening created');
      }
      setModalOpen(false);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await api.delete(`/vacancies/${deleteTarget._id}`);
      toast.success('Job opening deleted');
      setDeleteTarget(null);
      load();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-title text-2xl">Job Openings</h1>
          <p className="mt-1 text-sm text-ink-muted">Manage vacancies shown on the Careers page.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} /> Add Job
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : vacancies.length === 0 ? (
          <EmptyState icon={Briefcase} title="No job openings yet" description="Post your first opening to start receiving applications." />
        ) : (
          <div className="grid gap-4">
            {vacancies.map((v) => (
              <div key={v._id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">{v.title}</h3>
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${v.isOpen ? 'bg-brand-50 text-brand-700' : 'bg-red-50 text-red-600'}`}>
                      {v.isOpen ? 'Open' : 'Closed'}
                    </span>
                  </div>
                  <p className="mt-1 text-sm text-ink-muted">
                    {v.department} &bull; {v.location} &bull; {v.employmentType}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(v)} className="btn-outline !px-4 !py-2 text-sm">
                    <Pencil size={14} /> Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(v)}
                    className="flex items-center justify-center rounded-full border border-red-200 px-4 text-red-600 transition hover:bg-red-50"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Job Opening' : 'Add Job Opening'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              required
              placeholder="Job title"
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <div className="grid gap-4 sm:grid-cols-3">
              <input
                placeholder="Department"
                className="input-field"
                value={form.department}
                onChange={(e) => setForm({ ...form, department: e.target.value })}
              />
              <input
                placeholder="Location"
                className="input-field"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
              <select
                className="input-field"
                value={form.employmentType}
                onChange={(e) => setForm({ ...form, employmentType: e.target.value })}
              >
                <option>Full-time</option>
                <option>Part-time</option>
                <option>Contract</option>
                <option>Internship</option>
              </select>
            </div>
            <input
              placeholder="Experience required (e.g. 2-4 years)"
              className="input-field"
              value={form.experience}
              onChange={(e) => setForm({ ...form, experience: e.target.value })}
            />
            <textarea
              required
              rows={4}
              placeholder="Job description"
              className="input-field resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <textarea
              rows={3}
              placeholder="Requirements (one per line)"
              className="input-field resize-none"
              value={form.requirements}
              onChange={(e) => setForm({ ...form, requirements: e.target.value })}
            />
            <input
              placeholder="Tags, comma separated (e.g. React, Node.js)"
              className="input-field"
              value={form.tags}
              onChange={(e) => setForm({ ...form, tags: e.target.value })}
            />
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={form.isOpen} onChange={(e) => setForm({ ...form, isOpen: e.target.checked })} />
              Open for applications
            </label>
            <button type="submit" disabled={saving} className="btn-primary justify-center">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Job Opening'}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete job opening"
          message={`Delete "${deleteTarget.title}"? All associated applicants will be removed too.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
