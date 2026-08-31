import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import { Plus, Pencil, Trash2, Newspaper, ImagePlus, Star, X, Wand2 } from 'lucide-react';
import api from '../../lib/api';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Modal from '../../components/admin/Modal';
import ConfirmDialog from '../../components/admin/ConfirmDialog';
import SeoPanel from '../../components/admin/SeoPanel';
import { analyzeSeo, suggestKeywords } from '../../lib/seoHelper';

const categories = ['General', 'Company News', 'Product Update', 'Press Release', 'Event'];

const toInputDate = (d) => new Date(d).toISOString().slice(0, 10);

const emptyForm = {
  title: '',
  summary: '',
  body: '',
  category: 'General',
  tags: '',
  metaKeywords: '',
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

  // Gallery (multiple images per article)
  const [existingGallery, setExistingGallery] = useState([]); // [{url, publicId, alt}]
  const [removedImageIds, setRemovedImageIds] = useState([]);
  const [newGalleryFiles, setNewGalleryFiles] = useState([]); // File[]
  const [newGalleryAlts, setNewGalleryAlts] = useState([]); // string[] parallel to newGalleryFiles

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

  const resetGalleryState = () => {
    setExistingGallery([]);
    setRemovedImageIds([]);
    setNewGalleryFiles([]);
    setNewGalleryAlts([]);
  };

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm);
    setCoverImage(null);
    resetGalleryState();
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
      metaKeywords: n.seo?.metaKeywords || '',
      publishDate: toInputDate(n.publishDate),
      isPublished: n.isPublished,
      isDefault: n.isDefault,
    });
    setCoverImage(null);
    setExistingGallery(n.images || []);
    setRemovedImageIds([]);
    setNewGalleryFiles([]);
    setNewGalleryAlts([]);
    setModalOpen(true);
  };

  const addGalleryFiles = (files) => {
    const list = Array.from(files);
    setNewGalleryFiles((prev) => [...prev, ...list]);
    setNewGalleryAlts((prev) => [...prev, ...list.map(() => '')]);
  };

  const removeNewGalleryFile = (idx) => {
    setNewGalleryFiles((prev) => prev.filter((_, i) => i !== idx));
    setNewGalleryAlts((prev) => prev.filter((_, i) => i !== idx));
  };

  // Live SEO analysis — 100% local, no API, updates as the admin types
  const seoAnalysis = useMemo(() => {
    const totalImages = (existingGallery.length - removedImageIds.length) + newGalleryFiles.length + (coverImage || editing?.coverImage ? 1 : 0);
    const altFilled =
      existingGallery.filter((img) => !removedImageIds.includes(img.publicId) && img.alt).length +
      newGalleryAlts.filter(Boolean).length;
    return analyzeSeo({
      title: form.title,
      summary: form.summary,
      body: form.body,
      focusKeyword: form.metaKeywords,
      imagesWithAlt: altFilled,
      totalImages,
    });
  }, [form, existingGallery, removedImageIds, newGalleryFiles, newGalleryAlts, coverImage, editing]);

  const keywordSuggestions = useMemo(
    () => suggestKeywords({ title: form.title, summary: form.summary, body: form.body }),
    [form.title, form.summary, form.body]
  );

  const applyKeyword = (kw) => {
    const current = form.metaKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    if (current.includes(kw)) return;
    setForm({ ...form, metaKeywords: [...current, kw].join(', ') });
  };

  const applyAllSuggestions = () => {
    const current = form.metaKeywords
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    const merged = [...new Set([...current, ...keywordSuggestions])];
    setForm({ ...form, metaKeywords: merged.join(', ') });
    toast.success('Keywords auto-filled from your content');
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

      newGalleryFiles.forEach((f) => fd.append('images', f));
      if (newGalleryFiles.length > 0) fd.append('imageAlts', JSON.stringify(newGalleryAlts));

      if (editing) {
        if (removedImageIds.length) fd.append('removedImageIds', JSON.stringify(removedImageIds));
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
                    {n.images?.length > 0 && (
                      <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[10px] font-medium text-blue-600">
                        +{n.images.length} photos
                      </span>
                    )}
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
        <Modal title={editing ? 'Edit Article' : 'New Article'} onClose={() => setModalOpen(false)} size="xl">
          <form onSubmit={handleSubmit} className="grid gap-6 lg:grid-cols-[1fr_300px]">
            {/* Left: content fields */}
            <div className="order-2 flex flex-col gap-4 lg:order-1">
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

              <div>
                <div className="flex items-center gap-2">
                  <input
                    placeholder="SEO keywords, comma separated (e.g. police duty software, field ops app)"
                    className="input-field"
                    value={form.metaKeywords}
                    onChange={(e) => setForm({ ...form, metaKeywords: e.target.value })}
                  />
                  <button
                    type="button"
                    onClick={applyAllSuggestions}
                    disabled={keywordSuggestions.length === 0}
                    title="Auto-fill keywords from your title, summary & body"
                    className="btn-outline shrink-0 !px-4 !py-3 text-sm disabled:opacity-40"
                  >
                    <Wand2 size={16} /> Auto-fill
                  </button>
                </div>
                <p className="mt-1 text-xs text-ink-muted">
                  Used only for search engine &amp; social sharing metadata — never shown on the article page.
                </p>
              </div>

              {/* Cover image */}
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">Cover image (used for cards &amp; social sharing)</p>
                {editing?.coverImage?.url && !coverImage && (
                  <img src={editing.coverImage.url} alt="" className="mb-2 h-32 w-full rounded-xl object-cover" />
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
              </div>

              {/* Gallery — multiple images */}
              <div>
                <p className="mb-2 text-sm font-medium text-ink-soft">Additional photos (shown inside the article — up to 6)</p>

                {existingGallery.filter((img) => !removedImageIds.includes(img.publicId)).length > 0 && (
                  <div className="mb-3 grid grid-cols-3 gap-3 sm:grid-cols-4">
                    {existingGallery
                      .filter((img) => !removedImageIds.includes(img.publicId))
                      .map((img) => (
                        <div key={img.publicId} className="relative overflow-hidden rounded-lg border border-ink-border">
                          <img src={img.url} alt={img.alt} className="aspect-square w-full object-cover" />
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
                )}

                {newGalleryFiles.length > 0 && (
                  <div className="mb-3 flex flex-col gap-2">
                    {newGalleryFiles.map((f, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <span className="w-32 shrink-0 truncate text-xs text-ink-muted">{f.name}</span>
                        <input
                          placeholder="Alt text (describe the image, helps SEO)"
                          className="input-field !py-2 text-xs"
                          value={newGalleryAlts[i] || ''}
                          onChange={(e) => {
                            const next = [...newGalleryAlts];
                            next[i] = e.target.value;
                            setNewGalleryAlts(next);
                          }}
                        />
                        <button type="button" onClick={() => removeNewGalleryFile(i)} className="text-red-500 hover:text-red-700">
                          <X size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}

                <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-ink-border p-4 text-sm text-ink-muted transition hover:border-brand hover:text-brand">
                  <ImagePlus size={18} />
                  Add photos to this article
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => addGalleryFiles(e.target.files)}
                  />
                </label>
              </div>

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
            </div>

            {/* Right: live SEO panel */}
            <div className="order-1 lg:order-2 lg:sticky lg:top-0">
              <SeoPanel analysis={seoAnalysis} suggestedKeywords={keywordSuggestions} onUseKeyword={applyKeyword} />
            </div>
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