import { formatDate } from "@/utils/format";

export type DateDisplayProps = {
  value: string | Date;
  className?: string;
};

export function DateDisplay({ value, className }: DateDisplayProps) {
  return (
    <time className={className} dateTime={new Date(value).toISOString()}>
      {formatDate(value)}
    </time>
  );
}
