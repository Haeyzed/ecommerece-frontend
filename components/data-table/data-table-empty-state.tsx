"use client"

import { Button } from '@/components/ui/button'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from '@/components/ui/empty'
import { HugeiconsIcon } from "@hugeicons/react"
import { ArrowUpRight01Icon } from "@hugeicons/core-free-icons"
import { ReactNode } from 'react'

type DataTableEmptyStateProps = {
  title: string
  description: string
  primaryAction?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  secondaryAction?: {
    label: string
    onClick: () => void
    icon?: ReactNode
  }
  learnMoreLink?: {
    href: string
    label: string
  }
}

export function DataTableEmptyState({
                                      title,
                                      description,
                                      primaryAction,
                                      secondaryAction,
                                      learnMoreLink,
                                    }: DataTableEmptyStateProps) {
  return (
    <Empty>
      <EmptyHeader>
        <EmptyTitle>{title}</EmptyTitle>
        <EmptyDescription>{description}</EmptyDescription>
      </EmptyHeader>
      {(primaryAction ?? secondaryAction ?? learnMoreLink) && (
        <EmptyContent>
          <div className="flex w-full flex-col items-center justify-center gap-2 sm:flex-row sm:gap-3">
            {primaryAction && (
              <Button
                className="w-full sm:w-auto"
                onClick={primaryAction.onClick}
              >
                {primaryAction.icon}
                <span>{primaryAction.label}</span>
              </Button>
            )}
            {secondaryAction && (
              <Button
                variant="outline"
                className="w-full sm:w-auto"
                onClick={secondaryAction.onClick}
              >
                {secondaryAction.icon}
                <span>{secondaryAction.label}</span>
              </Button>
            )}
            {learnMoreLink && (
              <Button
                variant="link"
                asChild
                className="w-full text-muted-foreground sm:w-auto"
              >
                <a href={learnMoreLink.href}>
                  {learnMoreLink.label}{' '}
                  <HugeiconsIcon icon={ArrowUpRight01Icon} strokeWidth={2} />
                </a>
              </Button>
            )}
          </div>
        </EmptyContent>
      )}
    </Empty>
  )
}