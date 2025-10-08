import * as React from "react"
// TODO: Install @radix-ui/react-checkbox when network is stable
// import * as CheckboxPrimitive from "@radix-ui/react-checkbox"
// import { Check } from "lucide-react"

import { cn } from "@/lib/utils/cn"

// Temporary native checkbox implementation until @radix-ui/react-checkbox is installed
const Checkbox = React.forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input
    type="checkbox"
    ref={ref}
    className={cn(
      "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 text-primary accent-primary",
      className
    )}
    {...props}
  />
))
Checkbox.displayName = "Checkbox"

export { Checkbox }
