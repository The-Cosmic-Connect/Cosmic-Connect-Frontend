import Layout from '@/components/layout/Layout'

const LAST_UPDATED = 'August 2026'

const sections = [
  {
    title: '1. Legal Identity and Privacy Contact',
    content: `Legal entity: Cosmic Connect India LLP, trading as The Cosmic Connect ("TCC", "we", "us" or "our"). Website: www.thecosmicconnect.com.

Privacy / Grievance Officer: Puneet Mehta. Email: info@thecosmicconnect.com. Phone/WhatsApp: +91 95994 74758. Postal / consumer-contact address: KG1/298, KG1 Road, near Coffeegram, Vikaspuri, New Delhi – 110018, India.

This policy applies to www.thecosmicconnect.com, direct online/offline bookings and orders, customer support, in-person and online sessions, courses, workshops and events, forms, and other interactions where we determine the purposes for which personal information is processed. A third-party marketplace, payment gateway, social network, courier or learning platform may have its own privacy policy for data it independently controls.`,
  },
  {
    title: '2. Indian Data-Protection Framework',
    content: `As of the date of this policy, the Information Technology Act, 2000, including the data-security framework under section 43A and the Information Technology (Reasonable Security Practices and Procedures and Sensitive Personal Data or Information) Rules, 2011 ("SPDI Rules"), remains relevant to our handling of applicable personal and sensitive personal data in India.

The Digital Personal Data Protection Act, 2023 ("DPDP Act") and Digital Personal Data Protection Rules, 2025 have phased commencement. Certain institutional provisions came into force in November 2025, while the principal provisions governing day-to-day processing obligations, consent and Data Principal rights are scheduled to commence later per the Government's notified timeline. We avoid describing provisions as already mandatory when they are not yet in force, while voluntarily designing our processes to transition toward the DPDP framework as it becomes applicable.`,
  },
  {
    title: '3. Personal Information We May Collect',
    content: `Identity and contact information: name, email address, telephone/WhatsApp number, postal address, billing/shipping address and account or login details where offered.

Order, payment and transaction information: products/services purchased, order and invoice details, payment status, transaction/reference IDs, refunds, discounts, delivery information and customer-service history. Full card or banking credentials are ordinarily processed by the relevant payment provider rather than stored by us.

Booking, spiritual-guidance and service information: appointment details, service selected, questions you ask, session preferences, notes reasonably needed to deliver the service, and follow-up or feedback you choose to provide. Birth details (date, time, place) where relevant to an astrology-linked, numerology or spiritual guidance service. Photographs, voice/video or other media you voluntarily provide for a requested distance/photo-based energy session, reading or report.

Health or wellbeing information: information you voluntarily provide about physical, physiological or mental-health conditions, medical history, medication, allergies, pregnancy, sensory sensitivity, mobility/accessibility or other wellbeing matters relevant to safe participation in a session (including sound healing, Reiki and other energy sessions). Some health information may constitute "sensitive personal data or information" under the SPDI Rules.

Course, workshop and event information: enrollment, attendance, course progress, assignments, certificates, questions, feedback and access history for digital learning material.

Pet/animal service information: pet name, species, age, photograph, owner contact details and information voluntarily supplied for a requested complementary energy session.

Communications and user content: emails, WhatsApp messages, support requests, reviews, testimonials, survey responses and other communications you send us. If a private session is to be recorded by us, the purpose and practice will be disclosed beforehand; we do not treat participation as blanket consent to public use of that session.

Technical, usage and security information: IP address, browser/device type, operating system, referring page, pages viewed, approximate location, cookie identifiers, timestamps, login/security events and other diagnostic data, plus fraud/abuse/cybersecurity information reasonably required to protect accounts and comply with lawful cybersecurity directions.`,
  },
  {
    title: '4. How We Collect Information',
    content: `We collect information directly from you when you browse the website, submit a form, create an account, place an order, make a booking, enrol, contact us, attend a session/course/event, provide feedback or otherwise communicate with us.

We may receive limited information from payment providers, marketplaces, couriers, booking/learning platforms or social-media platforms when necessary to complete a transaction or when you have authorised the interaction.

We may receive information about you from another person — for example, where a family member books a service for you. We ask users not to provide another adult's confidential information without authority, and may seek confirmation directly from the person concerned where appropriate.`,
  },
  {
    title: '5. Why We Use Personal Information',
    content: `To process orders, bookings, payments, invoices, refunds and deliveries. To provide the requested reading, complementary wellness session (including Reiki, crystal, sound and distance healing), pet session, report, course, workshop, event or digital content. To personalize a service using information you specifically provide, such as birth details, preferences or relevant participation/safety information. To communicate confirmations, reminders, schedule changes, support responses and other transaction-related messages. To maintain accounts, prevent fraud, secure systems and preserve records relevant to disputes or cybersecurity incidents. To maintain accounting, tax and consumer-grievance records required by law. To understand website/service usage and improve navigation, using data that is aggregated, minimized or otherwise handled in accordance with applicable law. To send newsletters, offers or promotional communications where you have opted in.`,
  },
  {
    title: '6. Consent, Choice and Data Minimisation',
    content: `Where current law requires consent for sensitive personal data, we seek it through an appropriate written/electronic mechanism. As the substantive DPDP consent provisions come into force, our notices and consent mechanisms will be updated accordingly.

You may decline to provide optional information. If particular information is genuinely necessary to provide a requested service or fulfil a legal/transactional requirement, we may be unable to provide that part of the service without it.

Please share only information that is reasonably relevant. Avoid sending unnecessary medical records, identity documents, bank details, passwords or intimate third-party information through ordinary WhatsApp/email when it is not needed.`,
  },
  {
    title: '7. Cookies, Analytics and Similar Technologies',
    content: `Our website may use cookies, local storage, pixels or similar technologies — including essential cookies required for security, login, cart/checkout and core site functions; functional cookies that remember preferences; and analytics/performance technologies that help us understand site usage.

Where consent is required for non-essential cookies, we use a consent/banner mechanism. Rejecting non-essential cookies should not prevent access to core website functions, although some optional features may be reduced.`,
  },
  {
    title: '8. Marketing Communications',
    content: `Marketing email, SMS or WhatsApp communications are sent in accordance with applicable consent and telecom/communication requirements. You can opt out using an unsubscribe mechanism where provided or by contacting us. Opting out of marketing does not stop necessary transactional messages such as booking confirmations, payment receipts, shipping updates, security notices or responses to your support request.`,
  },
  {
    title: '9. When We Share Personal Information',
    content: `We do not sell or rent private client information to third parties for their independent advertising. We may share the minimum information reasonably necessary with service providers that support our operations — website/hosting and cloud providers, payment gateways, couriers/fulfilment partners, learning/video/booking platforms, email/messaging providers, analytics/security vendors, accountants, auditors and professional advisers.

If you buy through a third-party marketplace, the marketplace may independently collect and process order, payment and delivery information under its own privacy terms. We may disclose information where reasonably necessary to comply with law, court order, lawful government request, tax/audit obligation, consumer dispute process, cybersecurity incident response, fraud investigation or protection of rights/safety. In a merger, restructuring, acquisition or sale of business/assets, information may be transferred subject to confidentiality, applicable law and continuity of appropriate privacy protection.`,
  },
  {
    title: '10. Use of AI-Assisted and Automated Tools',
    content: `We may use AI-assisted software or automation for limited business purposes such as drafting non-confidential content, categorising support requests, summarising operational material or improving workflows. We aim to minimise or de-identify personal data before using such tools where feasible.

We do not treat a private spiritual/wellness session as permission to upload identifiable confidential session information to public generative-AI tools for unrelated training, advertising or publication. We do not intend to make decisions with significant legal or similarly serious effects on a customer solely through automated profiling without appropriate human involvement.`,
  },
  {
    title: '11. International Data Transfers',
    content: `Some website, cloud, communication, learning, analytics or payment providers may process data outside India, and international customers may provide information to us from outside India. Cross-border transfers are handled in accordance with the law applicable at the time; as the DPDP cross-border provisions become applicable, we will comply with any country restrictions or conditions notified by the Government of India.`,
  },
  {
    title: '12. Data Retention',
    content: `We retain personal information only for as long as reasonably necessary for the purpose for which it was collected, to maintain a lawful business record, resolve disputes, prevent fraud, enforce agreements or meet tax, accounting, consumer or cyber-security obligations.

Retention periods differ by category: transaction/invoice records may be retained for statutory accounting/tax periods; unresolved complaints or disputes may be retained until appropriately closed; course records may be retained for certificate/learning administration; and security/event logs may be retained for periods required under applicable cybersecurity directions. When information is no longer required, we delete, anonymise or securely isolate it as appropriate.`,
  },
  {
    title: '13. Security Practices and Cyber-Incident Response',
    content: `We use reasonable administrative, technical and organisational safeguards appropriate to the nature of the information and our systems — role-based access, authentication, access logging, secure payment providers, software updates, anti-malware/security controls, backups, vendor due diligence and incident-response procedures.

No internet transmission, messaging service, cloud platform or storage system can be guaranteed absolutely secure. You should keep account passwords, OTPs and devices secure and notify us promptly if you suspect unauthorised access relating to our services. Where a cyber incident or personal-data breach triggers legal reporting duties, we will take reasonable containment/remediation steps and notify CERT-In, another competent authority and/or affected individuals as required by law.`,
  },
  {
    title: '14. Your Choices and Rights',
    content: `Under the current SPDI framework, where applicable, you may ask to review and correct personal information/SPDI you supplied and may withdraw consent for future processing. We also accept reasonable requests for access, correction, updating or deletion of personal information, subject to identity verification, legal retention obligations and technical feasibility.

As the substantive DPDP rights provisions come into force, eligible Data Principals will have the rights available under the Act, including access to processing information, correction/completion/updating, erasure, grievance redressal and nomination.

To submit a request, contact info@thecosmicconnect.com with the subject "Privacy Request" and sufficient information to identify the relevant account/order/booking. We aim to respond within 30 days where reasonably possible, and within any shorter mandatory period that applies.`,
  },
  {
    title: '15. Children and Minors',
    content: `For privacy purposes, we treat a person under 18 as a minor unless applicable law requires another treatment. Our website and services are primarily directed to adults; certain readings or offerings may be restricted to adults even if a guardian is available.

Where a permitted service is provided to a minor, a parent/legal guardian must provide the required authority/consent and should ordinarily make the booking; we collect only information reasonably necessary for that service. We do not intentionally use a minor's personal data for behavioural advertising, tracking or profiling directed at the child. If you believe a minor supplied personal information without required guardian involvement, contact us so we can investigate and delete or restrict the data where appropriate.`,
  },
  {
    title: '16. Session Confidentiality and Group Settings',
    content: `We aim to keep information disclosed in private sessions confidential within the limits of law, safety, payment/administration needs and authorised operational access. Confidentiality cannot be promised against a valid legal disclosure requirement.

In group courses, workshops, online meetings or events, other participants may see or hear your name, image, voice or contributions. Please do not disclose another participant's personal story, recording, contact details or screenshots outside the group without permission.`,
  },
  {
    title: '17. Testimonials, Photographs and Publicity',
    content: `We will not treat a paid client relationship as automatic consent to publish a testimonial, case study, photograph, video or identifiable personal story. Where identifiable material is used for marketing/publicity, we will seek the permission required by applicable law and the context. If you withdraw permission for future digital use, we will take reasonable steps to stop new use and remove material from channels under our control where feasible.`,
  },
  {
    title: '18. Third-Party Websites and Services',
    content: `Links to social networks, marketplaces, maps, payment providers, learning systems or other external websites are governed by those providers' privacy practices when you interact directly with them. We are not responsible for an independent third party's privacy practices merely because we link to it.`,
  },
  {
    title: '19. Complaints, Escalation and the Data Protection Board',
    content: `Privacy / Grievance Officer: Puneet Mehta. Email: info@thecosmicconnect.com. Phone/WhatsApp: +91 95994 74758. Postal / consumer-contact address: KG1/298, KG1 Road, near Coffeegram, Vikaspuri, New Delhi – 110018, India.

The Data Protection Board of India has been established under the DPDP Act. The ability to escalate a particular grievance and the applicable procedure depend on the provisions and rules in force at that time. Nothing in this policy prevents you from using another competent authority or statutory remedy available under applicable law.`,
  },
  {
    title: '20. Changes to This Policy',
    content: `We may update this policy to reflect legal commencement dates, new modalities, technology, vendors, cookies, security practices or business processes. The current version and "Last Updated" date will be posted on this page. Where a change materially affects an existing consent or requires fresh consent, we will address that as required by law.`,
  },
]

export default function PrivacyPolicyPage() {
  return (
    <Layout
      title="Privacy Policy | The Cosmic Connect"
      description="Privacy Policy for The Cosmic Connect — how we collect, use, share, retain and protect your personal information."
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
            Cosmic Connect India LLP, trading as The Cosmic Connect ("we", "our", "us"), respects
            the privacy of customers, clients, learners, website visitors and other individuals
            whose personal information we handle. This policy explains what we collect, why we use
            it, when it may be shared, how long it is retained, the safeguards we apply and how you
            can raise a request or grievance.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 bg-cosmic-section">
        <div className="container-cosmic max-w-3xl space-y-10">
          {sections.map((sec) => (
            <div key={sec.title}>
              <h2 className="font-cinzel text-cosmic-cream text-lg font-bold mb-3">
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
