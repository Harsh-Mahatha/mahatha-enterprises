import * as React from "react";
import { Button, type ButtonProps } from "@/components/ui/Button";

export type IconButtonProps = Omit<ButtonProps, "size"> & {
  "aria-label": string;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ variant = "ghost", ...props }, ref) => <Button ref={ref} variant={variant} size="icon" {...props} />,
);
IconButton.displayName = "IconButton";
