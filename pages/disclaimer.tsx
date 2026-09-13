import Layout from '@/components/layout/Layout'
import Link from 'next/link'

const LAST_UPDATED = 'August 2026'

const sections = [
  {
    title: 'General Nature of Our Offerings',
    content: `The Cosmic Connect offers spiritual guidance, belief-based practices, complementary wellness experiences, educational programs and spiritual/decorative products. Terms such as "healing", "therapy", "scan", "cleansing", "balancing", "blockage", "energy", "frequency", "vibration", "activation", "negation" or similar expressions may be used as names or descriptions within spiritual and complementary traditions. Unless we expressly state otherwise with appropriate evidence and legal basis, these terms are not medical diagnoses, scientific measurements or guarantees of therapeutic efficacy.

Individual experiences vary. We do not guarantee that a reading will predict a fixed future, that a session will create a specific energetic or emotional response, that a product will change health or life circumstances, or that any course will produce a particular career, income or client outcome.`,
  },
  {
    title: 'No Substitute for Professional Care or Advice',
    content: `Nothing on our website or in a spiritual/complementary session is a substitute for diagnosis, treatment or advice from a qualified medical, psychiatric, psychological, legal, financial, investment, tax, veterinary or other licensed professional.

Do not stop medication, delay medical/mental-health/veterinary treatment, ignore legal deadlines, make investment decisions or take another high-stakes action solely because of a reading, energy session, crystal recommendation or spiritual interpretation.

We do not provide emergency or crisis services. If there is an immediate threat to life, safety, health, self-harm risk, violence, abuse, poisoning, serious animal illness or another emergency, contact the appropriate emergency service or qualified professional without delay.`,
  },
  {
    title: 'Tarot, Psychic, Intuitive, Oracle, Akashic and Mokshapat Readings',
    content: `Tarot, psychic/intuitive, oracle, Akashic Records, Mokshapat, astrology-linked guidance, pendulum dowsing and similar practices are interpretive and/or belief-based. They are intended to support reflection and perspective rather than establish objective facts or inevitable future events.

A reading does not guarantee reconciliation, marriage, pregnancy, employment, promotion, exam success, litigation success, financial gain, recovery of money, business success, removal of a supernatural influence or any other specific outcome or timeline.

Statements about another person's thoughts, intentions, fidelity, health, conduct or future should be treated as interpretive spiritual guidance, not verified evidence. Decisions involving safety, crime, legal rights, medical care or substantial money should be based on appropriate factual and professional sources.`,
  },
  {
    title: 'Reiki, Energy Work, Chakra Practices and Distance/Photo-Based Sessions',
    content: `Reiki, crystal Reiki, chakra-oriented practices, psychic/energy sessions, aura-oriented work and distance/photo-based energy sessions are offered as complementary spiritual-wellness practices. They are not intended to diagnose, treat, cure or prevent disease or mental-health conditions.

You may experience relaxation, warmth, tingling, emotion, imagery, no noticeable sensation or another subjective response. No particular sensation is promised and absence of a sensation does not prove that a medical or psychological condition exists or does not exist.

"Distance" or photograph-based work should not be understood as scientifically proven remote diagnosis or treatment. A photograph or intuitive impression does not replace clinical examination, laboratory testing, professional assessment or factual investigation.`,
  },
  {
    title: 'Sound Healing, Singing Bowls, Gong, Tuning Forks, Naad Yoga, Voice and Mantra',
    content: `Sound and vibrational sessions may use singing bowls, gongs, tuning forks, voice, mantra, music, silence, vibration or other sensory elements for relaxation, meditation and complementary wellbeing.

Strong sound, vibration, prolonged sitting/lying, breath practices, darkness, incense/fragrance or other session elements may not suit every participant. If you have a health condition, sensory sensitivity, implanted device, pregnancy, recent procedure or other circumstance that could reasonably be affected by the planned session, obtain advice from an appropriately qualified healthcare professional where needed and inform the facilitator of relevant participation needs.

You may move farther from an instrument, lower exposure, decline an exercise or stop the session if you experience pain, dizziness, distress or other significant discomfort. We do not promise a medical effect from any frequency or instrument.`,
  },
  {
    title: 'Meditation, Visualisation, Breath, Mantra, Mudra and Mindfulness Practices',
    content: `Meditation, visualisation, mantra, mudra, breath awareness and mindfulness-oriented practices are offered for reflection, relaxation, attention training or spiritual exploration. They are not psychiatric or psychological treatment unless delivered separately by an appropriately licensed professional acting within that professional scope.

If a practice causes significant distress, dizziness, pain, panic, dissociation or another concerning reaction, stop the exercise and seek appropriate professional support if needed. Participants should not force breath holds, postures or sensory practices beyond their comfort or medical limitations.`,
  },
  {
    title: 'Past-Life Regression, Ancestral, Karmic and Bloodline-Oriented Work',
    content: `Past-life regression, past-life-oriented healing, ancestral work, karmic exploration and bloodline/lineage practices are experiential and spiritual modalities. Images, sensations, narratives or "memories" arising in a session may be symbolic, imaginative, autobiographical, suggestive or otherwise subjective. We do not represent that they are historically factual, scientifically verified or proof of a previous life or ancestral event.

These practices can bring up strong emotions or personal associations. They are not psychotherapy and should not be used to recover or establish factual allegations about abuse, crime, paternity, identity or another serious historical matter without appropriate independent evidence and professional support.`,
  },
  {
    title: 'Evil Eye, Nazar, Black Magic, Negative-Energy Scanning and Cleansing',
    content: `Services described using terms such as evil eye, nazar, black magic, negative energy, spiritual attack, scanning, cleansing, protection or negation are offered within spiritual/cultural belief systems. We do not represent that a supernatural cause has been objectively proven merely because a practitioner or tool gives an impression during a session.

We will not knowingly use a frightening spiritual interpretation to pressure a person into repeated paid remedies, urgent purchases or abandonment of medical, psychological, legal, financial, police or other appropriate professional assistance.

If you are experiencing threats, stalking, violence, fraud, unexplained physical symptoms, severe mental distress or another real-world safety issue, obtain appropriate factual and professional help rather than relying only on a spiritual explanation.`,
  },
  {
    title: 'Crystal Therapy, Gemstones, Crystal Grids and Pendulum Work',
    content: `Crystal therapy, gemstone guidance, crystal grids and pendulum practices are spiritual/complementary methods. Traditional associations between stones and intentions such as calm, protection, prosperity, love, confidence or clarity are not guarantees of medical, psychological, financial or relationship outcomes.

A gemstone recommendation is not medical advice and does not guarantee astrological, financial or life results. Use your own judgment and seek qualified advice for health, investments, legal matters or other high-stakes decisions.`,
  },
  {
    title: 'Pet / Animal Energy Sessions',
    content: `Reiki, energy or complementary spiritual sessions for animals are not veterinary diagnosis or treatment. We do not diagnose disease, injury, poisoning, pain or behavioural disorders through energy work.

If an animal is ill, injured, in pain, not eating/drinking, having difficulty breathing, showing neurological symptoms, has ingested a toxic substance or otherwise needs urgent care, contact a qualified veterinarian promptly. Do not delay or stop veterinary treatment because of our service.`,
  },
  {
    title: 'Crystals, Gemstones, Jewellery and Spiritual Products',
    content: `Crystals, gemstones, bracelets, jewellery, orgone items, grids, spheres, towers, pyramids, wands, pendulums, idols, Feng Shui/evil-eye products, incense/cleansing tools, meditation items and related merchandise are sold for personal, decorative, spiritual or complementary wellness use unless a listing expressly states another lawful purpose.

Spiritual associations or traditional uses are not medical claims. Products are not intended to diagnose, treat, cure or prevent disease and should not replace medical or mental-health care.

Natural stones and handcrafted products can vary in colour, inclusions, veins, transparency, texture, polish, shape, weight and dimensions. Product listings should disclose material characteristics and approximate measurements honestly. A representative photograph may not capture every natural variation.

Words such as "cleansed", "charged", "energized" or "Reiki energized" describe a spiritual/ritual process carried out by or for us; they are not laboratory certifications, scientific measurements or guarantees of outcome.

Descriptions such as AA/AAA or similar grades may be trade/seller grading rather than a universal gemological standard unless a recognized methodology or laboratory standard is expressly identified. "Natural", "genuine", "authentic", "handcrafted" or "ethically sourced" should be understood only to the extent specifically represented and supportable for the product concerned.`,
  },
  {
    title: 'Product and Physical Safety',
    content: `Small stones, beads, jewellery parts, incense and similar products may present choking, ingestion, smoke, allergy, breakage, sharp-edge or other physical risks if misused. Keep products away from children and animals where appropriate and follow any product-specific care/warning instructions.

Do not ingest crystals, crystal-infused water, oils, powders, incense, ash or other non-food/non-drug products unless the specific product is lawfully manufactured and expressly labelled for that purpose. Some minerals may be unsafe in water or for skin contact; decorative/spiritual use does not imply ingestion safety.`,
  },
  {
    title: 'Courses, Workshops, Practitioner Training and Certificates',
    content: `Our Reiki, Tarot, psychic/intuitive, crystal therapy, pendulum, meditation, spiritual-awareness and other courses are educational/spiritual programs. A certificate issued by us confirms the course status described on that certificate; it does not by itself create a government licence, medical/mental-health qualification, legal authorization, guaranteed employment, income or professional recognition by an external body.

Learners are responsible for practising within the law, their actual competence and ethical scope. Completing a course does not authorize a person to diagnose or treat disease, provide psychotherapy, prescribe medicine, give regulated financial/legal advice or perform another licensed activity unless the learner independently holds the required professional qualification and authority.`,
  },
  {
    title: 'Testimonials, Reviews and Case Examples',
    content: `Testimonials and reviews describe individual experiences. They are not a promise that another person will obtain the same result. We do not intend to edit a testimonial to make the result stronger than what the customer actually said.

Identifiable client stories, images or sensitive circumstances should be published only with appropriate permission. Anonymised or composite educational examples should be labelled accurately where their nature matters.`,
  },
  {
    title: 'Website, Blog, Social-Media and Educational Content',
    content: `Articles, reels, videos, posts, comments, downloadable guides and other free/public content are general educational or spiritual material. They do not create a practitioner-client relationship and are not individualized professional advice merely because a viewer finds the content personally relevant.

References to research, science, history, scripture, tradition, credentials, awards or external recognition should be understood according to the specific evidence and context provided, not as a broader claim than that evidence supports.`,
  },
  {
    title: 'Illustrative and AI-Assisted Media',
    content: `We may use edited, illustrative, stock, computer-generated or AI-assisted media in educational or marketing content. Such media should not be used to misrepresent the actual product variant, material, quantity, size, practitioner credential or service deliverable. For a purchase, the confirmed product description, variant and legally required disclosures control.`,
  },
  {
    title: 'Personal Responsibility and Informed Participation',
    content: `Participate voluntarily, ask questions and use your own judgment. You may decline an exercise or stop a session. Inform the practitioner/facilitator of relevant accessibility or participation needs that you reasonably know could affect safe participation.

You remain responsible for independent decisions concerning healthcare, medication, relationships, employment, litigation, investments, money, travel, pregnancy, personal safety and other significant matters. Seek qualified advice where the consequences are material.`,
  },
  {
    title: 'Minors',
    content: `Certain readings or services may be limited to persons aged 18 or above. Where a permitted service/course is offered to a minor, a parent/legal guardian must make or authorize the booking and should supervise participation as appropriate. Age restrictions shown on a specific offering prevail.`,
  },
  {
    title: 'Liability and Consumer-Rights Saving Clause',
    content: `To the extent permitted by law, we do not accept liability for losses caused solely by a customer's independent decision to rely on non-guaranteed spiritual guidance as if it were medical, legal, financial, veterinary or other professional advice.

This Disclaimer does not exclude liability or consumer remedies that cannot lawfully be excluded, including rights relating to fraud, fraudulent misrepresentation, wilful misconduct, defective goods, deficient services or other mandatory protections. A blanket "at your own risk" statement is not intended to override applicable law.`,
  },
  {
    title: 'Contact and Questions',
    content: `If you are unsure whether a modality is appropriate for you, contact us before booking so the nature of the service can be explained. This does not replace advice from a qualified healthcare or other professional where such advice is appropriate.

Email: info@thecosmicconnect.com
Phone/WhatsApp: +91 95994 74758
Consumer-contact address: KG1/298, KG1 Road, near Coffeegram, Vikaspuri, New Delhi – 110018, India.`,
  },
  {
    title: 'Updates',
    content: `We may revise this Disclaimer as services, products, evidence, laws or safety practices change. The version displayed on the website with the latest update date will apply prospectively, subject to mandatory law and any specific informed-consent document for a particular session.`,
  },
]

