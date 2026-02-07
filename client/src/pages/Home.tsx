import { useEffect, useRef } from "react";
import { Link } from "wouter";
import { gsap } from "gsap";
import { Button } from "@/components/ui/button";
import { Heart, Search, Shield, Users } from "lucide-react";
import { useUser } from "@/hooks/use-auth";

export default function Home() {
  const { user } = useUser();
  const heroRef = useRef<HTMLDivElement>(null);
  const heartsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Hero Text Animation
      gsap.from(".hero-text", {
        y: 100,
        opacity: 0,
        duration: 1.5,
        stagger: 0.2,
        ease: "power4.out",
      });

      // Floating Hearts Animation
      const hearts = document.querySelectorAll(".floating-heart");
      hearts.forEach((heart) => {
        gsap.to(heart, {
          y: "random(-100, -300)",
          x: "random(-50, 50)",
          rotation: "random(-45, 45)",
          duration: "random(10, 20)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
        });
      });
    }, heroRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section ref={heroRef} className="relative h-screen flex items-center justify-center overflow-hidden bg-[#FFF5F7]">
        {/* Background Elements */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-white/90 z-10" />
        
        {/* Unsplash Romantic Background - Couple in sunset */}
        <div className="absolute inset-0 z-0 opacity-20">
            {/* couple silhouette sunset romance */}
           <img 
             src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&q=80"
             alt="Background" 
             className="w-full h-full object-cover"
           />
        </div>

        {/* Floating Hearts Decoration */}
        <div ref={heartsRef} className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {Array.from({ length: 12 }).map((_, i) => (
            <Heart 
              key={i}
              className={`floating-heart absolute text-pink-200 fill-pink-100 opacity-40`}
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100 + 20}%`,
                width: Math.random() * 40 + 20,
                height: Math.random() * 40 + 20,
              }}
            />
          ))}
        </div>

        <div className="container relative z-20 text-center px-4">
          <h1 className="hero-text font-display text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent">
            Find Your <br/>
            <span className="font-handwriting text-primary text-7xl md:text-9xl block mt-2">Soulmate</span>
          </h1>
          
          <p className="hero-text text-xl md:text-2xl text-muted-foreground mb-10 max-w-2xl mx-auto font-light leading-relaxed">
            Where serious relationships begin. Join millions of happy couples who found their perfect match with us.
          </p>
          
          <div className="hero-text flex flex-col sm:flex-row gap-4 justify-center items-center">
            {user ? (
               <Link href="/browse">
                <Button size="lg" className="rounded-full px-10 py-8 text-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-transform hover:-translate-y-1">
                  Browse Profiles
                </Button>
               </Link>
            ) : (
              <Link href="/auth?tab=register">
                <Button size="lg" className="rounded-full px-10 py-8 text-xl bg-primary hover:bg-primary/90 shadow-xl shadow-primary/30 transition-transform hover:-translate-y-1">
                  Start Your Journey
                </Button>
              </Link>
            )}
            <Link href="#how-it-works">
              <Button variant="outline" size="lg" className="rounded-full px-10 py-8 text-xl border-primary/20 text-primary hover:bg-primary/5">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Users, count: "2M+", label: "Active Profiles" },
              { icon: Heart, count: "500k+", label: "Happy Couples" },
              { icon: Shield, count: "100%", label: "Verified Profiles" },
            ].map((stat, i) => (
              <div key={i} className="text-center p-8 rounded-2xl bg-secondary/30 hover:bg-secondary/50 transition-colors">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                  <stat.icon className="w-8 h-8" />
                </div>
                <h3 className="text-4xl font-bold font-display text-gray-900 mb-2">{stat.count}</h3>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Stories */}
      <section className="py-24 bg-gradient-to-b from-white to-pink-50" id="stories">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-display font-bold mb-4">Success Stories</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">Real people, real love. Read about couples who found their forever with us.</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <div className="group relative overflow-hidden rounded-3xl aspect-video shadow-2xl">
              {/* couple wedding photo happy */}
              <img src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&q=80" alt="Success Story 1" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-2xl font-display font-bold">Sarah & Michael</h3>
                <p className="opacity-90 mt-2">"We met here 2 years ago and just got married!"</p>
              </div>
            </div>
            <div className="group relative overflow-hidden rounded-3xl aspect-video shadow-2xl">
               {/* couple holding hands beach */}
              <img src="https://images.unsplash.com/photo-1616091216791-a5360b5fc78a?w=800&q=80" alt="Success Story 2" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
              <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/80 to-transparent text-white">
                <h3 className="text-2xl font-display font-bold">Priya & Rahul</h3>
                <p className="opacity-90 mt-2">"Found my soulmate within 2 weeks. Highly recommended!"</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white border-t border-white/10">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center gap-2 mb-6">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span className="font-display text-2xl font-bold">SoulMate</span>
          </div>
          <p className="text-gray-400 mb-8">© 2024 SoulMate Matrimony. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
