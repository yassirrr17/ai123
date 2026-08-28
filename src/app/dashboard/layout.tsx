import { requireBusiness } from "@/lib/business";
import { Sidebar } from "@/components/Sidebar";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { business } = await requireBusiness();

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar businessName={business.name} />
      <main className="flex-1 overflow-y-auto p-8">{children}</main>
    </div>
  );
}