export default function DisclaimerPage() {
  return (
    <Layout
      title="Disclaimer | The Cosmic Connect"
      description="General disclaimer and informed-use notice for The Cosmic Connect's spiritual guidance, complementary wellness services, courses and products."
      canonical="/disclaimer"
    >
      <section className="pt-36 pb-16 px-4 bg-cosmic-gradient">
        <div className="container-cosmic max-w-3xl">
          <p className="ornament text-xs tracking-[0.5em] mb-4">✦ ✦ ✦</p>
          <h1 className="font-cinzel font-bold text-cosmic-cream mb-3 text-3xl md:text-4xl">
            General <span className="text-gradient-gold">Disclaimer</span>
          </h1>
          <div className="gold-divider mb-4" />
          <p className="font-cormorant text-cosmic-cream/50 italic">
            Last updated: {LAST_UPDATED}
          </p>
          <p className="font-cormorant text-cosmic-cream/70 text-lg leading-relaxed mt-6">
            This Disclaimer applies to the website, content, products, readings, services,
            courses, workshops and events offered by Cosmic Connect India LLP, trading as
            The Cosmic Connect ("TCC", "we", "us" or "our"). It should be read together with
            our{' '}
            <Link href="/terms-of-use" className="text-cosmic-gold hover:underline">
              Terms &amp; Conditions
            </Link>
            ,{' '}
            <Link href="/privacy-policy" className="text-cosmic-gold hover:underline">
              Privacy Policy
            </Link>{' '}
            and{' '}
            <Link href="/shipping-returns" className="text-cosmic-gold hover:underline">
              Shipping &amp; Returns Policy
            </Link>
            , and any specific informed-participation notice provided for a particular
            modality.
          </p>
        </div>
      </section>

      {/* Quick reference */}
      <section className="py-10 px-4 bg-cosmic-section border-b border-cosmic-gold/10">
        <div className="container-cosmic max-w-3xl">
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🔮', label: 'Spiritual, Not Medical', value: 'Not diagnosis or treatment' },
              { icon: '🚫', label: 'No Guaranteed Outcome', value: 'Results are individual' },
              { icon: '🆘', label: 'Emergencies', value: 'Contact a licensed professional' },
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
            Unsure if a session is right for you? Ask us first.
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
