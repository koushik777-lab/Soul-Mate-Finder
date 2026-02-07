import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { Heart, MessageCircle, User, LogOut, Menu, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export function Navigation() {
  const { user, logout } = useAuth();
  const [location] = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: "Matches", href: "/browse", icon: Heart },
    { label: "Messages", href: "/messages", icon: MessageCircle },
    { label: "Dashboard", href: "/dashboard", icon: User },
  ];

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-pink-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-full">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <span className="font-display text-2xl font-bold text-gray-900 tracking-tight">
              Soul<span className="text-primary">Mate</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            {user ? (
              <>
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary ${
                      location === item.href ? "text-primary" : "text-gray-600"
                    }`}
                  >
                    <item.icon className="w-4 h-4" />
                    {item.label}
                  </Link>
                ))}
                
                <div className="w-px h-6 bg-gray-200 mx-2" />
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full hover:bg-transparent">
                      <Avatar className="h-9 w-9 border-2 border-white ring-2 ring-pink-100 transition-shadow hover:ring-primary/50">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                        <AvatarFallback>{user.username[0].toUpperCase()}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56 rounded-xl border-pink-100 shadow-lg shadow-pink-500/10">
                    <DropdownMenuItem className="text-sm font-medium">
                      Signed in as @{user.username}
                    </DropdownMenuItem>
                    {user.isAdmin && (
                      <Link href="/admin">
                        <DropdownMenuItem className="cursor-pointer">Admin Panel</DropdownMenuItem>
                      </Link>
                    )}
                    <DropdownMenuItem onClick={() => logout()} className="text-red-500 cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/auth">
                  <Button variant="ghost" className="text-gray-600 hover:text-primary hover:bg-pink-50">Log in</Button>
                </Link>
                <Link href="/auth">
                  <Button className="btn-romantic rounded-full px-6">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Nav */}
          <div className="md:hidden">
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Menu className="w-6 h-6 text-gray-700" />
                </Button>
              </SheetTrigger>
              <SheetContent className="w-full sm:w-[300px] border-l border-pink-100 bg-white/95 backdrop-blur-xl">
                <div className="flex flex-col gap-6 mt-10">
                  {user ? (
                    <>
                      <div className="flex items-center gap-3 px-2">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.username}`} />
                          <AvatarFallback>{user.username[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.username}</p>
                          <p className="text-xs text-muted-foreground">Online</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        {navItems.map((item) => (
                          <Link key={item.href} href={item.href} onClick={() => setIsOpen(false)}>
                            <div className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-colors ${
                              location === item.href ? "bg-pink-50 text-primary" : "hover:bg-gray-50 text-gray-600"
                            }`}>
                              <item.icon className="w-5 h-5" />
                              <span className="font-medium">{item.label}</span>
                            </div>
                          </Link>
                        ))}
                      </div>
                      <Button 
                        variant="outline" 
                        className="w-full mt-4 border-pink-200 text-pink-600 hover:bg-pink-50 hover:text-pink-700"
                        onClick={() => {
                          logout();
                          setIsOpen(false);
                        }}
                      >
                        Sign Out
                      </Button>
                    </>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        <Button className="w-full btn-romantic">Join Now</Button>
                      </Link>
                      <Link href="/auth" onClick={() => setIsOpen(false)}>
                        <Button variant="ghost" className="w-full">Sign In</Button>
                      </Link>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
