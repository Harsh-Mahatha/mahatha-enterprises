import type { FormEventHandler, ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";

export type FormPageLayoutProps = {
  title: string;
  description?: string;
  onSubmit?: FormEventHandler<HTMLFormElement>;
  actions?: ReactNode;
  children: ReactNode;
};

export function FormPageLayout({ title, description, onSubmit, actions, children }: FormPageLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} />
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
