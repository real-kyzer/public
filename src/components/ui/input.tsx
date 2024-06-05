import { cn } from "@/lib/utils";
import * as React from "react";

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          `disabled:opacity-50" flex h-full w-full rounded-md border border-input bg-background text-lg ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed
          ${
            type == "file"
              ? "file:link-clip p-4 file:mr-4 file:rounded-none file:border-0 file:bg-primary file:px-4 file:py-2 file:font-medium file:text-white file:hover:bg-secondary file:hover:text-primary"
              : "px-4 py-2"
          }`,
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = "Input";

export { Input };
