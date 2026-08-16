import { useState } from 'react';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import api from '../../lib/api';
import { useAuth } from '../../context/AuthContext';

export default function AdminSettings() {
  const { user } = useAuth();
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }
    if (form.newPassword.length < 8) {
      toast.error('New password must be at least 8 characters');
      return;
    }
    setSaving(true);
    try {
      await api.put('/auth/change-password', {
        currentPassword: form.currentPassword,
        newPassword: form.newPassword,
      });
      toast.success('Password updated successfully');
      setForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div>
      <h1 className="font-title text-2xl">Settings</h1>
      <p className="mt-1 text-sm text-ink-muted">Manage your admin account.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="card p-6">
          <h3 className="font-semibold">Account</h3>
          <div className="mt-4 space-y-2 text-sm">
            <p>
              <span className="text-ink-muted">Username:</span> {user?.username}
            </p>
            <p>
              <span className="text-ink-muted">Email:</span> {user?.email}
            </p>
          </div>
        </div>

        <div className="card p-6">
          <h3 className="flex items-center gap-2 font-semibold">
            <KeyRound size={18} /> Change Password
          </h3>
          <form onSubmit={handleSubmit} className="mt-4 flex flex-col gap-4">
            <input
              required
              type="password"
              placeholder="Current password"
              className="input-field"
              value={form.currentPassword}
              onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            />
            <input
              required
              type="password"
              placeholder="New password (min 8 characters)"
              className="input-field"
              value={form.newPassword}
              onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            />
            <input
              required
              type="password"
              placeholder="Confirm new password"
              className="input-field"
              value={form.confirmPassword}
              onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
            />
            <button type="submit" disabled={saving} className="btn-primary justify-center">
              {saving ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
