import Layout from '@/components/layout/Layout'

const LAST_UPDATED = 'March 2025'

const sections = [
  {
    title: 'Acceptance of Terms',
    content: `By accessing and using the website thecosmicconnect.com and any services offered by The Cosmic Connect, you accept and agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our website or services.

These terms apply to all visitors, clients, students, and customers of The Cosmic Connect.`,
  },
  {
    title: 'Nature of Services',
    content: `The Cosmic Connect offers spiritual guidance, energy healing, Tarot reading, Akashic Records reading, crystal therapy, courses, and related products through Dr. Usha Bhatt and authorised associates.

All readings, healings, and spiritual guidance provided by The Cosmic Connect are intended for entertainment, personal growth, and spiritual exploration purposes only. They do not constitute medical, legal, financial, or psychological advice.

Results from spiritual services vary between individuals and cannot be guaranteed. The Cosmic Connect makes no warranty that any specific outcome will be achieved from our services.`,
  },
  {
    title: 'Disclaimer of Medical Advice',
    content: `Nothing on this website or in any session with Dr. Usha Bhatt constitutes medical advice, diagnosis, or treatment. Our services are not a substitute for professional medical, psychiatric, legal, or financial advice.

If you are experiencing a medical or mental health emergency, please contact a qualified healthcare professional or emergency services immediately.

By engaging our services, you acknowledge that you understand the nature of spiritual work and that you do so voluntarily and at your own discretion.`,
  },
  {
    title: 'Bookings and Sessions',
    content: `Session bookings are confirmed upon receipt of payment unless otherwise agreed. Sessions must be rescheduled with a minimum of 24 hours notice. Cancellations made less than 24 hours before a scheduled session may not be eligible for a refund.

Online sessions are conducted via video call. A stable internet connection is your responsibility. If technical difficulties prevent the session from being conducted, we will reschedule at no additional charge.

In-person sessions are conducted at our New Delhi studio at GG1/5A PVR Road, Vikaspuri. Please arrive on time. Late arrivals may result in a shorter session.`,
  },
  {
    title: 'Courses',
    content: `Course enrollments are confirmed upon payment. Course materials and recordings are for personal use only and may not be shared, distributed, or resold.

Certificates issued by The Cosmic Connect certify completion of our specific course curriculum and do not represent accreditation by any government or regulatory body.

We reserve the right to remove a student from a course for behaviour that disrupts other students or violates our community standards, without refund.`,
  },
  {
    title: 'Shop and Products',
    content: `All products sold through our shop are subject to our Shipping and Returns Policy, available at thecosmicconnect.com/shipping-returns.

Crystal and gemstone products are natural materials and may have minor variations in colour, size, and appearance. These variations are natural and do not constitute defects.

Product descriptions and the energetic properties attributed to crystals are based on traditional healing and spiritual practice. These are not scientifically verified claims.`,
  },
  {
    title: 'Intellectual Property',
    content: `All content on this website — including text, images, course materials, blog articles, and branding — is the intellectual property of The Cosmic Connect and Dr. Usha Bhatt unless otherwise stated.

You may not reproduce, distribute, or use any of our content for commercial purposes without explicit written permission.

You may share links to our content and quote brief excerpts for non-commercial purposes provided you give clear attribution to The Cosmic Connect.`,
  },
  {
    title: 'Confidentiality',
    content: `Information shared with Dr. Usha Bhatt during sessions is treated with complete confidentiality and will not be shared with third parties without your explicit consent, except where required by law.

We ask that you similarly respect the privacy of other clients and students. Information shared in group settings (such as courses or workshops) should not be disclosed outside that group.`,
  },
  {
    title: 'Limitation of Liability',
    content: `To the maximum extent permitted by law, The Cosmic Connect and Dr. Usha Bhatt shall not be liable for any indirect, incidental, consequential, or punitive damages arising from your use of our services or website.

Our total liability to you for any claim arising from our services shall not exceed the amount you paid for the specific service that gave rise to the claim.`,
  },
  {
    title: 'Governing Law',
    content: `These Terms of Use are governed by the laws of India. Any disputes arising from these terms or your use of our services shall be subject to the exclusive jurisdiction of the courts of New Delhi, India.`,
  },
  {
    title: 'Changes to Terms',
    content: `We reserve the right to modify these Terms of Use at any time. Changes will be posted on this page with an updated date. Continued use of our services after any such changes constitutes your acceptance of the new terms.`,
  },
  {
    title: 'Contact',
    content: `Questions about these Terms of Use may be directed to:

The Cosmic Connect
GG1/5A PVR Road, Vikaspuri, New Delhi 110018
Email: hello@thecosmicconnect.com
Phone: +91 95994 74758`,
  },
]

export default function TermsPage() {
  return (
    <Layout
      title="Terms of Use | The Cosmic Connect"
      description="Terms of Use for The Cosmic Connect — governing your use of our website, services, courses, and products."
      canonical="/terms-of-use"
    >
      <section className="pt-36 pb-16 px-4 bg-cosmic-gradient">
        <div className="container-cosmic max-w-3xl">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3 text-3xl md:text-4xl">
            Terms of <span className="text-gradient-gold">Use</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/50 italic">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="font-cormorant text-cosmic-cream/70 text-lg leading-relaxed mt-6">
            Please read these Terms of Use carefully before using our website or engaging
            any of our services. By proceeding, you agree to be bound by them.
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
