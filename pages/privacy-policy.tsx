import Layout from '@/components/layout/Layout'

const LAST_UPDATED = 'March 2025'

const sections = [
  {
    title: 'Information We Collect',
    content: `We collect information you provide directly when you use our services. This includes:

Name, email address, phone number, and billing information when you book a session, enroll in a course, or purchase a product from our shop.

Payment information is processed securely through PhonePe (for Indian transactions) and PayPal (for international transactions). We do not store your full payment card details on our servers.

Communications you send us via our contact form, WhatsApp, or email.

Technical information such as your IP address and browser type when you visit our website, used solely for security and analytics purposes.`,
  },
  {
    title: 'How We Use Your Information',
    content: `We use the information we collect to:

Provide, process, and confirm bookings, course enrollments, and shop orders.

Send you transactional emails including booking confirmations, order receipts, and session reminders.

Respond to your enquiries and provide customer support.

Improve our website and services based on how visitors interact with them.

Send you updates about new courses, services, or products — only if you have opted in to receive such communications. You may opt out at any time.`,
  },
  {
    title: 'How We Share Your Information',
    content: `We do not sell, rent, or trade your personal information to third parties.

We share information only with service providers who help us operate our business — including our payment processors (PhonePe, PayPal), email service (AWS SES), and cloud infrastructure (AWS). These providers are bound by strict data processing agreements.

We may disclose information if required to do so by law or in response to valid legal process.`,
  },
  {
    title: 'Data Storage and Security',
    content: `Your data is stored securely on Amazon Web Services (AWS) servers in the Asia Pacific (Mumbai) region. We implement appropriate technical and organisational measures to protect your personal information against unauthorised access, loss, or misuse.

We retain your personal data for as long as necessary to provide our services and comply with our legal obligations. You may request deletion of your data at any time by contacting us.`,
  },
  {
    title: 'Cookies',
    content: `Our website uses essential cookies to function properly — for example, to maintain your shopping cart session. We do not use tracking or advertising cookies.

We use Google Analytics to understand how visitors use our site. This data is anonymised and aggregated and cannot be used to identify you personally. You may disable analytics tracking using standard browser settings or a browser extension.`,
  },
  {
    title: 'Your Rights',
    content: `You have the right to access the personal data we hold about you, request correction of inaccurate data, request deletion of your data, object to or restrict our processing of your data, and withdraw consent for any processing based on consent.

To exercise any of these rights, please contact us at hello@thecosmicconnect.com. We will respond within 30 days.`,
  },
  {
    title: 'Third-Party Links',
    content: `Our website may contain links to third-party websites including YouTube, Instagram, and Facebook. We are not responsible for the privacy practices of these sites and encourage you to review their privacy policies separately.`,
  },
  {
    title: 'Children\'s Privacy',
    content: `Our services are not directed to children under the age of 13. We do not knowingly collect personal information from children. If you believe we have inadvertently collected such information, please contact us immediately and we will delete it.`,
  },
  {
    title: 'Changes to This Policy',
    content: `We may update this Privacy Policy from time to time. We will notify you of significant changes by posting the new policy on this page with an updated date. Your continued use of our services after such changes constitutes your acceptance of the revised policy.`,
  },
  {
    title: 'Contact Us',
    content: `If you have any questions about this Privacy Policy or our data practices, please contact us at:

The Cosmic Connect
GG1/5A PVR Road, Vikaspuri, New Delhi 110018
Email: hello@thecosmicconnect.com
Phone: +91 95994 74758`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <Layout
      title="Privacy Policy | The Cosmic Connect"
      description="Privacy Policy for The Cosmic Connect — how we collect, use, and protect your personal information."
      canonical="/privacy-policy"
    >
      <section className="pt-36 pb-16 px-4 bg-cosmic-gradient">
        <div className="container-cosmic max-w-3xl">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3 text-3xl md:text-4xl">
            Privacy <span className="text-gradient-gold">Policy</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/50 italic">
            Last updated: {LAST_UPDATED}
          </p>

          <p className="font-cormorant text-cosmic-cream/70 text-lg leading-relaxed mt-6">
            The Cosmic Connect ("we", "our", "us") is committed to protecting your privacy.
            This policy explains what information we collect, how we use it, and the choices
            you have regarding your personal data.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-cosmic-section">
        <div className="container-cosmic max-w-3xl space-y-10">
          {sections.map((sec, i) => (
            <div key={sec.title}>
              <h2 className="font-cinzel text-cosmic-cream text-lg font-bold mb-3 flex items-center gap-3">
                <span className="font-cinzel text-cosmic-gold/40 text-sm">{String(i + 1).padStart(2, '0')}</span>
                {sec.title}
              </h2>
              <div className="border-l-2 border-cosmic-gold/15 pl-5">
                {sec.content.split('\n\n').map((para, j) => (
                  <p key={j} className="font-cormorant text-cosmic-cream/65 text-base leading-relaxed mb-3 last:mb-0">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  )
}
