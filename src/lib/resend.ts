import { Resend } from "resend";

/** Falls back to Resend's shared onboarding sender until a verified domain is configured. */
export const REVIEW_EMAIL_FROM = process.env.RESEND_FROM_EMAIL || "ReviewFlow AI <onboarding@resend.dev>";

let client: Resend | null = null;

export function getResendClient() {
  if (!process.env.RESEND_API_KEY) return null;
  if (!client) client = new Resend(process.env.RESEND_API_KEY);
  return client;
}

export function fillTemplate(
  template: string,
  vars: Record<string, string>
): string {
  return template.replace(/{{\s*(\w+)\s*}}/g, (_, key) => vars[key] ?? "");
}
