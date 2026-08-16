import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Newspaper, ImagePlus, Star } from 'lucide-react';
import api from '../../lib/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const categories = ['General', 'Company News', 'Product Update', 'Press Release', 'Event'];

const toInputDate = (d) => new Date(d).toISOString().slice(0, 10);

const emptyForm = {
  title: '',
  summary: '',
  body: '',
  category: 'General',
  tags: '',
  publishDate: toInputDate(new Date()),
  isPublished: true,
  isDefault: false,
};

export default function AdminNews() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [coverImage, setCoverImage] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/news/admin/all')
      .then(({ data }) => setItems(data.items))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setCoverImage(null);
    setModalOpen(true);
  };

  const openEdit = (n) => {
    setEditing(n);
    setForm({
      title: n.title,
      summary: n.summary,
      body: n.body,
      category: n.category,
      tags: (n.tags || []).join(', '),
      publishDate: toInputDate(n.publishDate),
      isPublished: n.isPublished,
      isDefault: n.isDefault,
    });
    setCoverImage(null);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'tags') {
          fd.append('tags', JSON.stringify(v.split(',').map((t) => t.trim()).filter(Boolean)));
        } else {
          fd.append(k, v);
        }
      });
      if (coverImage) fd.append('coverImage', coverImage);

      if (editing) {
        await api.put(`/news/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Article updated');
      } else {
        await api.post('/news', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Article published');
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
      await api.delete(`/news/${deleteTarget._id}`);
      toast.success('Article deleted');
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
          <h1 className="font-title text-2xl">News &amp; Updates</h1>
          <p className="mt-1 text-sm text-ink-muted">
            Publish dated articles. If nothing is published for a given day, visitors automatically see your
            "default" evergreen articles instead.
          </p>
        </div>
        <button onClick={openCreate} className="btn-primary shrink-0">
          <Plus size={18} /> New Article
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : items.length === 0 ? (
          <EmptyState icon={Newspaper} title="No articles yet" description="Publish your first news article or update." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((n) => (
              <div key={n._id} className="card overflow-hidden">
                <div className="aspect-video overflow-hidden bg-ink-surface">
                  {n.coverImage?.url && <img src={n.coverImage.url} alt={n.title} className="h-full w-full object-cover" />}
                </div>
                <div className="p-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-medium uppercase text-brand">{n.category}</span>
                    <span className="text-xs text-ink-muted">{toInputDate(n.publishDate)}</span>
                    {!n.isPublished && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">Draft</span>}
                    {n.isDefault && (
                      <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">
                        <Star size={10} /> Default
                      </span>
                    )}
                  </div>
                  <h3 className="mt-1 line-clamp-2 font-semibold">{n.title}</h3>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => openEdit(n)} className="btn-outline flex-1 !py-2 text-sm">
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(n)}
                      className="flex items-center justify-center rounded-full border border-red-200 px-4 text-red-600 transition hover:bg-red-50"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {modalOpen && (
        <Modal title={editing ? 'Edit Article' : 'New Article'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              required
              placeholder="Title"
              className="input-field"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            <textarea
              required
              rows={2}
              maxLength={300}
              placeholder="Short summary (shown in listings, max 300 chars)"
              className="input-field resize-none"
              value={form.summary}
              onChange={(e) => setForm({ ...form, summary: e.target.value })}
            />
            <div>
              <textarea
                required
                rows={8}
                placeholder="Full article body — basic HTML is supported (e.g. <p>, <b>, <a href>)"
                className="input-field resize-none font-mono text-xs"
                value={form.body}
                onChange={(e) => setForm({ ...form, body: e.target.value })}
              />
              <p className="mt-1 text-xs text-ink-muted">
                Tip: wrap paragraphs in &lt;p&gt;...&lt;/p&gt;. This is rendered as rich content on the article page.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-3">
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
              <input
                type="date"
                className="input-field"
                value={form.publishDate}
                onChange={(e) => setForm({ ...form, publishDate: e.target.value })}
              />
              <input
                placeholder="Tags, comma separated"
                className="input-field"
                value={form.tags}
                onChange={(e) => setForm({ ...form, tags: e.target.value })}
              />
            </div>

            {editing?.coverImage?.url && !coverImage && (
              <img src={editing.coverImage.url} alt="" className="h-32 w-full rounded-xl object-cover" />
            )}
            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ink-border p-4 text-sm text-ink-muted transition hover:border-brand hover:text-brand">
              <ImagePlus size={18} />
              {coverImage ? coverImage.name : 'Upload cover image (JPG/PNG/WEBP)'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                className="hidden"
                onChange={(e) => setCoverImage(e.target.files[0])}
              />
            </label>

            <div className="flex flex-wrap gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isPublished}
                  onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                />
                Published (visible on website)
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isDefault}
                  onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
                />
                Use as default/fallback article
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn-primary justify-center">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Publish Article'}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete article"
          message={`Delete "${deleteTarget.title}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
