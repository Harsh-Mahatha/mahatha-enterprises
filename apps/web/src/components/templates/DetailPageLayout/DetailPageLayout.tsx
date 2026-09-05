import type { ReactNode } from "react";
import { PageHeader } from "@/components/layout/PageHeader";

export type DetailPageLayoutProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  summary?: ReactNode;
  children: ReactNode;
};

export function DetailPageLayout({ title, description, actions, summary, children }: DetailPageLayoutProps) {
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={title} description={description} actions={actions} />
      {summary}
      {children}
    </div>
  );
}
