import Link from "next/link";
import { ArrowLeft, FileText } from "lucide-react";

export const metadata = {
  title: "Terms & Conditions | The Lakes Guide",
  description: "Terms and Conditions for use of TheLakesGuide.co.uk, including business listing terms and subscription conditions.",
  alternates: { canonical: "https://www.thelakesguide.co.uk/terms" },
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      {/* Header */}
      <section className="bg-[#1B2E4B]">
        <div className="h-1 bg-gradient-to-r from-transparent via-[#C9A84C] to-transparent" />
        <div className="container mx-auto px-4 py-14 max-w-3xl">
          <Link href="/" className="inline-flex items-center gap-1.5 text-white/60 hover:text-white text-sm mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Back to guide
          </Link>
          <div className="flex items-center gap-3 mb-4">
            <FileText className="w-8 h-8 text-[#C9A84C]" />
            <p className="text-[#C9A84C] text-xs font-bold uppercase tracking-widest">Legal</p>
          </div>
          <h1 className="font-display text-4xl font-bold text-white mb-2">Terms &amp; Conditions</h1>
          <p className="text-white/50 text-sm">Last updated: 18 February 2026</p>
        </div>
      </section>

      {/* Content */}
      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <div className="bg-white rounded-2xl border border-gray-100 p-8 md:p-10 space-y-10">

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">1. Acceptance of terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              By accessing or using SouthportGuide.co.uk (the &ldquo;Site&rdquo;), you agree to be bound by these Terms &amp; Conditions. If you do not agree, please do not use the Site. If you are using the Site on behalf of a business, you confirm that you have authority to bind that business to these terms.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">2. About the Site</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              TheLakesGuide.co.uk is a visitor guide and local business directory for the Lake District, operated by <strong>Churchtown Media</strong>. The Site provides information about local businesses, events, and attractions for the benefit of visitors and residents.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Contact: <a href="mailto:hello@churchtownmedia.co.uk" className="text-[#C9A84C] hover:underline">hello@churchtownmedia.co.uk</a>
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">3. Use of the Site</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-4">You agree not to:</p>
            <ul className="space-y-2">
              {[
                "Scrape, crawl, or systematically extract data from the Site without our written permission",
                "Submit false, misleading, or defamatory information",
                "Attempt to gain unauthorised access to any part of the Site",
                "Use the Site for any unlawful purpose or in a way that infringes the rights of others",
                "Reproduce or republish Site content without attribution and our consent",
              ].map((item) => (
                <li key={item} className="flex gap-3 text-sm text-gray-600">
                  <span className="text-[#C9A84C] flex-none">→</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">4. Accuracy of information</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              Business information on this Site is sourced from publicly available data and owner submissions. While we make reasonable efforts to ensure accuracy and keep listings up to date, we cannot guarantee that all information is current, complete, or error-free.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              <strong>Always verify opening hours, prices, and contact details directly with the business before visiting.</strong> We accept no liability for any loss or inconvenience arising from reliance on out-of-date or inaccurate listing information.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">5. Business listing terms</h2>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-[#1B2E4B] text-sm mb-2">5.1 Free listings</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Free listings are provided at our sole discretion and may be added, modified, or removed at any time without notice. A free listing does not constitute a contractual relationship between Churchtown Media and the listed business.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1B2E4B] text-sm mb-2">5.2 Paid subscriptions</h3>
                <ul className="space-y-2">
                  {[
                    "Paid subscriptions are billed monthly in advance via Stripe",
                    "Subscriptions may be cancelled at any time; cancellation takes effect at the end of the current billing period",
                    "No refund is given for the unused portion of a current billing period",
                    "We reserve the right to change subscription pricing with 30 days' written notice",
                    "Failure to pay will result in suspension and, after 14 days, removal of the enhanced listing",
                  ].map((item) => (
                    <li key={item} className="flex gap-3 text-sm text-gray-600">
                      <span className="text-[#C9A84C] flex-none mt-0.5">•</span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#1B2E4B] text-sm mb-2">5.3 Your listing content</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  You are solely responsible for ensuring that the information you submit for your listing is accurate, not misleading, and does not infringe any third-party rights. By submitting content, you grant Churchtown Media a non-exclusive, royalty-free licence to display that content on this Site and in related promotional materials.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1B2E4B] text-sm mb-2">5.4 Removal of listings</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  We reserve the right to remove or suspend any listing, at any time and without notice, that we reasonably believe: contains false or misleading information; breaches these terms; is associated with unlawful activity; or is harmful to the reputation of TheLakesGuide.co.uk or other listed businesses.
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-[#1B2E4B] text-sm mb-2">5.5 Featured and sponsored placements</h3>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Featured, sponsored, and premium placement positions are sold on availability and do not guarantee any specific number of enquiries, clicks, or conversions. We make no representations regarding the commercial benefit of any placement.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">6. Intellectual property</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              All site content, design, code, and branding is owned by or licensed to Churchtown Media unless otherwise stated. You may not reproduce, distribute, or create derivative works from any part of this Site without our prior written consent.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              Business owners retain full ownership of content they submit to the Site. By submitting content, you warrant that you have the right to do so and that the content does not infringe the intellectual property rights of any third party.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">7. External links</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              This Site contains links to third-party websites, including business websites and event booking platforms. We have no control over the content or practices of those sites and accept no responsibility for them. Links are provided for convenience only and do not constitute endorsement.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">8. Limitation of liability</h2>
            <p className="text-gray-600 text-sm leading-relaxed mb-3">
              To the fullest extent permitted by law, Churchtown Media shall not be liable for any indirect, incidental, consequential, or punitive loss or damage arising from your use of this Site, including reliance on any listing information.
            </p>
            <p className="text-gray-600 text-sm leading-relaxed">
              We are not responsible for the quality, safety, or suitability of services provided by any business listed on this Site. Any dispute between you and a listed business is a matter between you and that business alone.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">9. Governing law</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              These Terms &amp; Conditions are governed by the laws of <strong>England and Wales</strong>. Any disputes arising from or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of England and Wales.
            </p>
          </section>

          <section>
            <h2 className="font-display text-xl font-bold text-[#1B2E4B] mb-4">10. Changes to these terms</h2>
            <p className="text-gray-600 text-sm leading-relaxed">
              We may update these terms at any time. We will update the &ldquo;last updated&rdquo; date at the top of this page. For material changes affecting paid subscribers, we will provide at least 14 days&apos; notice by email. Continued use of the Site after any update constitutes acceptance of the new terms.
            </p>
          </section>

        </div>

        <div className="mt-8 text-center text-sm text-gray-400">
          Questions?{" "}
          <Link href="/contact" className="text-[#C9A84C] hover:underline">Contact us</Link>
          {" "}·{" "}
          <Link href="/privacy" className="text-[#C9A84C] hover:underline">Privacy Policy</Link>
        </div>
      </div>
    </div>
  );
}
