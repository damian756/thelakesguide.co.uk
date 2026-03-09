import { BASE_URL } from "./claim-approval";

export function getUpgradeNudgeHtml(params: {
  userName: string | null;
  businessName: string;
  categoryName: string;
  viewCount: number;
  categorySharePercent: number | null;
}): string {
  const { userName, businessName, categoryName, viewCount, categorySharePercent } = params;
  const upgradeUrl = `${BASE_URL}/dashboard/upgrade`;

  const shareLine =
    categorySharePercent != null && categorySharePercent > 0
      ? `That's ${categorySharePercent}% of all ${categoryName} searches in Southport.`
      : null;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${businessName} on SouthportGuide</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <div style="background: #1B2E4B; padding: 12px 16px; border-radius: 8px; margin: -24px -24px 20px -24px;">
        <span style="font-weight: bold; color: white;">Southport</span>
        <span style="color: #C9A84C; font-weight: bold;">Guide</span>
      </div>
      <h2 style="color: #1B2E4B; margin: 0 0 16px;">${businessName} had ${viewCount.toLocaleString()} visitors on SouthportGuide this week</h2>
      <p style="color: #666; margin: 0 0 16px; line-height: 1.6;">
        Hi ${userName || "there"},
      </p>
      <p style="color: #666; margin: 0 0 16px; line-height: 1.6;">
        Your SouthportGuide listing had <strong>${viewCount.toLocaleString()}</strong> views last week. ${shareLine ?? "People are finding you."}
      </p>
      <p style="color: #666; margin: 0 0 16px; line-height: 1.6;">
        With a Pro account you'd see exactly how you compare to competitors, get listed higher in search results, and unlock boost credits.
      </p>
      <p style="color: #666; margin: 0 0 24px; line-height: 1.6;">
        You're already getting the traffic. Pro helps you convert it.
      </p>
      <p style="margin: 0;">
        <a href="${upgradeUrl}" style="display: inline-block; background: #C9A84C; color: #1B2E4B; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none;">See Pro plans</a>
      </p>
      <p style="color: #888; font-size: 13px; margin-top: 24px;">
        The SouthportGuide Team
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 16px;">
        Built by <a href="https://churchtownmedia.co.uk" style="color: #C9A84C;">Churchtown Media</a>, Southport
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getUpgradeNudgeSubject(businessName: string, viewCount: number): string {
  return `${businessName} had ${viewCount.toLocaleString()} visitors on SouthportGuide this week`;
}
