"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Badge } from "@/components/ui/badge"
import { Menu, Leaf, User, GraduationCap, BarChart3, Home, BookOpen, Users, Settings, Image } from "lucide-react"
import { getCurrentUserFromSession } from "@/lib/storage-api"

export function Navigation() {
  const [isOpen, setIsOpen] = useState(false)
  const currentUser = getCurrentUserFromSession()

  const navItems = [
    { href: "/", label: "Dashboard", icon: BarChart3 },
    { href: "/student", label: "Student Portal", icon: GraduationCap },
    { href: "/teacher", label: "Teacher Portal", icon: User },
    { href: "/gallery", label: "Gallery", icon: Image },
    ...(currentUser?.role === 'admin' ? [{ href: "/admin", label: "Admin Portal", icon: Settings }] : []),
  ]

  const mobileNavItems = [
    { href: "/", label: "Dashboard", icon: Home, description: "Overview & Statistics" },
    { href: "/student", label: "Student Portal", icon: GraduationCap, description: "Tasks, Lessons & Progress" },
    { href: "/teacher", label: "Teacher Portal", icon: User, description: "Manage Students & Tasks" },
    { href: "/gallery", label: "Gallery", icon: Image, description: "View all task images" },
    ...(currentUser?.role === 'admin' ? [{ href: "/admin", label: "Admin Portal", icon: Settings, description: "Manage schools & system" }] : []),
    { href: "/login", label: "Login", icon: Settings, description: "Sign in to your account" },
    { href: "/signup", label: "Sign Up", icon: Users, description: "Create new account" },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center space-x-2">
          <div className="relative">
            <Leaf className="h-6 w-6 text-primary" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          </div>
          <span className="text-xl font-bold text-primary hidden sm:block">EcoCred Web</span>
          <span className="text-lg font-bold text-primary sm:hidden">EcoCred</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors px-3 py-2 rounded-md hover:bg-primary/5"
              >
                <Icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            )
          })}
          
          {/* User Status Badge */}
          {currentUser && (
            <Badge variant="secondary" className="ml-4">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs">{currentUser.name}</span>
              </div>
            </Badge>
          )}
        </nav>

        {/* Mobile Navigation */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="relative">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
              {/* Notification dot */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
              </div>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[320px] sm:w-[400px]">
            <div className="flex flex-col h-full">
              {/* Header */}
              <div className="flex items-center space-x-2 mb-6">
                <Leaf className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary">EcoCred Web</span>
              </div>

              {/* User Info */}
              {currentUser && (
                <div className="mb-6 p-4 bg-primary/5 rounded-lg border">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-primary-foreground" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm">{currentUser.name}</p>
                      <p className="text-xs text-muted-foreground">{currentUser.role}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <Badge variant="outline" className="text-xs">
                          {currentUser.ecoPoints} points
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {currentUser.streak} day streak
                        </Badge>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Items */}
              <nav className="flex flex-col space-y-2 flex-1">
                {mobileNavItems.map((item) => {
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="flex items-center space-x-3 p-3 text-sm font-medium hover:bg-primary/5 rounded-lg transition-colors group"
                      onClick={() => setIsOpen(false)}
                    >
                      <Icon className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                      <div className="flex-1">
                        <p className="font-medium">{item.label}</p>
                        <p className="text-xs text-muted-foreground">{item.description}</p>
                      </div>
                    </Link>
                  )
                })}
              </nav>

              {/* Footer */}
              <div className="mt-auto pt-4 border-t">
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>© 2025 EcoCred</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Online</span>
                  </div>
                </div>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
