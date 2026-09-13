import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const LAST_UPDATED = 'August 2026'

const shippingSections = [
  {
    title: '1. Where We Ship',
    content: `We ship to serviceable addresses in India and may offer international shipping to selected countries and product categories. Availability can depend on courier coverage, destination restrictions, commodity type, customs rules, package size/weight and other operational factors.

Certain minerals, plant-derived cleansing products, incense, liquids, oils, wood, religious/spiritual items or other products may be restricted or require additional documentation in some destinations. We may decline or cancel an international shipment that cannot lawfully or reasonably be fulfilled, with the appropriate refund for the unshipped item.`,
  },
  {
    title: '2. Order Confirmation, Verification and Processing',
    content: `An order acknowledgement does not necessarily mean the parcel has been dispatched. Before dispatch we may verify payment, address, stock, variant, quantity, fraud indicators or any information reasonably required to fulfil the order.

Ready-stock orders are processed as reasonably practicable. Customized, resized, assembled-to-order, specially selected or individually prepared/energized products may require additional preparation time where this is disclosed on the product page, order confirmation or customer communication. If an item unexpectedly becomes unavailable after payment, we will contact you with a reasonable substitute, revised timeline or cancellation/refund option.`,
  },
  {
    title: '3. Domestic Delivery Estimates',
    content: `Most domestic orders are currently estimated to arrive within approximately 2–7 business days after dispatch, depending on destination and courier serviceability. Remote areas, weather, peak-season volumes, public holidays and other factors can extend this estimate.

A delivery estimate is not a guarantee unless the order confirmation expressly states a particular date is guaranteed. If delivery becomes materially delayed, contact us so we can investigate with the carrier and provide the remedy required by the order terms and applicable consumer law.`,
  },
  {
    title: '4. Shipping Charges',
    content: `Standard domestic shipping is currently offered without a separate shipping charge where the website or checkout states "free shipping" or equivalent. If a shipping, express, remote-area, international or other delivery charge applies, it will be disclosed before the transaction is completed.

International shipping charges are generally calculated according to destination, weight/volumetric weight, carrier service and product restrictions, and will be displayed or communicated before the international order is confirmed.`,
  },
  {
    title: '5. Courier Partners and Shipping Method',
    content: `We use reputable courier, postal and logistics providers according to serviceability, package characteristics and destination. We may change the assigned carrier without changing your substantive rights. Standard or express options may be offered where available; a request for a preferred courier is not guaranteed unless confirmed by us in writing.`,
  },
  {
    title: '6. Tracking and Delivery Communications',
    content: `Where tracking is available, we will send or make available a tracking number/link after dispatch. Tracking events are supplied by the carrier and can occasionally update late or out of sequence.

Carriers may contact you by telephone, SMS, WhatsApp, email or app notification for delivery coordination, address clarification, OTP/signature or proof of delivery. Never share payment PINs, card CVV, banking passwords or unrelated OTPs with anyone claiming to be a courier or The Cosmic Connect.`,
  },
  {
    title: '7. Customer Address and Contact Responsibility',
    content: `Please provide a complete and accurate recipient name, mobile number, postal address, PIN/postal code and any necessary landmark. We are not responsible for delay caused solely by materially incorrect or incomplete information supplied by the customer after a reasonable verification opportunity.

If you notice an address error before dispatch, contact us immediately — we will try to update it but cannot guarantee a carrier can reroute a parcel after dispatch. If a conforming parcel is returned because of repeated failed delivery, refusal without a valid consumer-right basis, or an incorrect address supplied by the customer, re-shipping may require payment of the actual additional logistics cost.`,
  },
  {
    title: '8. Delivery, Proof of Delivery and Risk',
    content: `A parcel may be delivered to the named recipient or, where reasonable and accepted by the carrier/recipient, to an authorised person, reception/security desk or other delivery point at the address. Carrier proof such as OTP confirmation, signature, geo-tag or delivery scan may be used to investigate a dispute.

We do not use a blanket disclaimer to shift all transit risk to the customer. If a parcel is genuinely lost or materially damaged before confirmed delivery, contact us — we will investigate and provide the remedy due under our Return, Exchange, Cancellation & Refund Policy and applicable consumer law.`,
  },
  {
    title: '9. Damaged, Tampered, Wrong or Missing Shipments',
    content: `If the outer package is visibly tampered or seriously damaged, note the condition with the carrier where possible and photograph it before opening. Report a damaged, wrong, incomplete or missing-item delivery promptly, preferably within 48 hours after delivery, with the order number and reasonable evidence such as photographs of the item, outer packaging and shipping label. A video may help but is not an absolute condition for a valid statutory claim.

Preserve the item and packaging until we have had a reasonable opportunity to investigate. Accepted claims will be remedied under our Return, Exchange, Cancellation & Refund Policy.`,
  },
  {
    title: '10. Delivery Delays and Events Beyond Reasonable Control',
    content: `Delays can occur because of severe weather, natural disaster, epidemic, public disorder, transport strike, widespread network/system outage, regulatory hold, government restriction, customs delay, courier capacity, remote-area access or another event beyond reasonable control. We will not describe every delay as force majeure — where the delay is attributable to our own fulfilment failure or the seller's controllable conduct, the consumer remedies applicable to the circumstances will be respected.`,
  },
  {
    title: '11. International Shipping, Duties and Customs',
    content: `International customers are responsible for import duties, customs charges, local taxes, brokerage or other destination-country charges unless we expressly sell the shipment on a duty-paid basis. Customs authorities may inspect, hold, open or reject a shipment; delivery estimates do not include a guaranteed customs-clearance time.

If an international parcel is returned because the recipient refuses legally applicable duties, fails required customs action, or ordered an item prohibited at destination after the restriction was reasonably disclosed, any refund for the returned goods may exclude reasonable non-recoverable outward/return carrier charges or duties paid by us, to the extent permitted by law. Defective, wrong or materially misdescribed goods remain subject to your statutory rights.`,
  },
  {
    title: '12. Packaging and Natural Products',
    content: `We use packaging appropriate to the nature and fragility of the product. Crystals, stones and handcrafted items may naturally vary in colour, inclusions, veining, shape, texture and minor dimensions as described on the product page — such disclosed natural variation is not transit damage.

Please use care when opening parcels containing fragile, sharp-edged, heavy or breakable products. Keep small stones, jewellery components, incense and similar items away from children and pets where ingestion, breakage, smoke or choking could create a safety risk.`,
  },
  {
    title: '13. Legal Metrology, Invoice and Product Declarations',
    content: `Physical products are listed and packaged with the declarations required by applicable Indian law, including the Legal Metrology Act, 2009 and the Legal Metrology (Packaged Commodities) Rules, 2011, as applicable — including manufacturer/packer/importer details, country of origin for imported goods, common/generic name, net quantity, MRP inclusive of taxes and consumer-care details. Shipping labels and courier documentation serve logistics purposes and do not replace mandatory product/package or e-commerce listing declarations.`,
  },
  {
    title: '14. Third-Party Marketplaces',
    content: `For orders placed through Amazon or another third-party marketplace, that platform may control dispatch, tracking, delivery, return labels and customer communications. Its operational process may apply in addition to our obligations as seller.`,
  },
  {
    title: '15. Contact and Grievance Redressal',
    content: `Shipping support: info@thecosmicconnect.com | +91 95994 74758. Consumer-contact address: KG1/298, KG1 Road, near Coffeegram, Vikaspuri, New Delhi – 110018, India.

Grievance Officer: Puneet Mehta. We aim to acknowledge consumer complaints within 48 hours and redress them within one month, in line with applicable e-commerce requirements.`,
  },
  {
    title: '16. Policy Updates',
    content: `We may update carriers, service areas, delivery estimates or this policy as operations and laws change. Any material term applicable to an order will be determined by the information displayed/confirmed for that transaction together with mandatory law.`,
  },
]

