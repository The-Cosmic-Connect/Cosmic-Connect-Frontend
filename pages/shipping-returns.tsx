import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const LAST_UPDATED = 'March 2025'

const sections = [
  {
    title: 'Shipping — India',
    content: `We ship all crystal and gemstone products across India via reputable courier partners including Delhivery, Blue Dart, and India Post Registered Post.

Standard shipping: 5–7 business days — ₹99 for orders under ₹1,999.
Free shipping on all orders of ₹1,999 and above.
Express shipping (2–3 business days): ₹199 — available at checkout for select pin codes.

All orders are carefully packed with protective materials to prevent breakage during transit. Each package includes a quality check slip signed by our team.`,
  },
  {
    title: 'Shipping — International',
    content: `We ship internationally to most countries. International shipping costs are calculated at checkout based on your location and the weight of your order.

Estimated international delivery times: 10–21 business days depending on destination country and customs processing.

International customers are responsible for any customs duties, import taxes, or local fees charged upon delivery. These charges are not included in the product price or shipping fee and are outside our control.

We declare the accurate value of all shipments on customs forms. We are unable to mark packages as "gifts" or undervalue them.`,
  },
  {
    title: 'Order Processing',
    content: `Orders are processed within 1–2 business days of payment confirmation (Monday to Saturday, excluding public holidays).

During peak periods such as festival seasons, processing may take up to 3 business days.

Once your order is dispatched, you will receive a confirmation email with your tracking number and courier details.`,
  },
  {
    title: 'Tracking Your Order',
    content: `A tracking number is emailed to you within 24 hours of dispatch. You can track your shipment directly on the courier partner's website using this number.

If your tracking information has not updated for more than 5 business days, please contact us and we will investigate with the courier.`,
  },
  {
    title: 'Returns — Physical Products',
    content: `We accept returns on physical products within 7 days of delivery, provided the item is:

- Unused and in its original condition
- In its original packaging with all accessories included
- Accompanied by the original invoice

To initiate a return, please email us at hello@thecosmicconnect.com with your order number and reason for return. We will provide return shipping instructions within 24 hours.

Return shipping costs are borne by the customer unless the return is due to our error (wrong item sent, item damaged in transit).`,
  },
  {
    title: 'Non-Returnable Items',
    content: `The following items cannot be returned or exchanged:

Energised or personalised items (including Reiki-energised products ordered with personalisation).

Items damaged through customer misuse, dropping, or exposure to water beyond normal use.

Clearance or sale items marked as final sale.

Digital products and downloadable content.`,
  },
  {
    title: 'Damaged or Incorrect Items',
    content: `If you receive a damaged or incorrect item, please contact us within 48 hours of delivery at hello@thecosmicconnect.com with:

Your order number, a photograph of the damaged or incorrect item, and a photograph of the packaging.

We will arrange a replacement or full refund at no additional cost to you. We may request the damaged item to be returned at our expense.`,
  },
  {
    title: 'Refunds',
    content: `Once a return is received and inspected (typically within 3–5 business days), we will process your refund to the original payment method.

Refund processing time: 5–7 business days for credit/debit cards, 3–5 business days for UPI and net banking.

Original shipping charges are non-refundable unless the return is due to our error.`,
  },
  {
    title: 'Cancellations',
    content: `Orders may be cancelled within 12 hours of placement at no charge by contacting us via WhatsApp or email.

After 12 hours, if the order has already been dispatched, you will need to follow the return process once you receive the item.

For digital products and course enrollments, please refer to our Terms of Use for our course cancellation policy.`,
  },
  {
    title: 'Session Bookings',
    content: `Session bookings are not subject to this Shipping and Returns Policy. For session cancellation and rescheduling, please refer to our Terms of Use.

Sessions must be rescheduled with a minimum of 24 hours notice. Late cancellations are subject to a 50% cancellation fee.`,
  },
  {
    title: 'Contact Us',
    content: `For any shipping or returns enquiries, please contact us:

Email: hello@thecosmicconnect.com
WhatsApp: +91 95994 74758
Hours: Monday–Saturday, 10 AM – 7 PM IST

We aim to respond to all enquiries within 24 hours.`,
  },
]

export default function ShippingReturnsPage() {
  return (
    <Layout
      title="Shipping & Returns | The Cosmic Connect"
      description="Shipping and returns policy for The Cosmic Connect shop — delivery timelines, return conditions, refund process, and international shipping information."
      canonical="/shipping-returns"
    >
      <section className="pt-36 pb-16 px-4 bg-cosmic-gradient">
        <div className="container-cosmic max-w-3xl">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3 text-3xl md:text-4xl">
            Shipping & <span className="text-gradient-gold">Returns</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/50 italic">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="font-cormorant text-cosmic-cream/70 text-lg leading-relaxed mt-6">
            We take great care in packing and dispatching every order. Below you will find
            complete information on delivery timelines, our return conditions, and how to
            reach us if anything needs attention.
          </p>
        </div>
      </section>

      {/* Quick reference table */}
      <section className="py-10 px-4 bg-cosmic-section border-b border-cosmic-gold/10">
        <div className="container-cosmic max-w-3xl">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🚚', label: 'Free Shipping', value: 'India orders ₹1,999+' },
              { icon: '📦', label: 'Processing',   value: '1–2 business days' },
              { icon: '↩️', label: 'Returns',      value: '7 days of delivery' },
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

      <section className="py-16 px-4 bg-cosmic-gradient">
        <div className="container-cosmic max-w-3xl space-y-10">
          {sections.map((sec, i) => (
            <div key={sec.title}>
              <h2 className="font-cinzel text-cosmic-cream text-lg font-bold mb-3 flex items-center gap-3">
                <span className="font-cinzel text-cosmic-gold/40 text-sm">{String(i + 1).padStart(2, '0')}</span>
                {sec.title}
              </h2>
              <div className="border-l-2 border-cosmic-gold/15 pl-5">
                {sec.content.split('\n\n').map((para, j) => (
                  <p key={j} className="font-cormorant text-cosmic-cream/65 text-base leading-relaxed mb-3 last:mb-0 whitespace-pre-line">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 px-4 bg-cosmic-section text-center">
        <div className="container-cosmic max-w-xl">
          <p className="font-cormorant text-cosmic-cream/60 italic text-lg mb-4">
            Need help with an order? We're here.
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
