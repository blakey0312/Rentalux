"use client"

import * as React from "react"
import Link from "next/link"
import { ModeToggle } from '../components/ui/toggle-mode'
import { cn } from "@/lib/utils"
import { SignOutButton, useSession, useUser,   SignedIn, SignedOut, SignInButton, UserButton } from "@clerk/nextjs";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import Logo from "./logo"
import { Button } from "@/components/ui/button"
import { toast } from "@/components/ui/use-toast"
import checkUserRole  from '../pages/utils/userUtils';
import { Menu as MenuIcon, X } from "lucide-react"
import { useState } from "react"

const components: { title: string; href: string; description: string }[] = [
  {
    title: "Vehicles",
    href: "/vehicles",
    description:
      "Our selection of vehicles",
  },
  {
    title: "Reservations",
    href: "/reservations",
    description:
      "Manage reservations",
  },
  
]

export default function Menu() {
  const { session } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const userRole = checkUserRole(session);

  return (
    <>
    {/* Desktop Navigation */}
    <div className="hidden min-[560px]:flex items-center w-full">
    <ul className="flex items-center px-1">
    <Logo/>
    </ul>
    <ul className="flex items-center flex-grow px-6">
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="">About</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
              <li className="row-span-3">
                <NavigationMenuLink asChild>
                  <a
                    className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"

                  >
                    {/* //<Icons.logo className="h-6 w-6" /> */}
                    <div className="mb-2 mt-4 text-lg font-medium">
                      Rentalux
                    </div>
                    <p className="text-sm leading-tight text-muted-foreground">
                      Beautifully designed Rental App with ease of use in mind
                    </p>
                  </a>
                </NavigationMenuLink>
              </li>
              <ListItem  title="Introduction">
                Rentalux aims to simplify the process of renting vehicles.
              </ListItem>
              <ListItem  title="Construction">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris elementum vitae augue ac imperdiet.
              </ListItem>
              <ListItem  title="Construction">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla quis quam ultricies, ultrices lectus at, volutpat tellus.
              </ListItem>
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <NavigationMenuItem>
          <NavigationMenuTrigger className="">Browse</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
              {components.map((component) => (
                <ListItem
                  key={component.title}
                  title={component.title}
                  href={component.href}
                >
                  {component.description}
                </ListItem>
              ))}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>
        <SignedIn>
        {userRole === 'admin' &&
        (
        <NavigationMenuItem>
          <Link href="/admin" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()  }>
              Admin
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        )
        }
        </SignedIn>
      </NavigationMenuList>
    </NavigationMenu>
    </ul>
    <ul className="flex items-center">
        <ModeToggle/>
    </ul>
    <SignedOut>
    <ul className="flex items-center">
          <Button className="ml-2 h-9">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </ul>
    </SignedOut>
    <SignedIn>
    <ul className="flex items-center">
          <SignOutButton>
            <Button className="ml-2 h-9" onClick={() => signout()}>
              Sign out
            </Button>
          </SignOutButton>
    </ul>
    </SignedIn>
  </div>

  {/* Mobile Navigation */}
  <div className="flex min-[560px]:hidden items-center justify-between w-full">
    <Logo/>
    <div className="flex items-center gap-2">
      <ModeToggle/>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        className="h-9 w-9"
      >
        {mobileMenuOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </Button>
    </div>
  </div>

  {/* Mobile Menu Dropdown */}
  {mobileMenuOpen && (
    <div className="min-[560px]:hidden absolute top-[72px] left-0 right-0 bg-background border-b shadow-lg z-50">
      <nav className="flex flex-col p-4 space-y-4">
        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground px-2">About</h3>
          <Link href="/" className="px-2 py-2 hover:bg-accent rounded-md" onClick={() => setMobileMenuOpen(false)}>
            Introduction
          </Link>
        </div>

        <div className="flex flex-col space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground px-2">Browse</h3>
          {components.map((component) => (
            <Link
              key={component.title}
              href={component.href}
              className="px-2 py-2 hover:bg-accent rounded-md"
              onClick={() => setMobileMenuOpen(false)}
            >
              <div className="font-medium">{component.title}</div>
              <div className="text-sm text-muted-foreground">{component.description}</div>
            </Link>
          ))}
        </div>

        <SignedIn>
          {userRole === 'admin' && (
            <Link href="/admin" className="px-2 py-2 hover:bg-accent rounded-md font-medium" onClick={() => setMobileMenuOpen(false)}>
              Admin
            </Link>
          )}
        </SignedIn>

        <div className="pt-4 border-t">
          <SignedOut>
            <Button className="w-full" asChild>
              <Link href="/sign-in" onClick={() => setMobileMenuOpen(false)}>Sign in</Link>
            </Button>
          </SignedOut>
          <SignedIn>
            <SignOutButton>
              <Button className="w-full" onClick={() => { signout(); setMobileMenuOpen(false); }}>
                Sign out
              </Button>
            </SignOutButton>
          </SignedIn>
        </div>
      </nav>
    </div>
  )}
  </>
  )
}

function signout(){
  toast({
    title: "Signed out!",
  })
}
const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