const returnSections = [
  {
    title: '1. Mandatory Consumer Rights Prevail',
    content: `Nothing in this policy limits a remedy that must be provided by law. We will not rely on a "no return", "no refund", custom-product, opened-package or similar clause to defeat a statutory remedy where goods or services are defective, deficient, spurious, materially different from what was advertised or agreed, wrongly supplied, or otherwise subject to a mandatory consumer remedy.

A spiritual, intuitive or complementary-wellness service — including tarot, Reiki, crystal healing and sound healing — is not defective merely because a customer did not receive a desired prediction, energetic sensation, emotional response, relationship outcome, health outcome, financial result or other subjective result that was never guaranteed. This does not excuse misrepresentation, deficiency in the promised service, fraud or other legally actionable conduct.`,
  },
  {
    title: '2. Product Returns — Goodwill Eligibility',
    content: `In addition to statutory rights, we currently permit a return request within 30 days after delivery for an eligible physical product when the item is unused, unworn, unaltered and returned with its original packaging, invoice and any certificate or accessory supplied with it, subject to the exclusions below. For an accepted goodwill return, the customer is responsible for safe return shipping and transit risk until the item is received by us.

Not eligible for change-of-mind return: customized, personalized, engraved, resized or made-to-order items; items specifically prepared, ritualized or energized for an identified customer where that individualized preparation was clearly disclosed before purchase; used, worn, damaged, contaminated or incomplete products where the condition arose after delivery; and opened or used consumable items such as incense, sage or oils where hygiene or safe resale makes a change-of-mind return unreasonable — unless a statutory remedy applies. These exclusions apply only to voluntary change-of-mind returns and do not remove rights for defective, wrong or materially misdescribed goods.`,
  },
  {
    title: '3. Damaged, Defective, Wrong or Missing Products',
    content: `Contact us promptly if a parcel arrives damaged, an item is missing, the wrong item is supplied, the product is materially defective, or the item materially differs from the description or variant confirmed in your order. Please provide the order number and reasonable supporting material such as clear photographs of the item, outer packaging, shipping label and the defect or mismatch — an unboxing video can help but is not the sole acceptable form of proof.

Keep the product and packaging until we advise whether return collection, inspection or another step is required. Where the claim is accepted, the remedy may be repair where appropriate, replacement, exchange, refund or another remedy required by law — for an accepted defective/wrong-item return, we bear or reimburse reasonable return-shipping costs.`,
  },
  {
    title: '4. Crystals, Gemstones and Authenticity Disputes',
    content: `Natural crystals, gemstones, minerals and handcrafted items may show variations in colour, inclusions, veining, transparency, shape, weight, dimensions, polish, texture or pattern. A natural variation consistent with the listing and disclosed tolerance is not by itself a defect. Screen settings, photography and lighting can create minor colour differences.

If an item was specifically sold as natural, genuine or of a stated material and credible evidence suggests the representation is materially false, contact us — we will not require proof only through one named gemological institute, and may reasonably request an independent report or arrange appropriate testing. Trade descriptions such as AA or AAA are not universal gemological standards unless a particular grading methodology is expressly identified.`,
  },
  {
    title: '5. Product Cancellation Before Dispatch',
    content: `If you ask to cancel a physical-product order before dispatch, we will make reasonable efforts to stop fulfilment, and the amount paid for the cancelled item will ordinarily be refunded in full. Once an order has been dispatched, it may need to follow the return process after delivery. We do not impose a separate cancellation penalty merely for submitting a cancellation request.`,
  },
  {
    title: '6. One-to-One Appointments and Healing/Guidance Sessions',
    content: `You may cancel or reschedule a one-to-one appointment (tarot, Reiki, sound healing, Akashic reading or any other session) by contacting us at least 24 hours before the scheduled start time — for a timely cancellation you may request either a full refund of the appointment fee or one rescheduling.

If cancellation is requested less than 24 hours before the scheduled start, we may treat the reserved practitioner time as committed and decline a cash refund to the extent permitted by law, though we may at our discretion offer a one-time rescheduling credit in genuine exceptional circumstances. A no-show, or substantial lateness that prevents the booked service from being reasonably delivered within the reserved slot, is ordinarily non-refundable.

If we cancel an appointment or cannot provide the booked practitioner/service, you will be offered a reasonable alternative or rescheduled slot, or a full refund for the unprovided service. Once a session has been substantially delivered, fees are not refundable merely because you disagree with an interpretation or did not experience a desired subjective outcome — a complaint about non-delivery, material deficiency or misdescription will still be assessed on its facts.`,
  },
  {
    title: '7. Courses, Workshops and Events',
    content: `Unless a specific course/event page states a longer cancellation period, written cancellation received at least 48 hours before the scheduled start is eligible for a full refund or, at your choice where available, transfer to a future batch/event. A cancellation within 48 hours of the start may be ineligible for a cash refund because the seat, facilitator and materials have been committed — where feasible we may offer a future-batch credit instead.

After a live course/workshop has begun, or after substantial digital course access has been provided, there is no general change-of-mind refund for the portion already supplied. If we cancel a paid course, workshop or event and do not provide a reasonably equivalent accepted alternative, the amount attributable to the unprovided offering will be refunded.`,
  },
  {
    title: '8. Digital Products and Recorded Content',
    content: `Digital products may include e-books, recordings, guided practices, reports, downloadable resources or access-controlled content. Because digital content can be copied or consumed immediately, a voluntary change-of-mind refund is generally unavailable once download/access has been substantially enabled or the content materially consumed. If digital content cannot be accessed because of a fault attributable to us, is materially corrupted, or materially differs from what was purchased, contact us and we will reasonably attempt restoration, replacement, extension, resupply or refund.`,
  },
  {
    title: '9. Exchanges',
    content: `An exchange is subject to eligibility and stock availability. If the requested replacement is unavailable, we may offer a refund, store credit (only with your agreement), or an alternative item. For a voluntary exchange, any price difference and applicable return/re-shipping cost will be communicated before the exchange is completed; for an accepted defect or wrong-item claim, you will not be charged the cost of correcting our error.`,
  },
  {
    title: '10. How to Request a Return, Cancellation or Refund',
    content: `Email info@thecosmicconnect.com or contact +91 95994 74758 with your name, order/booking number, the item or service concerned, the reason for the request and reasonable supporting evidence. Do not send a physical return without instructions — where a return is approved, we will provide the return address or collection method.`,
  },
  {
    title: '11. Inspection and Refund Processing',
    content: `Returned goods may be inspected for identity, completeness and condition; inspection does not permit us to reject a valid statutory claim merely because packaging was opened to discover a defect. Once a refund is approved, we aim to initiate it within 7–10 business days to the original payment method — banks, card networks, UPI providers and payment gateways may take additional time to reflect the credit after we initiate it. Cash refunds, store credit or bank transfer will not be substituted for the original method without your agreement.`,
  },
  {
    title: '12. Undeliverable, Refused or Incorrect-Address Orders',
    content: `If a parcel is returned because you provided an incorrect/incomplete address, repeatedly failed delivery, or refused an otherwise conforming order without an applicable legal reason, re-shipping may require payment of the actual additional logistics cost. Any deduction from a voluntary refund is limited to reasonable non-recoverable logistics cost where legally permitted and is not treated as a penalty.`,
  },
  {
    title: '13. Grievances and Escalation',
    content: `Grievance Officer: Puneet Mehta. Email: info@thecosmicconnect.com. Phone/WhatsApp: +91 95994 74758. Postal / consumer-contact address: KG1/298, KG1 Road, near Coffeegram, Vikaspuri, New Delhi – 110018, India.

We aim to acknowledge a consumer complaint within 48 hours and redress it within one month, in line with the Consumer Protection (E-Commerce) Rules, 2020. This internal mechanism does not prevent you from using the National Consumer Helpline, a competent Consumer Commission or another statutory remedy.`,
  },
  {
    title: '14. Policy Updates and Interpretation',
    content: `We may update this policy for changes in law, products, modalities, payment systems or operations. A later policy will not retrospectively remove a mandatory right attached to an earlier transaction. If a specific product, booking, course or event term conflicts with this policy, the more specific term governs that subject only to the extent it is lawful — mandatory consumer law prevails over any inconsistent contractual wording.`,
  },
]

