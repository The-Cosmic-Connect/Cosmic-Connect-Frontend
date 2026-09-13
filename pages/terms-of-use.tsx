import Layout from '@/components/layout/Layout'

const LAST_UPDATED = 'September 2026'

const sections = [
  {
    title: '1. About These Terms',
    content: `These Terms and Conditions govern purchases and bookings with Cosmic Connect India LLP, trading as The Cosmic Connect ("we", "us" or "our"), through www.thecosmicconnect.com and our authorised booking channels. They also govern permitted use of our website and paid content. Our contact details appear in section 18.

Before paying, please read these terms and the description of your chosen product, service, course or plan. We will make the applicable terms available before purchase and ask you to accept them through an affirmative action. Browsing our website does not authorise a purchase, recurring payment, session recording or marketing consent.

The description and specific terms shown before purchase form part of your agreement. Our Privacy Policy explains data handling; our Return, Exchange, Cancellation & Refund Policy, Shipping Policy and Disclaimer provide related details. No policy or special term reduces mandatory consumer rights. Where our published refund promises conflict, we will honour the more favourable promise applicable when you purchased. A later website change does not retrospectively reduce your rights.`,
  },
  {
    title: '2. What We Offer',
    content: `Available offerings may include the following, as described in the relevant listing. Inclusion here does not mean every offering is currently available or included in a booking.

Spiritual readings and guidance: Tarot, psychic and oracle readings; Akashic Records and Mokshapat readings; past life regression and related spiritual reflection; pendulum dowsing and gemstone guidance.

Complementary wellness sessions: Reiki, crystal and distance healing; animal healing; sound healing, sound baths, Naad Yoga and meditation; crystal grid work; and spiritual practices described as energy cleansing, protection, or black magic and evil eye scanning and negation.

Learning: Reiki levels and teacher training, Karuna Reiki, Angel Healing, Tarot and oracle reading, crystal therapy, mindfulness, visualisation, mudras, meditation and other advertised workshops or courses.

Products: Crystals, gemstones, jewellery, bracelets, malas, crystal trees and grids, spiritual accessories, meditation tools, incense and other listed merchandise. Digital resources, packages and memberships are covered only where separately offered with clear delivery and access terms.`,
  },
  {
    title: '3. Eligibility and Accounts',
    content: `The person placing an order must be at least 18 and legally competent to contract. Where we expressly offer an age-appropriate activity for a child, a parent or lawful guardian must make the booking, provide the required consent and supervise as instructed. A child cannot independently accept payment obligations. We may decline an activity that is unsuitable for the participant.

Provide accurate contact and booking information and use only payment methods you are authorised to use. Keep account credentials private and report suspected misuse promptly. You are responsible for misuse to the extent caused by your own breach or wrongful conduct; this does not excuse failures in our own security or service.`,
  },
  {
    title: '4. Nature and Limits of Spiritual Services',
    content: `Our spiritual and complementary wellness services are intended for personal reflection, learning and relaxation. They are not medical or veterinary diagnosis or treatment, psychotherapy, or legal, financial or investment advice. Do not stop medication, delay professional care or make a major decision solely because of a reading, product recommendation or session. Seek a qualified professional for the relevant concern.

Words such as "healing", "energy", "cleansing", "protection" and "scanning" describe spiritual practices and beliefs. They do not establish that a disease, curse, harmful force or supernatural influence exists, identify a person as causing harm, or amount to a scientific test. We do not promise to cure illness, remove a verified supernatural threat, control another person, reunite a relationship, produce wealth or predict a certain future.

Past life or regression experiences may be imaginative, symbolic or subjective. They are not verified memories or evidence about historical events or another person's conduct. Readings and dowsing are interpretive practices and must not be used to make medical diagnoses or substitute for factual investigation.

Results and experiences vary. Testimonials describe individual experiences and are not guarantees. Course completion does not guarantee employment, income, professional success or an ability to produce healing outcomes. An honorary title, including an honorary doctorate, does not establish medical registration or a licence to provide clinical care.

These explanations do not excuse misleading statements, unsafe practices, defective goods or a failure to provide what was agreed. We remain responsible for delivering the purchased service with reasonable care and skill and in accordance with applicable law.`,
  },
  {
    title: '5. Consent and Participation',
    content: `Participation is voluntary. The practitioner will explain the activity, relevant preparation and foreseeable practical risks. You may decline touch, a technique, an optional product recommendation or recording, and may pause or stop a session. We will obtain specific permission before physical contact. Purchasing a product or additional session is never required to avoid an alleged spiritual threat.

Tell us about relevant accessibility requirements, sound or scent sensitivities and any information reasonably needed for safe participation. Share only what is necessary. Where suitability is uncertain, consult an appropriate healthcare professional. We may postpone or decline a session for safety reasons and refund the undelivered portion if no suitable alternative is agreed. Stopping because a promised result did not occur does not by itself create a refund right; deficient or unsafe service remains subject to section 9.

For animal sessions, the booking person must be the owner or an authorised carer. Veterinary care must continue when needed, and handling must protect the animal's welfare. Remote sessions do not establish a clinical assessment of a person or animal.

Our channels are not an emergency service. If you or someone else faces immediate danger or a medical emergency, contact local emergency services or an appropriate healthcare provider.`,
  },
  {
    title: '6. Orders and Payments',
    content: `Your order or booking is accepted when we send a confirmation expressly accepting it. An automated acknowledgement of receipt alone is not acceptance. The confirmation will identify the item or service, price and relevant delivery or appointment details. Contact us promptly if it contains an error.

The amount payable, applicable taxes, shipping and any optional charges will be displayed before payment. Prices are in Indian rupees unless clearly stated otherwise. Optional extras require your choice; we will not add undisclosed charges or preselect paid additions. Promotional conditions and expiry dates will be disclosed with the offer.

If an item is unavailable, a material pricing error occurs or a transaction reasonably appears unauthorised, we will explain the issue and offer an appropriate resolution. We will not charge an increased price without your agreement. If we cannot fulfil an accepted order, you may choose an agreed substitute or receive a full refund.

Payments are processed through the payment options identified at checkout. Do not send passwords, card security codes or one-time passwords to staff. Contact us and your payment provider promptly about duplicate or unauthorised payments. Use of a payment processor does not remove our responsibility for an accepted order or a refund we owe.`,
  },
  {
    title: '7. Appointments and Delivery of Sessions',
    content: `Your confirmation will specify the session format, duration, practitioner where relevant, time zone, location or joining instructions and included deliverables. Times are in India Standard Time unless another zone is expressly shown. A named-practitioner booking will not be transferred to someone else without your agreement; if the practitioner becomes unavailable, you may reschedule or receive a refund.

For remote sessions, arrange a suitable device, connection and private setting. For in-person sessions, use the location in your confirmation. Late arrival may reduce the available time to protect the next appointment. Tell us promptly about delays or connection problems; we will try to arrange a workable solution.

If our technical or operational failure prevents delivery, you may choose a replacement session or a refund for the undelivered service. A lost connection on your side will be considered fairly under the cancellation terms, rather than automatically treated as fully delivered service.`,
  },
  {
    title: '8. Cancellations and Rescheduling',
    content: `Request cancellation or a change by email or through the booking channel and retain your acknowledgement. Please give at least 24 hours' notice for an appointment and 48 hours for a live course or workshop. With that notice, you may choose a full refund for the unprovided service or a new available date.

We do not impose automatic forfeiture for a late cancellation or missed appointment as a blanket rule. For a session that never begins, the prepaid fee will be refunded unless you choose to reschedule. For a partly delivered course or package, only the transparently priced portion actually supplied may be retained. Repeated missed bookings may lead us to decline future appointments, without taking away an existing refund entitlement.

If we cancel or materially reschedule a session or course, you may accept an alternative or receive a refund for what we will not deliver. We will not force you to accept credit. Amounts paid for services already properly delivered are not normally refundable merely because you change your mind. Sections 9 and 11 preserve remedies where delivery is deficient or not as described. See our Return, Exchange, Cancellation & Refund Policy for the detailed timing rules that apply to one-to-one appointments, courses and workshops.`,
  },
  {
    title: '9. Service Quality and Refund Processing',
    content: `If a service was not supplied, materially differed from its description or was deficient, contact us with the booking reference and a short explanation. We will investigate and provide the remedy required by law, which may include completing or repeating the service, a price reduction or a refund. Statutory remedies are not discretionary goodwill and are not excluded because a session has ended or a course has begun.

We will process accepted refunds to the original payment method within 7 to 10 business days, or sooner where applicable law or payment rules require. We will notify you when initiated and provide a reference where available. Bank posting times can vary; tell us if the credit does not arrive. We will not unreasonably delay deciding a request or deduct undisclosed administrative or gateway fees. A different refund method or store credit requires your agreement.`,
  },
  {
    title: '10. Physical Goods and Shipping',
    content: `The product listing should identify the material, size or quantity, relevant finish or treatment, inclusions, care instructions and any certification actually included. Natural variation in colour, pattern and shape is not a defect where consistent with the description; it does not excuse delivery of a different, damaged, synthetic or misdescribed item. A certificate is included only if expressly promised. Spiritual energising or cleansing is not a laboratory test, safety certification or guarantee of a physical benefit.

Follow product-specific care and safety instructions. Keep small items away from young children and animals. Do not ingest crystals or use them to prepare drinking water unless the particular product is expressly supplied as suitable for that use with appropriate safety instructions. The phrase "energized water" does not establish drinking-water safety or therapeutic benefit. Use incense, candles and electrical items only as directed, with suitable ventilation and precautions.

Standard domestic shipping is free under our published shipping offer. Domestic delivery is generally estimated at 2 to 7 business days from dispatch unless a different timeline is clearly agreed before purchase. International delivery is available only for destinations we accept, with costs and estimates disclosed before payment. Full details, including customs, duties and delivery risk, are set out in our Shipping Policy.`,
  },
  {
    title: '11. Product Returns and Digital Resources',
    content: `For a damaged, defective, incorrect or materially misdescribed product, contact us promptly, normally within 30 days of delivery, with your order details. This reporting period helps investigation and does not extinguish rights concerning latent defects or other claims permitted by law.

Photos, packaging and an unboxing video can help us investigate, but a video is not a mandatory condition of a remedy. We will consider other reasonable evidence. For valid defect, damage or wrong-item claims, we will arrange return at our cost and provide the replacement, refund or other remedy required by law, including the original delivery charge for the affected purchase.

Change-of-mind returns are separate and discretionary unless the listing promises a return right; customised goods, opened consumables and used personal items are normally excluded but remain covered for defects or misdescription. For digital content, once the agreed content is delivered or accessed, a change-of-mind refund is not normally available, but missing, inaccessible, corrupted or misdescribed content remains eligible for an appropriate remedy. Full detail is set out in our Return, Exchange, Cancellation & Refund Policy.`,
  },
  {
    title: '12. Courses, Packages and Optional Memberships',
    content: `Course listings will state the curriculum, delivery format, prerequisites, schedule, materials, access period and any assessment or attendance requirements for a certificate. A certificate records the training or completion described; it is not a government qualification, medical licence, franchise or permission to represent us unless a specific, verifiable authorisation is expressly given.

Packages must state the number of sessions, price allocation, validity period and any transfer conditions before purchase. There is no automatic renewal or undisclosed expiry. If we cannot provide remaining sessions within the agreed period, we will offer an extension you accept or a refund for the undelivered portion.

If we offer a recurring plan, its price, benefits, billing interval, trial end date, renewal date and cancellation method will be disclosed before enrolment. You can cancel renewal through the disclosed account option or by contacting support before the next charge; we will confirm cancellation and stop future billing without charging a cancellation penalty. Price changes require at least 30 days' advance notice. If we discontinue a plan, we will refund its unused prepaid portion.`,
  },
  {
    title: '13. Privacy, Confidentiality and Recording',
    content: `Our Privacy Policy at www.thecosmicconnect.com/privacy-policy explains the information we collect, purposes, recipients, retention and available choices. We handle personal information under applicable Indian data protection law, including the Information Technology Act and applicable rules, and the Digital Personal Data Protection Act 2023 and its rules as their relevant provisions come into force. Acceptance of these terms is not blanket consent to every use of your data.

Private session information is shared only where needed to deliver or administer the service, with your permission, or where lawfully necessary, including a genuine safety emergency. Group participants must respect one another's privacy; we cannot guarantee other participants' conduct. Share sensitive information privately rather than in a group.

We will not record a session without prior specific consent explaining purpose, access and retention. Marketing use of your name, image, voice, session story or testimonial requires separate permission. You may decline recording or promotional use without losing access to the underlying service, unless recording is an essential, clearly disclosed deliverable you specifically purchase.`,
  },
  {
    title: '14. Content and Conduct',
    content: `We or our licensors own our original website and course materials. Your purchase permits personal study and use of the supplied resources within the stated access period. You may apply skills you learn subject to law, but may not redistribute our paid materials, share logins, sell copies, reproduce our curriculum for teaching or use our branding without permission.

You retain ownership of your contributions. You give us only the permission reasonably needed to receive, store and display content in the context you submit it, such as publishing a review you choose to post publicly. We do not acquire a blanket perpetual marketing licence to private communications.

Do not harass others, impersonate someone, upload unlawful material, infringe rights or interfere with our systems. Honest negative reviews and good-faith complaints are permitted. We may remove unlawful content or restrict access for a material breach, with an explanation and opportunity to resolve it where practicable. Restrictions do not automatically forfeit prepaid undelivered services or lawful refunds.`,
  },
  {
    title: '15. Third Parties and Responsibility',
    content: `Where checkout takes place on an independent marketplace, check the identity of the seller and that platform's order terms. If we are the seller or supply your booked service through a partner, we remain responsible for our own legal and contractual obligations. Merely using a courier, booking tool or payment processor does not transfer those obligations away from us.

External links do not make us responsible for an independent site's content, but we remain accountable for our own representations and any duties imposed by law. We do not guarantee uninterrupted website availability and will take reasonable steps to address service-affecting faults.

Nothing in these terms excludes or limits liability for fraud, wilful misconduct, death or personal injury caused by our negligence, defective products, deficient services, or any other liability or remedy that cannot lawfully be excluded or limited. Consumer compensation and statutory rights are preserved. No fixed monetary cap overrides those rights.`,
  },
  {
    title: '16. Events Beyond Reasonable Control',
    content: `If an event beyond reasonable control disrupts delivery, we will explain the impact and take reasonable steps to reduce delay. We may offer a revised date, but you need not accept a materially different arrangement. Where the paid service or goods cannot be supplied, the applicable cancellation and refund rights remain available. This clause does not permit indefinite retention of money for undelivered purchases.`,
  },
  {
    title: '17. Applicable Law and Changes',
    content: `Indian law governs these terms, subject to mandatory protections that apply to you. Courts in New Delhi may hear disputes where they have lawful jurisdiction. Nothing requires you to waive another competent consumer commission, court, regulator or statutory complaint route available where you reside or work under applicable consumer law.

Please contact us so that we can try to resolve a concern. Doing so is not a mandatory waiting period or a condition of seeking urgent relief or exercising legal rights.

We will date and publish updates and give appropriate notice of material changes. The version accepted at purchase continues to govern that transaction unless a lawful change is agreed or required. If a provision is unenforceable, the remaining provisions continue to the extent lawful. A failure to enforce a term is not a permanent waiver. No course or purchase creates employment, partnership or agency.`,
  },
  {
    title: '18. Contact and Grievance Redressal',
    content: `Business: Cosmic Connect India LLP, trading as The Cosmic Connect.

Registered office & correspondence address: KG1/298, KG1 Road, near Coffeegram, Vikaspuri, New Delhi – 110018, India. Please attend in person only at the location stated in your appointment confirmation.

Email: info@thecosmicconnect.com. Telephone: +91 95994 74758.

Grievance Officer: Puneet Mehta, Co-Founder. Email: info@thecosmicconnect.com, with subject "Attn: Grievance Officer".

Include your order or booking reference, contact details, issue and requested resolution. We will acknowledge consumer complaints within 48 hours and redress them within one month of receipt, in accordance with applicable e-commerce requirements. You may use available statutory remedies without waiting for our internal process to end.`,
  },
]

export default function TermsPage() {
  return (
    <Layout
      title="Terms & Conditions | The Cosmic Connect"
      description="Terms and Conditions for The Cosmic Connect — governing purchases, bookings, courses and use of our website and services."
      canonical="/terms-of-use"
    >
      <section className="pt-36 pb-16 px-4 bg-cosmic-gradient">
        <div className="container-cosmic max-w-3xl">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3 text-3xl md:text-4xl">
            Terms &amp; <span className="text-gradient-gold">Conditions</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/50 italic">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="font-cormorant text-cosmic-cream/70 text-lg leading-relaxed mt-6">
            Please read these Terms and Conditions carefully before using our website, booking a
            session or course, or purchasing a product. By proceeding, you agree to be bound by them.
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
