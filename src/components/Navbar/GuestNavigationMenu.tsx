'use client'

import Link from 'next/link'
import * as React from 'react'
import { Menu, ChevronLeft, ChevronRight } from 'lucide-react'
import * as NavigationMenuPrimitive from '@radix-ui/react-navigation-menu'

import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
  NavigationMenuContent,
  NavigationMenuLink,
  NavigationMenuViewport,
} from '@/components/ui/navigation-menu'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { MobileMenuSection } from './MobileMenuSection'
import { Logo } from '../Logo'

type MenuItem = {
  label: string
  href?: string
  items?: Array<{ label: string; href: string; description?: string }>
}

export function MobileGuestMenuButton({
  menuItems,
  children,
}: {
  menuItems: MenuItem[]
  children?: React.ReactNode
}) {
  const [open, setOpen] = React.useState(false)

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild className="md:hidden">
        <Button variant="outline" size="sm">
          <Menu className="h-4 w-4" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px] sm:w-[400px] flex flex-col">
        <SheetHeader>
          <SheetTitle>
            <Link href="/" className="flex">
              <Logo className="shrink-0 mt-[-8px] font-normal" width={40} height={40} />
              <span
                className="text-3xl font-bold text-gray-900 dark:text-white opacity-0 -ml-7"
                style={{ fontFamily: 'var(--font-scuole)' }}
              >
                s
              </span>
              <span
                className="text-3xl font-bold text-gray-900 dark:text-white"
                style={{ fontFamily: 'var(--font-scuole)' }}
              >
                cuole Infanzia
              </span>
            </Link>
          </SheetTitle>
        </SheetHeader>
        <nav className="flex flex-col gap-4 overflow-y-auto flex-1">
          {menuItems.map((item, index) => (
            <div key={item.href || `dropdown-${index}`}>
              {item.href ? (
                // Link singolo
                <MobileMenuSection title={item.label} titleHref={item.href} setOpen={setOpen} />
              ) : item.items ? (
                // Menu con sottoelementi
                <div className="space-y-2">
                  <h3 className="font-semibold text-sm text-muted-foreground px-2">{item.label}</h3>
                  <div className="space-y-1 pl-4">
                    {item.items.map((subItem) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        onClick={() => setOpen(false)}
                        className="block rounded-md px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground"
                      >
                        <div className="font-medium">{subItem.label}</div>
                        {subItem.description && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {subItem.description}
                          </p>
                        )}
                      </Link>
                    ))}
                  </div>
                </div>
              ) : null}
            </div>
          ))}
        </nav>
        {children && <div className="pt-4 mt-auto border-t">{children}</div>}
      </SheetContent>
    </Sheet>
  )
}

function GuestMenuListContent({ menuItems }: { menuItems: MenuItem[] }) {
  return (
    <>
      {menuItems.map((item, index) => (
        <NavigationMenuItem key={item.href || `dropdown-${index}`}>
          {item.href ? (
            // Link singolo
            <Link
              href={item.href}
              className="inline-flex h-9 w-max items-center justify-center rounded-md  px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary focus-visible:ring-2 focus-visible:ring-ring/50"
            >
              {item.label}
            </Link>
          ) : item.items ? (
            // Menu dropdown
            <>
              <NavigationMenuTrigger>{item.label}</NavigationMenuTrigger>
              <NavigationMenuContent>
                <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] px-0 py-0">
                  {item.items.map((subItem) => (
                    <li key={subItem.href}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={subItem.href}
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                        >
                          <div className="text-sm font-medium leading-none">{subItem.label}</div>
                          {subItem.description && (
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {subItem.description}
                            </p>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))}
                </ul>
              </NavigationMenuContent>
            </>
          ) : null}
        </NavigationMenuItem>
      ))}
    </>
  )
}

export function GuestNavigationMenu({ menuItems }: { menuItems: MenuItem[] }) {
  const isScrollable = menuItems.length > 6
  const scrollContainerRef = React.useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = React.useState(false)
  const [canScrollRight, setCanScrollRight] = React.useState(true)

  const checkScroll = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current
      setCanScrollLeft(scrollLeft > 0)
      // Use a small tolerance for float arithmetic
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1)
    }
  }

  React.useEffect(() => {
    if (isScrollable) {
      checkScroll()
      const container = scrollContainerRef.current
      if (container) {
        container.addEventListener('scroll', checkScroll)
        window.addEventListener('resize', checkScroll)
        // Also check after a short delay to allow layout to settle
        const timeout = setTimeout(checkScroll, 100)
        return () => {
          container.removeEventListener('scroll', checkScroll)
          window.removeEventListener('resize', checkScroll)
          clearTimeout(timeout)
        }
      }
    }
  }, [isScrollable])

  const scroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const { clientWidth } = scrollContainerRef.current
      const scrollAmount = clientWidth / 2
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      })
    }
  }

  if (isScrollable) {
    return (
      <NavigationMenuPrimitive.Root className="relative z-50 hidden md:flex max-w-max flex-1 items-center justify-center">
        <div className="flex items-center gap-2">
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => scroll('left')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          <div
            ref={scrollContainerRef}
            className="max-w-[700px] overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']"
          >
            <NavigationMenuList className="gap-6 w-max px-2">
              <GuestMenuListContent menuItems={menuItems} />
            </NavigationMenuList>
          </div>

          {canScrollRight && (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full"
              onClick={() => scroll('right')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>

        <NavigationMenuViewport />
      </NavigationMenuPrimitive.Root>
    )
  }

  return (
    <NavigationMenu viewport={false} className="z-50 hidden md:flex">
      <NavigationMenuList className="gap-6">
        <GuestMenuListContent menuItems={menuItems} />
      </NavigationMenuList>
    </NavigationMenu>
  )
}
