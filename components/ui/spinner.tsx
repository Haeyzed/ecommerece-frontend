import { cn } from "@/lib/utils"
import { HugeiconsIcon } from "@hugeicons/react"
import { Loading03Icon } from "@hugeicons/core-free-icons"

// 1. Destructure strokeWidth out of props to prevent the type conflict
function Spinner({ className, strokeWidth, ...props }: React.ComponentProps<"svg">) {
  return (
    <HugeiconsIcon 
      icon={Loading03Icon} 
      {...props} 
      strokeWidth={2} 
      role="status" 
      aria-label="Loading" 
      className={cn("size-4 animate-spin", className)} 
    />
  )
}

export { Spinner }