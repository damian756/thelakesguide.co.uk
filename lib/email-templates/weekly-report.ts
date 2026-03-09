type BusinessForEmail = {
  id: string;
  name: string;
  category: { name: string };
  rating: number | null;
  reviewCount: number | null;
  hubTier: string;
};

type UserForEmail = {
  name: string | null;
  email: string;
};

type WeekStats = {
  thisWeekClicks: Record<string, number>;
  lastWeekClicks: Record<string, number>;
  visibilityScore: number;
  categorySharePercent: number | null;
  rating: number | null;
  reviewCount: number | null;
  reviewDelta: number | null;
  ratingDelta: number | null;
};

type LakesEventForEmail = {
  title: string;
  isoDate: string;
  dayLabel: string;
  category: string;
  impactEstimate?: string | null;
};

export function generateWeeklyEmail(
  business: BusinessForEmail,
  user: UserForEmail,
  stats: WeekStats,
  options: { unsubscribeUrl: string; upcomingEvent?: LakesEventForEmail | null }
): string {
  const { unsubscribeUrl, upcomingEvent } = options;
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk";
  const upgradeUrl = `${baseUrl}/dashboard/upgrade`;
  const boostsUrl = `${baseUrl}/dashboard/boosts`;

  const totalThis = Object.values(stats.thisWeekClicks).reduce((a, b) => a + b, 0);
  const totalLast = Object.values(stats.lastWeekClicks).reduce((a, b) => a + b, 0);
  const trendPct =
    totalLast > 0 ? Math.round(((totalThis - totalLast) / totalLast) * 100) : (totalThis > 0 ? 100 : 0);

  const views = stats.thisWeekClicks.view ?? 0;
  const website = stats.thisWeekClicks.website ?? 0;
  const phone = stats.thisWeekClicks.phone ?? 0;
  const directions = stats.thisWeekClicks.directions ?? 0;

  const viewsLast = stats.lastWeekClicks.view ?? 0;
  const websiteLast = stats.lastWeekClicks.website ?? 0;
  const phoneLast = stats.lastWeekClicks.phone ?? 0;
  const directionsLast = stats.lastWeekClicks.directions ?? 0;

  const trendNum = (curr: number, last: number): number =>
    last > 0 ? Math.round(((curr - last) / last) * 100) : curr > 0 ? 100 : 0;

  const trendStr = (curr: number, last: number): string =>
    last > 0
      ? `${trendNum(curr, last) >= 0 ? "+" : ""}${trendNum(curr, last)}%`
      : curr > 0
        ? "+100%"
        : "n/a";

  const reviewLine =
    stats.rating != null && stats.reviewCount != null
      ? `${stats.rating.toFixed(1)} ★ (${stats.reviewCount.toLocaleString()} reviews)${
          stats.reviewDelta != null && stats.reviewDelta !== 0
            ? ` (${stats.reviewDelta > 0 ? "+" : ""}${stats.reviewDelta} since last check)`
            : stats.ratingDelta != null && stats.ratingDelta !== 0
              ? ` — ${stats.ratingDelta > 0 ? "+" : ""}${stats.ratingDelta.toFixed(1)} ★ since last check`
              : ""
        }`
      : "No rating data yet";

  const benchmarkLine =
    stats.categorySharePercent != null && stats.categorySharePercent > 0
      ? `You captured ${stats.categorySharePercent}% of ${business.category.name} clicks this week.`
      : null;

  const upgradeCta =
    business.hubTier !== "pro"
      ? `Upgrade to Pro to see how you compare to other ${business.category.name} businesses in the Lake District. <a href="${upgradeUrl}" style="color: #C9A84C; font-weight: bold;">Learn more →</a>`
      : null;

  const eventBlock =
    business.hubTier === "pro" && upcomingEvent
      ? `
    <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #1B2E4B; border-radius: 8px; overflow: hidden;">
      <tr>
        <td style="padding: 16px; color: white;">
          <strong style="color: #C9A84C;">Upcoming event</strong><br>
          ${upcomingEvent.title} | ${upcomingEvent.dayLabel}<br>
          ${upcomingEvent.impactEstimate ? `<span style="color: #C9A84C;">${upcomingEvent.impactEstimate}</span><br>` : ""}
          <a href="${boostsUrl}" style="color: #C9A84C; font-weight: bold;">Book a boost →</a>
        </td>
      </tr>
    </table>
  `
      : "";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Lakes Guide week</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background: #f5f5f5;">
  <div style="background: #1B2E4B; padding: 24px; text-align: center;">
    <span style="font-size: 20px; font-weight: bold; color: white;">The Lakes Guide</span>
    <span style="color: #C9A84C; font-weight: bold;"> Business Portal</span>
  </div>
  <div style="background: #C9A84C; height: 4px;"></div>
  <div style="max-width: 600px; margin: 0 auto; padding: 24px; background: white;">
    <h2 style="color: #1B2E4B; margin: 0 0 8px;">Good morning ${user.name || "there"},</h2>
    <p style="color: #666; margin: 0 0 24px;">Here's your The Lakes Guide week at a glance.</p>

    <table style="width: 100%; border-collapse: collapse; margin-bottom: 24px;">
      <tr>
        <td style="padding: 16px; border: 1px solid #eee; text-align: center; width: 25%;">
          <div style="font-size: 28px; font-weight: bold; color: #1B2E4B;">${views}</div>
          <div style="font-size: 12px; color: #888;">Views</div>
          <div style="font-size: 11px; color: ${trendNum(views, viewsLast) >= 0 ? "#059669" : "#dc2626"};">
            ${trendStr(views, viewsLast)}
          </div>
        </td>
        <td style="padding: 16px; border: 1px solid #eee; text-align: center; width: 25%;">
          <div style="font-size: 28px; font-weight: bold; color: #1B2E4B;">${website}</div>
          <div style="font-size: 12px; color: #888;">Website</div>
          <div style="font-size: 11px; color: ${trendNum(website, websiteLast) >= 0 ? "#059669" : "#dc2626"};">
            ${trendStr(website, websiteLast)}
          </div>
        </td>
        <td style="padding: 16px; border: 1px solid #eee; text-align: center; width: 25%;">
          <div style="font-size: 28px; font-weight: bold; color: #1B2E4B;">${phone}</div>
          <div style="font-size: 12px; color: #888;">Phone</div>
          <div style="font-size: 11px; color: ${trendNum(phone, phoneLast) >= 0 ? "#059669" : "#dc2626"};">
            ${trendStr(phone, phoneLast)}
          </div>
        </td>
        <td style="padding: 16px; border: 1px solid #eee; text-align: center; width: 25%;">
          <div style="font-size: 28px; font-weight: bold; color: #1B2E4B;">${directions}</div>
          <div style="font-size: 12px; color: #888;">Directions</div>
          <div style="font-size: 11px; color: ${trendNum(directions, directionsLast) >= 0 ? "#059669" : "#dc2626"};">
            ${trendStr(directions, directionsLast)}
          </div>
        </td>
      </tr>
    </table>

    ${benchmarkLine ? `<p style="color: #1B2E4B; margin: 0 0 16px;">${benchmarkLine}</p>` : ""}
    ${upgradeCta ? `<p style="color: #666; margin: 0 0 24px;">${upgradeCta}</p>` : ""}

    <div style="border: 1px solid #eee; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
      <div style="font-size: 12px; font-weight: 600; color: #888; margin-bottom: 8px;">Google Reviews</div>
      <div style="color: #1B2E4B;">${reviewLine}</div>
    </div>

    ${eventBlock}

    <div style="margin-bottom: 24px;">
      <div style="font-size: 12px; font-weight: 600; color: #888; margin-bottom: 8px;">Visibility score</div>
      <div style="height: 8px; background: #eee; border-radius: 4px; overflow: hidden;">
        <div style="height: 100%; width: ${stats.visibilityScore}%; background: #C9A84C; transition: width 0.3s;"></div>
      </div>
      <div style="font-size: 14px; color: #666; margin-top: 4px;">${stats.visibilityScore}/100</div>
    </div>

    <hr style="border: none; border-top: 1px solid #eee; margin: 24px 0;">
    <p style="font-size: 12px; color: #888; margin: 0;">
      The Lakes Guide.co.uk · <a href="https://churchtownmedia.co.uk" style="color: #888;">Churchtown Media</a><br>
      <a href="${unsubscribeUrl}" style="color: #888;">Unsubscribe from weekly emails</a>
    </p>
  </div>
</body>
</html>
  `.trim();
}
