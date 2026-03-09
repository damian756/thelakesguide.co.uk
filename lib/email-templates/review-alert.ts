type BusinessForAlert = {
  name: string;
};

type UserForAlert = {
  name: string | null;
  email: string;
};

export function generateNewReviewEmail(
  business: BusinessForAlert,
  user: UserForAlert,
  newCount: number,
  rating: number
): string {
  const baseUrl =
    process.env.NEXTAUTH_URL || "https://www.southportguide.co.uk";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New review for ${business.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <div style="background: #1B2E4B; padding: 12px 16px; border-radius: 8px; margin: -24px -24px 20px -24px;">
        <span style="font-weight: bold; color: white;">SouthportGuide</span>
        <span style="color: #C9A84C; font-weight: bold;"> Review Alert</span>
      </div>
      <h2 style="color: #1B2E4B; margin: 0 0 16px;">New review for ${business.name}</h2>
      <p style="color: #666; margin: 0 0 16px;">
        Hi ${user.name || "there"},
      </p>
      <p style="color: #666; margin: 0 0 16px;">
        Great news — ${business.name} has received a new Google review. Your listing now has <strong>${newCount.toLocaleString()}</strong> reviews with an average rating of <strong>${rating.toFixed(1)} ★</strong>.
      </p>
      <p style="margin: 0;">
        <a href="${baseUrl}/dashboard/reviews" style="display: inline-block; background: #C9A84C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View reviews →</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}

export function generateRatingChangeEmail(
  business: BusinessForAlert,
  user: UserForAlert,
  oldRating: number,
  newRating: number
): string {
  const baseUrl =
    process.env.NEXTAUTH_URL || "https://www.southportguide.co.uk";

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Rating update for ${business.name}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5;">
  <div style="max-width: 560px; margin: 0 auto; padding: 24px;">
    <div style="background: white; border-radius: 12px; padding: 24px; border: 1px solid #eee;">
      <div style="background: #1B2E4B; padding: 12px 16px; border-radius: 8px; margin: -24px -24px 20px -24px;">
        <span style="font-weight: bold; color: white;">SouthportGuide</span>
        <span style="color: #C9A84C; font-weight: bold;"> Review Alert</span>
      </div>
      <h2 style="color: #1B2E4B; margin: 0 0 16px;">Rating update for ${business.name}</h2>
      <p style="color: #666; margin: 0 0 16px;">
        Hi ${user.name || "there"},
      </p>
      <p style="color: #666; margin: 0 0 16px;">
        The Google rating for ${business.name} has changed from <strong>${oldRating.toFixed(1)} ★</strong> to <strong>${newRating.toFixed(1)} ★</strong>.
      </p>
      <p style="margin: 0;">
        <a href="${baseUrl}/dashboard/reviews" style="display: inline-block; background: #C9A84C; color: white; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold;">View reviews →</a>
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();
}
