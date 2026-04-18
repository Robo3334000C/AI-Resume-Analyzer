import * as React from "react";
import { cn } from "@/lib/utils";
import '@material/web/textfield/outlined-text-field.js';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> { }

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <md-outlined-text-field
      type="textarea"
      class={cn("w-full min-h-[80px]", className)}
      ref={ref}
      {...(props as any)}
    />
  );
});
Textarea.displayName = "Textarea";

export { Textarea };
