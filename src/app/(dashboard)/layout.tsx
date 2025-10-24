import { TopNav } from "@/components/nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <TopNav title="Academic Jury Calendar" />
      <main>{children}</main>
    </>
  );
}
