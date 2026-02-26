"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

import { AuthLayout } from "@/components/layout/auth-layout"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Spinner } from "@/components/ui/spinner"
import { useAuthSession } from "@/features/auth/api"
import { useLockScreen } from "@/lib/providers/lockscreen-provider"
import { LockScreenForm } from "./lock-screen-form"

export function LockScreenContent() {
  const router = useRouter()
  const { data: session, status } = useAuthSession()
  const { setLocked } = useLockScreen()

  useEffect(() => {
    if (status === "unauthenticated") {
      setLocked(false)
      router.replace("/login")
    }
  }, [status, setLocked, router])

  const user = session?.user
    ? {
        name: session.user.name ?? "User",
        image: session.user.image_url ?? "/avatars/shadcn.png",
      }
    : { name: "User", image: "/avatars/shadcn.png" }

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "U"

  if (status === "loading" || status === "unauthenticated") {
    return (
      <AuthLayout>
        <div className="flex min-h-[200px] items-center justify-center">
          <Spinner className="size-8" />
        </div>
      </AuthLayout>
    )
  }

  return (
    <AuthLayout>
      <Card className="gap-4">
        <CardHeader className="text-center">
          <div className="mx-auto mb-3 flex justify-center">
            <Avatar className="size-16">
              <AvatarImage src={user.image} alt={user.name} />
              <AvatarFallback className="text-lg">{initials}</AvatarFallback>
            </Avatar>
          </div>
          <CardTitle className="text-base tracking-tight">{user.name}</CardTitle>
          <CardTitle className="text-base font-normal tracking-tight">
            Screen Locked
          </CardTitle>
          <CardDescription>
            Your screen has been locked. <br /> Please enter your password to
            continue.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <LockScreenForm />
        </CardContent>
        <CardFooter>
          <p className="px-8 text-center text-sm text-muted-foreground">
            Not you?{" "}
            <Link
              href="/login"
              className="hover:text-primary underline underline-offset-4"
            >
              Sign in as a different user.
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}