import { BASE_URL } from "./claim-approval";

export function getBoostUpsellHtml(params: {
  userName: string | null;
  businessName: string;
  categoryName: string;
  delta: number;
  currViews: number;
}): string {
  const { userName, businessName, categoryName, delta, currViews } = params;
  const boostsUrl = `${BASE_URL}/dashboard/boosts`;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>You're trending on SouthportGuide</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <div style="background: #1B2E4B; padding: 12px 16px; border-radius: 8px; margin: -24px -24px 20px -24px;">
        <span style="font-weight: bold; color: white;">Southport</span>
        <span style="color: #C9A84C; font-weight: bold;">Guide</span>
      </div>
      <h2 style="color: #1B2E4B; margin: 0 0 16px;">You're trending on SouthportGuide</h2>
      <p style="color: #666; margin: 0 0 16px; line-height: 1.6;">
        Hi ${userName || "there"},
      </p>
      <p style="color: #666; margin: 0 0 16px; line-height: 1.6;">
        <strong>${businessName}</strong> has had <strong>+${delta.toLocaleString()}</strong> more views this week compared to last week. That's one of the biggest spikes across all ${categoryName} listings in Southport.
      </p>
      <p style="color: #666; margin: 0 0 16px; line-height: 1.6;">
        When you're already trending, a boost puts you at the top of the page and keeps the momentum going. Boost credits are available in your dashboard.
      </p>
      <p style="margin: 0 0 24px;">
        <a href="${boostsUrl}" style="display: inline-block; background: #C9A84C; color: #1B2E4B; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none;">Use a boost credit</a>
      </p>
      <p style="color: #888; font-size: 13px;">
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

export function getBoostUpsellSubject(): string {
  return "You're trending on SouthportGuide — now's a good time to boost";
}
