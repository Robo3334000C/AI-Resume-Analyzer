import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";
import '@material/web/button/filled-button.js';
import '@material/web/button/outlined-button.js';
import '@material/web/button/text-button.js';
import '@material/web/button/filled-tonal-button.js';

const buttonVariants = cva(
  // Cleaned up some visual variants because M3 components handle hover states, focus rings, and background colors internally
  // We keep layout classes (flex, whitespace, sizing) to not break existing structures.
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "",
        destructive: "destructive-m3", // We can use CSS to map error colors to this specific button
        outline: "",
        secondary: "",
        ghost: "",
        link: "",
      },
      size: {
        default: "min-h-[40px] px-4",
        sm: "min-h-[36px] px-3",
        lg: "min-h-[44px] px-8",
        icon: "min-h-[40px] w-[40px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
  VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, disabled, onClick, ...props }, ref) => {
    // Internal ref to attach native events to Custom Elements (React 18 bug)
    const internalRef = React.useRef<HTMLButtonElement>(null);

    React.useImperativeHandle(ref, () => internalRef.current as HTMLButtonElement);

    React.useEffect(() => {
      const el = internalRef.current;
      if (!el || !onClick) return;

      const handleClick = (e: Event) => onClick(e as any);
      el.addEventListener('click', handleClick);
      return () => el.removeEventListener('click', handleClick);
    }, [onClick]);
    // Determine which web component to render based on the Shadcn variant
    let Tag: any = 'md-filled-button';
    if (variant === 'outline') Tag = 'md-outlined-button';
    if (variant === 'secondary') Tag = 'md-filled-tonal-button';
    if (variant === 'ghost' || variant === 'link') Tag = 'md-text-button';

    // If asChild is true, we fallback to Slot for the existing behavior, but with M3 classes ideally.
    // However, it's safer to just render the standard component. Web components handle clicks natively.
    if (asChild) {
      return (
        <Slot className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
      );
    }

    // Fix for React 18 + Web Components boolean attribute bug:
    // React passes `disabled={false}` as `disabled="false"` to custom elements, causing them to be disabled.
    // We must pass `undefined` instead of `false` so the attribute is removed from the DOM.
    return (
      <Tag
        className={cn(buttonVariants({ variant, size, className }))}
        ref={internalRef}
        disabled={disabled || undefined}
        {...props}
      >
        {props.children}
      </Tag>
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
