import Link from "next/link";
import { ArrowLeft, Shield } from "lucide-react";

export const metadata = {
  title: "Privacy Policy | The Lakes Guide",
  description: "Privacy Policy for TheLakesGuide.co.uk. How we collect, use and protect your personal data in accordance with UK GDPR.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#EAEDE8]">
      {/* Header */}
      <section className="bg-[#1B2E4B]">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#C4782A] to-transparent" />
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to guide
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <Shield className="w-8 h-8 text-[#C4782A]" />
            <p className="text-[#C4782A] text-xs font-bold uppercase tracking-widest">Legal</p>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Privacy Policy</h1>
          <p className="text-white/50 text-sm">Last updated: 18 February 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 space-y-10">

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">1. Who we are</h2>
            <p className="text-gray-600 leading-relaxed mb-3">
              TheLakesGuide.co.uk is operated by <strong>Churchtown Media</strong>, a digital media company based in the UK.
            </p>
            <p className="text-gray-600 leading-relaxed mb-3">
              We are committed to protecting your personal data in accordance with the <strong>UK General Data Protection Regulation (UK GDPR)</strong> and the Data Protection Act 2018.
            </p>
            <p className="text-gray-600 leading-relaxed">
              <strong>Contact:</strong>{" "}
              <a href="mailto:hello@churchtownmedia.co.uk" className="text-[#C4782A] hover:underline">
                hello@churchtownmedia.co.uk
              </a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">2. What data we collect</h2>
            <div className="space-y-4">
              {[
                {
                  title: "Contact forms",
                  desc: "Your name, email address, and message contents when you use our contact or business enquiry forms.",
                },
                {
                  title: "Business listing submissions",
                  desc: "Business name, address, phone number, website URL, and description when you claim or submit a listing.",
                },
                {
                  title: "Billing information",
                  desc: "Handled entirely by Stripe, our payment processor. We do not store or have access to card details.",
                },
                {
                  title: "Usage data",
                  desc: "Privacy-friendly, cookieless page view analytics via Plausible. No personal data or IP addresses are collected or stored.",
                },
                {
                  title: "Cookies",
                  desc: "See section 6 below for full cookie details.",
                },
              ].map(({ title, desc }) => (
                <div key={title} className="flex gap-4">
                  <div className="w-2 h-2 rounded-full bg-[#C4782A] mt-2 flex-none" />
                  <div>
                    <p className="font-semibold text-[#1B2E4B] text-sm">{title}</p>
                    <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">3. Why we collect it (legal basis)</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#EAEDE8]">
                    <th className="text-left p-3 font-semibold text-[#1B2E4B] border border-gray-100">Purpose</th>
                    <th className="text-left p-3 font-semibold text-[#1B2E4B] border border-gray-100">Legal basis</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Contact enquiries", "Legitimate interest and your consent"],
                    ["Business listings", "Performance of a contract (your listing agreement)"],
                    ["Payment processing", "Performance of a contract"],
                    ["Analytics", "Legitimate interest in understanding site usage"],
                  ].map(([purpose, basis]) => (
                    <tr key={purpose}>
                      <td className="p-3 border border-gray-100 text-gray-700">{purpose}</td>
                      <td className="p-3 border border-gray-100 text-gray-500">{basis}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">4. How long we keep it</h2>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li className="flex gap-3"><span className="text-[#C4782A]">→</span> Contact form submissions: <strong>12 months</strong></li>
              <li className="flex gap-3"><span className="text-[#C4782A]">→</span> Business listing data: <strong>for the duration of your listing plus 6 months</strong></li>
              <li className="flex gap-3"><span className="text-[#C4782A]">→</span> Analytics data: <strong>aggregated, no personal data retained</strong> (Plausible Analytics)</li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">5. Third parties we share data with</h2>
            <div className="space-y-3">
              {[
                { name: "Plausible (Analytics)", detail: "Privacy-friendly, cookieless analytics. All data is aggregated and processed in the EU. No personal data is collected." },
                { name: "Stripe", detail: "Payment processing for paid business listings. Subject to Stripe's own privacy policy." },
                { name: "Vercel", detail: "Website hosting infrastructure. Data is processed in UK/EU-region data centres where possible." },
              ].map(({ name, detail }) => (
                <div key={name} className="bg-[#EAEDE8] rounded-xl p-4">
                  <p className="font-semibold text-[#1B2E4B] text-sm mb-1">{name}</p>
                  <p className="text-gray-500 text-sm">{detail}</p>
                </div>
              ))}
            </div>
            <p className="text-gray-500 text-sm mt-4 font-medium">We do not sell your personal data to any third party.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">6. Cookies</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#EAEDE8]">
                    <th className="text-left p-3 font-semibold text-[#1B2E4B] border border-gray-100">Type</th>
                    <th className="text-left p-3 font-semibold text-[#1B2E4B] border border-gray-100">Purpose</th>
                    <th className="text-left p-3 font-semibold text-[#1B2E4B] border border-gray-100">Required?</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Essential", "Site functionality (session, security)", "Yes"],
                    ["Analytics (Plausible)", "Understanding how visitors use the site", "No — cookieless, no consent needed"],
                  ].map(([type, purpose, required]) => (
                    <tr key={type}>
                      <td className="p-3 border border-gray-100 text-gray-700 font-medium">{type}</td>
                      <td className="p-3 border border-gray-100 text-gray-500">{purpose}</td>
                      <td className="p-3 border border-gray-100 text-gray-500">{required}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-sm mt-3">No advertising or cross-site tracking cookies are used.</p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">7. Your rights</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              Under UK GDPR you have the right to:
            </p>
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                "Access your personal data",
                "Correct inaccurate data",
                "Request deletion of your data",
                "Object to or restrict processing",
                "Data portability",
                "Withdraw consent at any time",
              ].map((right) => (
                <div key={right} className="flex items-center gap-2 text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#C4782A] flex-none" />
                  {right}
                </div>
              ))}
            </div>
            <p className="text-gray-600 text-sm mt-4">
              To exercise any of these rights, email{" "}
              <a href="mailto:hello@churchtownmedia.co.uk" className="text-[#C4782A] hover:underline">
                hello@churchtownmedia.co.uk
              </a>. You may also lodge a complaint with the{" "}
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-[#C4782A] hover:underline">
                Information Commissioner&apos;s Office (ICO)
              </a>.
            </p>
          </section>

          <section id="cookies">
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">8. Cookies</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">
              We use cookies and similar tracking technologies to operate the site and support affiliate revenue when you click through to partner booking sites. Plausible Analytics is cookieless by design and does not require consent.
            </p>
            <div className="overflow-x-auto rounded-xl border border-gray-100">
              <table className="w-full text-sm">
                <thead className="bg-[#EAEDE8]">
                  <tr>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#1B2E4B] uppercase tracking-wider">Category</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#1B2E4B] uppercase tracking-wider">Purpose</th>
                    <th className="text-left px-4 py-3 text-xs font-semibold text-[#1B2E4B] uppercase tracking-wider">Consent required</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[
                    ["Necessary", "Session management and security.", "No — always active"],
                    ["Analytics", "Plausible Analytics — aggregated page views, traffic sources, device types. Privacy-friendly and cookieless.", "No — does not require consent"],
                    ["Marketing / Affiliate", "Booking.com and other affiliate partner tracking cookies. Set when you click through to a partner booking site.", "Yes — optional"],
                  ].map(([cat, purpose, req]) => (
                    <tr key={cat}>
                      <td className="px-4 py-3 font-semibold text-[#1B2E4B] align-top whitespace-nowrap">{cat}</td>
                      <td className="px-4 py-3 text-gray-600 align-top">{purpose}</td>
                      <td className={`px-4 py-3 align-top whitespace-nowrap font-medium ${req.startsWith("No") ? "text-[#C4782A]" : "text-gray-500"}`}>{req}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-gray-500 text-xs mt-3">
              Affiliate cookies are set by partner sites (e.g. Booking.com) when you click through from our links. You can control cookies via your browser settings.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">9. Changes to this policy</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may update this policy from time to time. When we do, we will update the &ldquo;last updated&rdquo; date at the top of this page. Continued use of the site constitutes acceptance of the updated policy.
            </p>
          </section>

        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          Questions?{" "}
          <Link href="/contact" className="text-[#C4782A] hover:underline">Contact us</Link>
          {" "}·{" "}
          <Link href="/terms" className="text-[#C4782A] hover:underline">Terms & Conditions</Link>
        </div>
      </div>
    </div>
  );
}
