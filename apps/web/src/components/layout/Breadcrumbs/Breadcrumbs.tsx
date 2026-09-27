import { Fragment } from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
};

// Every item with an href is a link; the last item is the current page and is
// rendered as plain text.
export function Breadcrumbs({ items }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <Fragment key={`${index}-${item.label}`}>
              {index > 0 ? (
                <li aria-hidden="true">
                  <ChevronRight className="size-3.5" />
                </li>
              ) : null}
              <li className="min-w-0 max-w-[16rem] truncate">
                {item.href && !isCurrent ? (
                  <Link href={item.href} className="hover:text-foreground hover:underline">
                    {item.label}
                  </Link>
                ) : (
                  <span className="text-foreground" aria-current={isCurrent ? "page" : undefined}>
                    {item.label}
                  </span>
                )}
              </li>
            </Fragment>
          );
        })}
      </ol>
    </nav>
  );
}
