import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";

export type ListPageLayoutProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  toolbar?: ReactNode;
  children: ReactNode;
};

export function ListPageLayout({ title, description, actions, toolbar, children }: ListPageLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} actions={actions} />
      {toolbar}
      {children}
    </div>
  );
}
