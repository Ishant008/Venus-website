import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Briefcase, MapPin, Clock, ArrowRight } from 'lucide-react';
import api from '../lib/api';
import SEO from '../components/common/SEO';
import SectionHeading from '../components/common/SectionHeading';
import Loader from '../components/common/Loader';
import EmptyState from '../components/common/EmptyState';

export default function Career() {
  const [vacancies, setVacancies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get('/vacancies')
      .then(({ data }) => setVacancies(data.vacancies))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <SEO
        title="Careers"
        description="Join Venus Global Enterprises. Explore current job openings and build software that matters."
        url="/career"
      />
      <section className="bg-ink-surface py-16">
        <div className="container-x">
          <SectionHeading tag="Careers" title="Build software that keeps people safe" description="Explore our open roles and find where you fit." />
        </div>
      </section>

      <section className="container-x py-16">
        {loading ? (
          <Loader />
        ) : vacancies.length === 0 ? (
          <EmptyState icon={Briefcase} title="No open positions right now" description="Check back soon — new roles are posted regularly." />
        ) : (
          <div className="grid gap-6">
            {vacancies.map((v) => (
              <Link key={v._id} to={`/career/${v.slug}`} className="card flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-ink">{v.title}</h3>
                  <div className="mt-2 flex flex-wrap gap-4 text-sm text-ink-muted">
                    {v.department && (
                      <span className="flex items-center gap-1.5">
                        <Briefcase size={14} /> {v.department}
                      </span>
                    )}
                    <span className="flex items-center gap-1.5">
                      <MapPin size={14} /> {v.location}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14} /> {v.employmentType}
                    </span>
                  </div>
                </div>
                <span className="btn-outline shrink-0 !px-5 !py-2.5 text-sm">
                  View &amp; Apply <ArrowRight size={16} />
                </span>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}
