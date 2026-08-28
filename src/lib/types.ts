export type Business = {
  id: string;
  owner_id: string;
  name: string;
  industry: string | null;
  google_review_link: string | null;
  created_at: string;
};

export type Customer = {
  id: string;
  business_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  service_date: string;
  notes: string | null;
  created_at: string;
};

export type EmailTemplate = {
  id: string;
  business_id: string;
  name: string;
  subject: string;
  body: string;
  is_default: boolean;
  created_at: string;
};

export type AutomationRule = {
  id: string;
  business_id: string;
  name: string;
  trigger_delay_days: number;
  template_id: string | null;
  active: boolean;
  created_at: string;
};

export type ReviewRequestStatus = "pending" | "sent" | "opened" | "completed" | "failed";

export type ReviewRequest = {
  id: string;
  business_id: string;
  customer_id: string;
  automation_rule_id: string | null;
  token: string;
  status: ReviewRequestStatus;
  rating: number | null;
  feedback: string | null;
  sent_at: string | null;
  opened_at: string | null;
  completed_at: string | null;
  created_at: string;
};
