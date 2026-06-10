import { Link } from "@tanstack/react-router";

type StoreBreadcrumbNavProps = {
  currentPageLabel: string;
};

export function StoreBreadcrumbNav({ currentPageLabel }: StoreBreadcrumbNavProps) {
  return (
    <div
      className="flex flex-wrap items-center gap-3 text-sm text-stone-600"
      aria-label="Breadcrumb"
    >
      <Link className="transition hover:text-stone-950" to="/2026">
        Home
      </Link>
      <span className="text-stone-400" aria-hidden="true">
        /
      </span>
      {currentPageLabel === "Merch" ? (
        <CurrentBreadcrumbLabel label="Merch" />
      ) : (
        <>
          <Link className="transition hover:text-stone-950" to="/store/products">
            Merch
          </Link>
          <span className="text-stone-400" aria-hidden="true">
            /
          </span>
          <CurrentBreadcrumbLabel label={currentPageLabel} />
        </>
      )}
    </div>
  );
}

function CurrentBreadcrumbLabel({ label }: { label: string }) {
  return (
    <span
      className="max-w-[min(16rem,50vw)] truncate font-semibold text-stone-950"
      aria-current="page"
      title={label}
    >
      {label}
    </span>
  );
}
