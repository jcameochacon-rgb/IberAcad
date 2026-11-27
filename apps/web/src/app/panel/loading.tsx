import { BrandLoader } from "@/components/brand-loader";

export default function Loading() {
  return (
    <main className="mx-auto max-w-6xl p-6 sm:p-10">
      <BrandLoader />
      <div className="mt-4 grid gap-4 sm:grid-cols-2" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <div key={n} className="iber-skeleton h-32" />
        ))}
      </div>
    </main>
  );
}
