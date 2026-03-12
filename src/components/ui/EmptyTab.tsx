import { StickyNote } from "lucide-react"

import { cn } from "@/lib/utils.ts"

function EmptyTab({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <StickyNote
      role="banner"
      aria-label="Icon indicating an empty tab"
      className={cn("size-6", className)}
      {...props}
    />
  )
}

export { EmptyTab }
