import type { FormEventHandler, ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";

export type FormPageLayoutProps = {
  title: string;
  description?: string;
  /** Secondary actions shown in the page header (e.g. a link to a related page). */
  headerActions?: ReactNode;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  /** Primary form actions (Cancel/Save), rendered in a row below the fields. */
  actions?: ReactNode;
  children: ReactNode;
};

export function FormPageLayout({
  title,
  description,
  headerActions,
  onSubmit,
  actions,
  children,
}: FormPageLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} actions={headerActions} />
      <form onSubmit={onSubmit} className="flex flex-col gap-6">
        {children}
        {actions ? (
          <div className="flex flex-col-reverse gap-2 border-t border-border pt-6 sm:flex-row sm:justify-end">
            {actions}
          </div>
        ) : null}
      </form>
    </div>
  );
}
