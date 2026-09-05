import type { ReactNode } from "react";

export type ToolbarProps = {
  children: ReactNode;
  actions?: ReactNode;
};

export function Toolbar({ children, actions }: ToolbarProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-1 flex-wrap items-center gap-2">{children}</div>
      {actions ? <div className="flex items-center gap-2">{actions}</div> : null}
    </div>
  );
}
