import { Input } from "@/components/atoms/input";
import type { InputProps } from "@/components/atoms/input";
import { Label } from "@/components/atoms/label";
import { cn } from "@/lib/cn";

export interface FormFieldProps {
  id: string;
  label: string;
  helperText?: string;
  className?: string;
  inputProps?: Omit<InputProps, "id">;
}

export function FormField({ id, label, helperText, className, inputProps }: FormFieldProps) {
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <div className={cn("flex flex-col", className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} aria-describedby={helperId} {...inputProps} />
      {helperText ? (
        <p id={helperId} className="mt-1.5 text-xs text-slate-400">
          {helperText}
        </p>
      ) : null}
    </div>
  );
}
