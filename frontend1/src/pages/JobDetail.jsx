import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import toast from 'react-hot-toast';
import { ArrowLeft, MapPin, Clock, Briefcase, UploadCloud, CheckCircle2 } from 'lucide-react';
import api from '../lib/api';
import SEO from '../components/common/SEO';
import Loader from '../components/common/Loader';

export default function JobDetail() {
  const { slug } = useParams();
  const [vacancy, setVacancy] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [resume, setResume] = useState(null);

  useEffect(() => {
    setLoading(true);
    api
      .get(`/vacancies/${slug}`)
      .then(({ data }) => setVacancy(data.vacancy))
      .catch(() => setError('Job not found'))
      .finally(() => setLoading(false));
  }, [slug]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resume) return toast.error('Please attach your resume (PDF or Word)');

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.append('name', form.name);
      fd.append('email', form.email);
      fd.append('phone', form.phone);
      fd.append('message', form.message);
      fd.append('vacancyId', vacancy._id);
      fd.append('resume', resume);

      await api.post('/applicants', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSubmitted(true);
      toast.success('Application submitted successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <Loader />;
  if (error || !vacancy) {
    return (
      <div className="container-x py-24 text-center">
        <p className="text-ink-muted">This job opening could not be found.</p>
        <Link to="/career" className="btn-primary mt-6 inline-flex">
          <ArrowLeft size={18} /> Back to Careers
        </Link>
      </div>
    );
  }

  return (
    <>
      <SEO title={vacancy.title} description={vacancy.description?.slice(0, 160)} url={`/career/${vacancy.slug}`} />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'JobPosting',
            title: vacancy.title,
            description: vacancy.description,
            datePosted: vacancy.createdAt,
            employmentType: { 'Full-time': 'FULL_TIME', 'Part-time': 'PART_TIME', Contract: 'CONTRACTOR', Internship: 'INTERN' }[
              vacancy.employmentType
            ] || 'FULL_TIME',
            hiringOrganization: {
              '@type': 'Organization',
              name: 'Venus Global Enterprises',
              sameAs: import.meta.env.VITE_SITE_URL || undefined,
            },
            jobLocation: {
              '@type': 'Place',
              address: {
                '@type': 'PostalAddress',
                addressLocality: vacancy.location,
                addressCountry: 'IN',
              },
            },
            ...(vacancy.experience && vacancy.experience !== 'Not specified'
              ? { experienceRequirements: vacancy.experience }
              : {}),
          })}
        </script>
      </Helmet>
      <section className="container-x py-14">
        <Link to="/career" className="mb-8 inline-flex items-center gap-2 text-sm text-ink-muted hover:text-brand">
          <ArrowLeft size={16} /> Back to Careers
        </Link>

        <div className="grid gap-10 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <h1 className="font-title text-3xl text-ink sm:text-4xl">{vacancy.title}</h1>
            <div className="mt-4 flex flex-wrap gap-4 text-sm text-ink-muted">
              {vacancy.department && (
                <span className="flex items-center gap-1.5"><Briefcase size={14} /> {vacancy.department}</span>
              )}
              <span className="flex items-center gap-1.5"><MapPin size={14} /> {vacancy.location}</span>
              <span className="flex items-center gap-1.5"><Clock size={14} /> {vacancy.employmentType}</span>
            </div>

            <p className="mt-6 whitespace-pre-line text-ink-soft">{vacancy.description}</p>

            {vacancy.requirements?.length > 0 && (
              <div className="mt-8">
                <h2 className="font-title text-xl">Requirements</h2>
                <ul className="mt-4 space-y-2">
                  {vacancy.requirements.map((r, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-ink-soft">
                      <CheckCircle2 className="mt-0.5 shrink-0 text-brand" size={16} /> {r}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {vacancy.tags?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {vacancy.tags.map((t) => (
                  <span key={t} className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Apply form */}
          <div>
            <div className="card sticky top-24 p-6">
              {submitted ? (
                <div className="flex flex-col items-center gap-3 py-8 text-center">
                  <CheckCircle2 className="text-brand" size={40} />
                  <h3 className="font-semibold">Application received!</h3>
                  <p className="text-sm text-ink-muted">We'll get back to you if your profile matches.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <h3 className="font-title text-lg">Apply for this role</h3>
                  <input
                    required
                    placeholder="Full name"
                    className="input-field"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                  />
                  <input
                    required
                    type="email"
                    placeholder="Email address"
                    className="input-field"
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                  />
                  <input
                    required
                    placeholder="Phone number"
                    className="input-field"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  />
                  <textarea
                    placeholder="Why are you a good fit? (optional)"
                    rows={3}
                    className="input-field resize-none"
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                  />
                  <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border border-dashed border-ink-border p-5 text-center text-sm text-ink-muted transition hover:border-brand hover:text-brand">
                    <UploadCloud size={22} />
                    {resume ? resume.name : 'Upload resume (PDF/DOC, max 5MB)'}
                    <input
                      required
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => setResume(e.target.files[0])}
                    />
                  </label>
                  <button type="submit" disabled={submitting} className="btn-primary justify-center">
                    {submitting ? 'Submitting...' : 'Submit Application'}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}