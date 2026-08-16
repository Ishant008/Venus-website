import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, X, ImagePlus, Package } from 'lucide-react';
import api from '../../lib/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';

const emptyForm = {
  name: '',
  category: '',
  shortDescription: '',
  description: '',
  features: '',
  isFeatured: false,
  isActive: true,
};

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [newFiles, setNewFiles] = useState([]);
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [saving, setSaving] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const load = () => {
    setLoading(true);
    api
      .get('/products/admin/all')
      .then(({ data }) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setNewFiles([]);
    setRemovedImageIds([]);
    setModalOpen(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      name: p.name,
      category: p.category,
      shortDescription: p.shortDescription || '',
      description: p.description,
      features: (p.features || []).join('\n'),
      isFeatured: p.isFeatured,
      isActive: p.isActive,
    });
    setNewFiles([]);
    setRemovedImageIds([]);
    setModalOpen(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('category', form.category);
      fd.append('shortDescription', form.shortDescription);
      fd.append('description', form.description);
      fd.append(
        'features',
        JSON.stringify(form.features.split('\n').map((f) => f.trim()).filter(Boolean))
      );
      fd.append('isFeatured', form.isFeatured);
      fd.append('isActive', form.isActive);
      newFiles.forEach((f) => fd.append('images', f));

      if (editing) {
        if (removedImageIds.length) fd.append('removedImageIds', JSON.stringify(removedImageIds));
        await api.put(`/products/${editing._id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product updated');
      } else {
        await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success('Product created');
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
      await api.delete(`/products/${deleteTarget._id}`);
      toast.success('Product deleted');
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
          <h1 className="font-title text-2xl">Products</h1>
          <p className="mt-1 text-sm text-ink-muted">Manage the products shown on your website.</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus size={18} /> Add Product
        </button>
      </div>

      <div className="mt-8">
        {loading ? (
          <Loader />
        ) : products.length === 0 ? (
          <EmptyState icon={Package} title="No products yet" description="Add your first product to get started." />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((p) => (
              <div key={p._id} className="card overflow-hidden">
                <div className="aspect-[4/3] overflow-hidden bg-ink-surface">
                  {p.images?.[0]?.url && <img src={p.images[0].url} alt={p.name} className="h-full w-full object-cover" />}
                </div>
                <div className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-medium uppercase text-brand">{p.category}</span>
                    {!p.isActive && <span className="rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-medium text-red-600">Hidden</span>}
                    {p.isFeatured && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-medium text-amber-600">Featured</span>}
                  </div>
                  <h3 className="mt-1 font-semibold">{p.name}</h3>
                  <div className="mt-4 flex gap-2">
                    <button onClick={() => openEdit(p)} className="btn-outline flex-1 !py-2 text-sm">
                      <Pencil size={14} /> Edit
                    </button>
                    <button
                      onClick={() => setDeleteTarget(p)}
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
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setModalOpen(false)} wide>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                placeholder="Product name"
                className="input-field"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <input
                required
                placeholder="Category"
                className="input-field"
                value={form.category}
                onChange={(e) => setForm({ ...form, category: e.target.value })}
              />
            </div>
            <input
              placeholder="Short description (for cards)"
              className="input-field"
              value={form.shortDescription}
              onChange={(e) => setForm({ ...form, shortDescription: e.target.value })}
            />
            <textarea
              required
              rows={4}
              placeholder="Full description"
              className="input-field resize-none"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <textarea
              rows={3}
              placeholder="Features (one per line)"
              className="input-field resize-none"
              value={form.features}
              onChange={(e) => setForm({ ...form, features: e.target.value })}
            />

            {editing && editing.images?.length > 0 && (
              <div>
                <p className="mb-2 text-sm font-medium text-ink-muted">Current images</p>
                <div className="flex flex-wrap gap-3">
                  {editing.images
                    .filter((img) => !removedImageIds.includes(img.publicId))
                    .map((img) => (
                      <div key={img.publicId} className="relative h-20 w-20 overflow-hidden rounded-lg border border-ink-border">
                        <img src={img.url} alt="" className="h-full w-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setRemovedImageIds([...removedImageIds, img.publicId])}
                          className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                </div>
              </div>
            )}

            <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ink-border p-4 text-sm text-ink-muted transition hover:border-brand hover:text-brand">
              <ImagePlus size={18} />
              {newFiles.length > 0 ? `${newFiles.length} new image(s) selected` : 'Add images (JPG/PNG/WEBP, up to 6)'}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                multiple
                className="hidden"
                onChange={(e) => setNewFiles(Array.from(e.target.files))}
              />
            </label>

            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isFeatured}
                  onChange={(e) => setForm({ ...form, isFeatured: e.target.checked })}
                />
                Featured
              </label>
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) => setForm({ ...form, isActive: e.target.checked })}
                />
                Visible on website
              </label>
            </div>

            <button type="submit" disabled={saving} className="btn-primary justify-center">
              {saving ? 'Saving...' : editing ? 'Save Changes' : 'Create Product'}
            </button>
          </form>
        </Modal>
      )}

      {deleteTarget && (
        <ConfirmDialog
          title="Delete product"
          message={`Are you sure you want to delete "${deleteTarget.name}"? This cannot be undone.`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
          loading={deleting}
        />
      )}
    </div>
  );
}
