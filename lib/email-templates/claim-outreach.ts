import { BASE_URL } from "./claim-approval";

export function getClaimOutreachHtml(params: {
  businessName: string;
  viewCount: number;
  claimUrl: string;
}): string {
  const { businessName, viewCount, claimUrl } = params;
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your business on The Lakes Guide</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <div style="background: #1B2E4B; padding: 12px 16px; border-radius: 8px; margin: -24px -24px 20px -24px;">
        <span style="font-weight: bold; color: white;">The Lakes</span>
        <span style="color: #C9A84C; font-weight: bold;">Guide</span>
      </div>
      <h2 style="color: #1B2E4B; margin: 0 0 16px;">Your business had ${viewCount.toLocaleString()} visitors on The Lakes Guide this month</h2>
      <p style="color: #666; margin: 0 0 16px; line-height: 1.6;">
        Hi,
      </p>
      <p style="color: #666; margin: 0 0 16px; line-height: 1.6;">
        Your listing for <strong>${businessName}</strong> on The Lakes Guide.co.uk had <strong>${viewCount.toLocaleString()}</strong> visitors in the last 30 days. People are looking for you. Your phone number, website and opening hours are the first things they look for.
      </p>
      <p style="color: #666; margin: 0 0 24px; line-height: 1.6;">
        Claiming your listing is free and takes about 2 minutes.
      </p>
      <p style="margin: 0;">
        <a href="${claimUrl}" style="display: inline-block; background: #C9A84C; color: #1B2E4B; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none;">Claim your listing</a>
      </p>
      <p style="color: #888; font-size: 13px; margin-top: 24px;">
        The The Lakes Guide Team
      </p>
      <p style="color: #999; font-size: 12px; margin-top: 16px;">
        Built by <a href="https://churchtownmedia.co.uk" style="color: #C9A84C;">Churchtown Media</a>, UK
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function getClaimOutreachSubject(businessName: string, viewCount: number): string {
  return `Your business had ${viewCount.toLocaleString()} visitors on The Lakes Guide this month`;
}
