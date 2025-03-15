"use client"

import { useState, useEffect } from "react"
import { Moon, Sun, Menu, X, Home, BarChart3, Settings, HelpCircle, Newspaper } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Navbar() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  const navItems = [
    { name: "Dashboard", icon: Home, href: "/" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Blog", icon: Newspaper, href: "/blog" },
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "Help", icon: HelpCircle, href: "/help" },
  ]

  return (
    <motion.nav
      className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-md"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <motion.div
              className="flex items-center gap-2"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <motion.div
                initial={{ rotate: 0 }}
                animate={{ rotate: [0, 15, 0, -15, 0] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, repeatDelay: 5 }}
              >
                <BarChart3 className="h-6 w-6 text-primary" />
              </motion.div>
              <motion.span
                className="text-xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                MaterialsTrack
              </motion.span>
            </motion.div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item, index) => {
            const isActive = pathname === item.href

            return (
              <Link key={item.name} href={item.href}>
                <motion.div
                  className={cn(
                    "flex items-center gap-1 text-sm font-medium transition-colors relative px-2 py-1.5 rounded-md",
                    isActive ? "text-foreground" : "text-muted-foreground hover:text-foreground hover:bg-accent",
                  )}
                  whileHover={{ scale: 1.05 }}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.1 * index }}
                >
                  <item.icon className="h-4 w-4" />
                  {item.name}
                  {isActive && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                      layoutId="navbar-indicator"
                      transition={{ type: "spring", stiffness: 300, damping: 30 }}
                    />
                  )}
                </motion.div>
              </Link>
            )
          })}
        </div>

        <div className="flex items-center gap-2">
          <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle theme"
              className="rounded-full"
            >
              <AnimatePresence mode="wait" initial={false}>
                {theme === "dark" ? (
                  <motion.div
                    key="moon"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Moon className="h-[1.2rem] w-[1.2rem]" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="sun"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Sun className="h-[1.2rem] w-[1.2rem]" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </motion.div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait" initial={false}>
                {mobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-6 w-6" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-6 w-6" />
                  </motion.div>
                )}
              </AnimatePresence>
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            className="md:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="container py-4 space-y-2">
              {navItems.map((item, index) => {
                const isActive = pathname === item.href

                return (
                  <Link key={item.name} href={item.href}>
                    <motion.div
                      className={cn(
                        "flex items-center gap-2 p-2 rounded-md",
                        isActive ? "bg-accent text-foreground" : "hover:bg-accent/50 text-muted-foreground",
                      )}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.05 * index }}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <item.icon className="h-5 w-5" />
                      {item.name}
                    </motion.div>
                  </Link>
                )
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  )
}