export default function ShippingReturnsPage() {
  return (
    <Layout
      title="Shipping, Returns &amp; Refunds | The Cosmic Connect"
      description="Shipping & Delivery Policy and Return, Exchange, Cancellation & Refund Policy for The Cosmic Connect — delivery timelines, return conditions, session cancellation rules and refund processing."
      canonical="/shipping-returns"
    >
      <section className="pt-36 pb-16 px-4 bg-cosmic-gradient">
        <div className="container-cosmic max-w-3xl">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3 text-3xl md:text-4xl">
            Shipping, Returns &amp; <span className="text-gradient-gold">Refunds</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/50 italic">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="font-cormorant text-cosmic-cream/70 text-lg leading-relaxed mt-6">
            This page combines our Shipping &amp; Delivery Policy and our Return, Exchange,
            Cancellation &amp; Refund Policy — covering physical products, one-to-one sessions,
            courses, workshops and digital content.
          </p>
        </div>
      </section>

      {/* Quick reference */}
      <section className="py-10 px-4 bg-cosmic-section border-b border-cosmic-gold/10">
        <div className="container-cosmic max-w-3xl">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🚚', label: 'Free Shipping', value: 'Standard domestic orders' },
              { icon: '📦', label: 'Delivery Estimate', value: '2–7 business days (domestic)' },
              { icon: '↩️', label: 'Goodwill Returns', value: '30 days of delivery' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="cosmic-card p-5 text-center">
                <span className="text-3xl block mb-2">{icon}</span>
                <p className="font-cinzel text-cosmic-gold text-xs font-semibold tracking-widest uppercase mb-1">{label}</p>
                <p className="font-cormorant text-cosmic-cream/60 italic">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Part A — Shipping */}
      <section className="py-16 px-4 bg-cosmic-gradient">
        <div className="container-cosmic max-w-3xl">
          <p className="ornament text-xs tracking-[0.4em] mb-3">✦ ✦ ✦</p>
          <h2 className="font-cinzel text-cosmic-cream text-2xl font-bold mb-2">
            Part A — Shipping &amp; <span className="text-gradient-gold">Delivery Policy</span>
          </h2>
          <p className="font-cormorant text-cosmic-cream/50 italic mb-10">
            Applies to physical products purchased directly from Cosmic Connect India LLP, trading as
            The Cosmic Connect. Read together with Part B below and our Terms &amp; Conditions.
          </p>
          <div className="space-y-10">
            {shippingSections.map((sec) => (
              <div key={sec.title}>
                <h3 className="font-cinzel text-cosmic-cream text-lg font-bold mb-3">
                  {sec.title}
                </h3>
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
        </div>
      </section>

      {/* Part B — Return, Exchange, Cancellation & Refund */}
      <section className="py-16 px-4 bg-cosmic-section">
        <div className="container-cosmic max-w-3xl">
          <p className="ornament text-xs tracking-[0.4em] mb-3">✦ ✦ ✦</p>
          <h2 className="font-cinzel text-cosmic-cream text-2xl font-bold mb-2">
            Part B — Return, Exchange, Cancellation &amp; <span className="text-gradient-gold">Refund Policy</span>
          </h2>
          <p className="font-cormorant text-cosmic-cream/50 italic mb-10">
            Applies to eligible products, one-to-one sessions, courses, workshops, events and digital
            content purchased directly from us. Purchases made through a third-party marketplace may
            also be subject to that platform's own process.
          </p>
          <div className="space-y-10">
            {returnSections.map((sec) => (
              <div key={sec.title}>
                <h3 className="font-cinzel text-cosmic-cream text-lg font-bold mb-3">
                  {sec.title}
                </h3>
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
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-cosmic-gradient text-center">
        <div className="container-cosmic max-w-xl">
          <p className="font-cormorant text-cosmic-cream/60 italic text-lg mb-4">
            Need help with an order or booking? We're here.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/contact" className="btn-primary inline-flex justify-center">
              Contact Us
            </Link>
            <a href="https://wa.me/919599474758" target="_blank" rel="noopener noreferrer"
              className="btn-outline inline-flex justify-center">
              WhatsApp Us
            </a>
          </div>
        </div>
      </section>
    </Layout>
  )
}
