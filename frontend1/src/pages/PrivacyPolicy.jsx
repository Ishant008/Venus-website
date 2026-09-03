import SEO from '../components/common/SEO';

export default function PrivacyPolicy() {
  return (
    <>
      <SEO title="Privacy Policy" description="Privacy policy for Venus Global Enterprises." url="/privacy-policy" />
      <section className="container-x py-16">
        <div className="mx-auto max-w-3xl">
          <h1 className="font-title text-3xl">Privacy Policy</h1>
          <p className="mt-2 text-sm text-ink-muted">Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}</p>

          <div className="prose prose-ink mt-8 max-w-none">
            <p>
              This Privacy Policy explains how Venus Global Enterprises ("we", "us", "our") collects, uses, and
              protects information when you visit venusglobal.com (the "Site").
            </p>

            <h2>Information we collect</h2>
            <ul>
              <li>Information you submit through our contact and job-application forms (name, email, phone, resume, message).</li>
              <li>Usage data collected automatically via analytics tools (pages visited, device/browser type, approximate location).</li>
              <li>Cookies used by third-party services described below.</li>
            </ul>

            <h2>How we use it</h2>
            <ul>
              <li>To respond to enquiries and process job applications.</li>
              <li>To understand how visitors use the Site and improve it.</li>
              <li>To display relevant advertising, where enabled.</li>
            </ul>

            <h2>Third-party services</h2>
            <p>We may use the following third-party services, each governed by its own privacy policy:</p>
            <ul>
              <li><strong>Google Analytics</strong> — website traffic analysis.</li>
              <li><strong>Microsoft Clarity</strong> — usage analytics and session recordings.</li>
              <li><strong>Google AdSense</strong> — displays advertisements and may use cookies to personalize ads based on your visits to this and other sites. You can opt out of personalized advertising by visiting{' '}
                <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>.
              </li>
              <li><strong>Google reCAPTCHA</strong> — spam protection on our forms, governed by the{' '}
                <a href="https://policies.google.com/privacy" target="_blank" rel="noopener noreferrer">Google Privacy Policy</a>.
              </li>
              <li><strong>Cloudinary</strong> — hosts images displayed on the Site.</li>
            </ul>

            <h2>Cookies</h2>
            <p>
              We use cookies and similar technologies to operate the Site, remember your preferences (such as
              language), and — where enabled — to support analytics and advertising.
            </p>

            <h2>Your choices</h2>
            <p>
              You can control cookies through your browser settings. Opting out of certain cookies may affect
              Site functionality.
            </p>

            <h2>Data retention & security</h2>
            <p>
              We retain job-application data only as long as needed to evaluate applications, and take reasonable
              technical measures to protect submitted information.
            </p>

            <h2>Contact us</h2>
            <p>
              For questions about this policy, contact us at{' '}
              <a href="mailto:venusglobal2020@gmail.com">venusglobal2020@gmail.com</a>.
            </p>
          </div>

          <div className="mt-10 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
            <strong>Note for the site owner:</strong> this is a starting template, not legal advice. Please have
            it reviewed against your actual data practices (and applicable law, e.g. India's DPDP Act) before
            relying on it — especially before your AdSense application, which requires an accurate policy.
          </div>
        </div>
      </section>
    </>
  );
}