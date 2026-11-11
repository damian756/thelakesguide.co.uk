import Link from "next/link";
import Image from "next/image";
import { getAdSlot, activeSponsor, type AdSlotConfig } from "@/lib/ad-slots";
import { getAdOption } from "@/lib/ad-options";

// One advertising space (lib/ad-slots.ts). Filled: a labelled card with a
// sponsored link. Empty: an "advertise here" card linking to the option on
// /advertise. Static text and an image only: no scripts, cookies or trackers.

function emptyCopy(slot: AdSlotConfig) {
  if (slot.kind === "home") {
    return {
      kicker: "Advertising space",
      title: "Your Lake District business here",
      body: "One local business on the home page, labelled Advertisement, with a photo, a line about you and a link.",
    };
  }
  const title = slot.title.replace(/^Sponsor of /, "Sponsor ");
  if (slot.option === "winter-package") {
    return {
      kicker: "Sponsor this guide",
      title,
      body: "One business at the end of this guide from December to February, labelled Sponsor. Sponsors never appear inside the guide's text.",
    };
  }
  if (slot.kind === "post") {
    return {
      kicker: "Sponsor this space",
      title,
      body: "One business at the end of our travel and seasonal posts, labelled Sponsor. Sponsors never appear inside a post's text.",
    };
  }
  return {
    kicker: "Sponsor this guide",
    title,
    body: "Your business shown once at the end of this guide, labelled Sponsor. Sponsors never appear inside the guide's text.",
  };
}

export default function AdSlot({ id, className = "" }: { id: string; className?: string }) {
  const slot = getAdSlot(id);
  if (!slot) return null;
  const option = getAdOption(slot.option);
  const sponsor = activeSponsor(slot);

  if (sponsor) {
    const label = slot.kind === "home" ? "Advertisement" : "Sponsor";
    return (
      <aside className={`text-pretty ${className}`} aria-label={label}>
        <div className="rounded-2xl border border-[#14231C]/10 bg-white p-5 md:p-6 flex flex-col sm:flex-row gap-5 sm:items-center">
          {sponsor.image && (
            <div className="relative w-full sm:w-44 aspect-[16/10] sm:aspect-auto sm:h-28 flex-none overflow-hidden rounded-xl bg-[#EAEDE8]">
              <Image src={sponsor.image} alt="" fill sizes="(max-width: 640px) 100vw, 176px" className="object-cover" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-[#8A5418] mb-1">{label}</p>
            <p className="font-display text-lg font-bold text-[#14231C] mb-1">{sponsor.name}</p>
            <p className="text-sm text-[#14231C]/75 leading-relaxed mb-3">{sponsor.text}</p>
            <a
              href={sponsor.url}
              target="_blank"
              rel="sponsored noopener"
              className="inline-block bg-[#14231C] text-white text-sm font-semibold px-4 py-2 rounded-full hover:bg-[#245E3F] transition-colors"
            >
              Visit {sponsor.name}
            </a>
          </div>
        </div>
      </aside>
    );
  }

  const copy = emptyCopy(slot);
  return (
    <aside className={`text-pretty ${className}`} aria-label="Advertising space">
      <div className="rounded-2xl border-[1.5px] border-dashed border-[#C4782A]/55 bg-[#FBF6EF] px-5 py-5 sm:px-6 flex flex-wrap items-center justify-between gap-x-6 gap-y-4">
        <div className="min-w-0 flex-[1_1_22rem]">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-[#8A5418] mb-1.5">{copy.kicker}</p>
          <p className="font-display text-[19px] leading-snug font-bold text-[#14231C] mb-1.5">{copy.title}</p>
          <p className="text-sm leading-relaxed text-[#14231C]/75">{copy.body}</p>
        </div>
        <div className="flex flex-col items-start gap-2">
          {option && <p className="text-[13px] font-semibold text-[#14231C]">{option.cardPrice}</p>}
          <Link
            href={`/advertise?space=${id}#${slot.option}`}
            className="inline-block bg-[#14231C] text-white text-sm font-semibold px-[18px] py-2.5 rounded-full hover:bg-[#245E3F] transition-colors"
          >
            See advertising options
          </Link>
        </div>
      </div>
    </aside>
  );
}
