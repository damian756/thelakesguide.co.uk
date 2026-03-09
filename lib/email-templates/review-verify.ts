export function generateReviewVerificationEmail(
  businessName: string,
  verifyUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirm your review of ${businessName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <div style="background: #1B2E4B; padding: 12px 16px; border-radius: 8px; margin: -24px -24px 20px -24px;">
        <span style="font-weight: bold; color: white;">The Lakes Guide</span>
        <span style="color: #C9A84C; font-weight: bold;">.co.uk</span>
      </div>
      <h2 style="color: #1B2E4B; margin: 0 0 12px;">Confirm your review</h2>
      <p style="color: #666; margin: 0 0 16px;">
        Thanks for reviewing <strong>${businessName}</strong>. Click below to verify your email address and submit your review for approval.
      </p>
      <p style="margin: 0 0 24px;">
        <a href="${verifyUrl}" style="display: inline-block; background: #C9A84C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Confirm my review →</a>
      </p>
      <p style="color: #aaa; font-size: 12px; margin: 0;">
        This link expires in 48 hours. If you didn't submit a review, you can ignore this email.
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateReviewApprovedEmail(
  reviewerName: string,
  businessName: string,
  businessUrl: string
): string {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your review of ${businessName} is live</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <div style="background: #1B2E4B; padding: 12px 16px; border-radius: 8px; margin: -24px -24px 20px -24px;">
        <span style="font-weight: bold; color: white;">The Lakes Guide</span>
        <span style="color: #C9A84C; font-weight: bold;">.co.uk</span>
      </div>
      <h2 style="color: #1B2E4B; margin: 0 0 12px;">Your review is live</h2>
      <p style="color: #666; margin: 0 0 16px;">
        Hi ${reviewerName}, your review of <strong>${businessName}</strong> has been approved and is now live on The Lakes Guide.
      </p>
      <p style="margin: 0;">
        <a href="${businessUrl}" style="display: inline-block; background: #C9A84C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View listing →</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateNewSiteReviewEmail(
  ownerName: string | null,
  businessName: string,
  reviewerDisplay: string,
  starRating: number,
  reviewBody: string
): string {
  const baseUrl = process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk";
  const stars = "★".repeat(starRating) + "☆".repeat(5 - starRating);

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New review for ${businessName}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <div style="background: #1B2E4B; padding: 12px 16px; border-radius: 8px; margin: -24px -24px 20px -24px;">
        <span style="font-weight: bold; color: white;">The Lakes Guide</span>
        <span style="color: #C9A84C; font-weight: bold;"> Review Alert</span>
      </div>
      <h2 style="color: #1B2E4B; margin: 0 0 12px;">New review for ${businessName}</h2>
      <p style="color: #666; margin: 0 0 16px;">Hi ${ownerName || "there"},</p>
      <div style="background: #f9f9f9; border-left: 3px solid #C9A84C; padding: 12px 16px; border-radius: 4px; margin: 0 0 16px;">
        <p style="margin: 0 0 6px; font-weight: bold; color: #1B2E4B;">${reviewerDisplay} &nbsp; <span style="color: #C9A84C;">${stars}</span></p>
        <p style="margin: 0; color: #444; font-size: 14px;">${reviewBody.slice(0, 300)}${reviewBody.length > 300 ? "..." : ""}</p>
      </div>
      <p style="margin: 0;">
        <a href="${baseUrl}/dashboard/reviews" style="display: inline-block; background: #C9A84C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">Respond to this review →</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
