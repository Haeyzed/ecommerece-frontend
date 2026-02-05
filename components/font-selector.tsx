"use client"

import type React from "react"

import { fonts } from "@/config/fonts"
import { cn } from "@/lib/utils"
import { useFont } from "@/lib/providers/font-provider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const fontLabels: Record<string, string> = {
  inter: "Inter",
  outfit: "Outfit",
  "noto-sans": "Noto Sans",
  figtree: "Figtree",
  roboto: "Roboto",
  raleway: "Raleway",
  "dm-sans": "DM Sans",
  "public-sans": "Public Sans",
  "jetbrains-mono": "JetBrains Mono",
}

export function FontSelector({ className }: React.ComponentProps<"div">) {
  const { font, setFont } = useFont()

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Label htmlFor="font-selector" className="text-sm font-medium text-muted-foreground">
        Font
      </Label>
      <Select value={font} onValueChange={(value) => setFont(value as typeof font)}>
        <SelectTrigger
          id="font-selector"
          className="h-9 w-full bg-secondary text-secondary-foreground border-secondary shadow-none px-3"
        >
          <div className="flex items-center gap-2 truncate">
            <span className="font-medium text-muted-foreground/70">Aa</span>
            <span className="truncate">{fontLabels[font] || font}</span>
          </div>
        </SelectTrigger>
        <SelectContent align="end" className="max-h-[300px]">
          {fonts.map((fontOption) => (
            <SelectItem key={fontOption} value={fontOption} className="cursor-pointer">
              <span className="text-sm">{fontLabels[fontOption] || fontOption}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}