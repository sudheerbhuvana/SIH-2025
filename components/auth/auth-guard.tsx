"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { getCurrentUser } from "@/lib/storage"
import type { User } from "@/lib/storage"

interface AuthGuardProps {
  children: React.ReactNode
  requiredRole?: "student" | "teacher"
  redirectTo?: string
}

export function AuthGuard({ children, requiredRole, redirectTo = "/login" }: AuthGuardProps) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const currentUser = getCurrentUser()

    if (!currentUser) {
      router.push(redirectTo)
      return
    }

    if (requiredRole && currentUser.role !== requiredRole) {
      // Redirect to appropriate portal based on user role
      if (currentUser.role === "student") {
        router.push("/student")
      } else {
        router.push("/teacher")
      }
      return
    }

    setUser(currentUser)
    setIsLoading(false)
  }, [router, requiredRole, redirectTo])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return <>{children}</>
}
