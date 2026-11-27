import { requireProfile } from "@/lib/auth";
import { Suspense } from "react";
import { AcademicLoading } from "@/components/academic-loading";
export const dynamic = "force-dynamic";
async function ProtectedPanel({ children }: { children: React.ReactNode }) {
  await requireProfile();
  return children;
}
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={<AcademicLoading />}>
      <ProtectedPanel>{children}</ProtectedPanel>
    </Suspense>
  );
}
