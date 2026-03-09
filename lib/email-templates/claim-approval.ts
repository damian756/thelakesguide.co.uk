const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || "The Lakes Guide <noreply@thelakesguide.co.uk>";
const BASE_URL = process.env.NEXTAUTH_URL || "https://www.thelakesguide.co.uk";

export function getClaimApprovalHtml(params: {
  name: string;
  businessName: string;
  activateUrl: string;
}): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 32px; border-radius: 8px;">
      <div style="border-bottom: 3px solid #C9A84C; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="font-size: 24px; color: #1B2E4B; margin: 0;">
          The Lakes <span style="color: #C9A84C;">Guide</span>.co.uk
        </h1>
      </div>
      <p style="color: #1B2E4B; font-size: 16px;">Hi ${params.name},</p>
      <p style="color: #555; line-height: 1.7;">
        Your claim for <strong>${params.businessName}</strong> has been approved. 
        Set your password and access your Business Hub dashboard:
      </p>
      <p style="margin: 24px 0;">
        <a href="${params.activateUrl}" style="display: inline-block; background: #C9A84C; color: #1B2E4B; font-weight: bold; padding: 14px 28px; border-radius: 8px; text-decoration: none;">
          Set password & access dashboard →
        </a>
      </p>
      <p style="color: #888; font-size: 13px;">
        This link expires in 7 days. If you need a new link, contact hello@thelakesguide.co.uk.
      </p>
      <p style="color: #1B2E4B; margin-top: 24px;">The Lakes Guide Team</p>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">
        Built by <a href="https://churchtownmedia.co.uk" style="color: #C9A84C;">Churchtown Media</a>, UK
      </p>
    </div>
  `;
}

export function getClaimRejectionHtml(params: {
  name: string;
  businessName: string;
}): string {
  return `
    <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #FAF8F5; padding: 32px; border-radius: 8px;">
      <div style="border-bottom: 3px solid #C9A84C; padding-bottom: 16px; margin-bottom: 24px;">
        <h1 style="font-size: 24px; color: #1B2E4B; margin: 0;">
          The Lakes <span style="color: #C9A84C;">Guide</span>.co.uk
        </h1>
      </div>
      <p style="color: #1B2E4B; font-size: 16px;">Hi ${params.name},</p>
      <p style="color: #555; line-height: 1.7;">
        We weren&apos;t able to verify your claim for <strong>${params.businessName}</strong> at this time.
      </p>
      <p style="color: #555; line-height: 1.7;">
        If you think this is a mistake, reply to this email and we&apos;ll look into it.
      </p>
      <p style="color: #1B2E4B; margin-top: 24px;">The Lakes Guide Team</p>
      <p style="color: #999; font-size: 12px; margin-top: 24px;">
        Built by <a href="https://churchtownmedia.co.uk" style="color: #C9A84C;">Churchtown Media</a>, UK
      </p>
    </div>
  `;
}

export { FROM_EMAIL, BASE_URL };
