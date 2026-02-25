"use client";

/**
 * Combined Providers
 * Wraps app with all necessary providers
 */

import { DirectionProvider } from "./direction-provider";
import { FontProvider } from "./font-provider";
import { QueryProvider } from "./query-provider";
import { SessionProvider } from "./session-provider";
import { ThemeProvider } from "./theme-provider";
import { ActiveThemeProvider } from "./active-theme-provider";
import { LayoutProvider } from "./layout-provider";
import { SearchProvider } from "./search-provider";
import { LockScreenProvider } from "./lockscreen-provider";
import { TooltipProvider } from '@/components/ui/tooltip'

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <QueryProvider>
        <ThemeProvider>
          <ActiveThemeProvider>
            <FontProvider>
              <DirectionProvider>
                <LayoutProvider>
                  <SearchProvider>
                    <LockScreenProvider>
                      <TooltipProvider>
                        {children}
                      </TooltipProvider>
                    </LockScreenProvider>
                  </SearchProvider>
                </LayoutProvider>
              </DirectionProvider>
            </FontProvider>
          </ActiveThemeProvider>
        </ThemeProvider>
      </QueryProvider>
    </SessionProvider>
  );
}
