import { AdminLayout } from "@/components/admin-layout";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // This layout is a placeholder that will be used for all admin pages.
  // The actual layout content is in the AdminLayout component.
  // We pass the page title from each page to the AdminLayout component.
  return <>{children}</>;
}
