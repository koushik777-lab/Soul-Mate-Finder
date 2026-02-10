import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Heart, Users, Shield, Star } from "lucide-react";
import { useRef } from "react";

export default function Landing() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"]
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);

  return (
    <div className="min-h-screen bg-background overflow-hidden">
      {/* Hero Section */}
      <section ref={ref} className="relative h-screen flex items-center justify-center overflow-hidden">
        {/* Background Image with Parallax */}
        <motion.div
          style={{ y, opacity }}
          className="absolute inset-0 z-0"
        >
          {/* Couple at sunset holding hands */}
          <img
            src="/hero_couple.png"
            alt="Romantic couple silhouette"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-black/30" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-5xl mx-auto px-4 text-center text-white">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold mb-6 drop-shadow-2xl tracking-tight">
              Find Your <span className="text-pink-300 italic">Forever</span>
            </h1>
            <p className="text-xl md:text-2xl font-light mb-10 max-w-2xl mx-auto text-white/90">
              Where meaningful connections blossom into beautiful stories. Join thousands of happy couples who found love here.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth">
                <Button size="lg" className="rounded-full px-8 py-6 text-lg btn-romantic">
                  Start Journey <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>

        {/* Floating Elements Animation */}
        <div className="absolute inset-0 z-0 pointer-events-none">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-pink-300/30"
              initial={{
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 100
              }}
              animate={{
                y: -100,
                rotate: 360,
                x: `calc(${Math.random() * 100}px)`
              }}
              transition={{
                duration: 15 + Math.random() * 10,
                repeat: Infinity,
                ease: "linear",
                delay: i * 2
              }}
            >
              <Heart size={20 + Math.random() * 40} fill="currentColor" />
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4 bg-white relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-primary font-semibold tracking-wider uppercase text-sm">Why Choose Us</span>
            <h2 className="font-display text-4xl md:text-5xl font-bold mt-2 mb-4 text-gray-900">Designed for Love</h2>
            <div className="w-24 h-1 bg-primary mx-auto rounded-full" />
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Shield,
                title: "Verified Profiles",
                desc: "Every profile is manually screened to ensure a safe and genuine community."
              },
              {
                icon: Users,
                title: "Smart Matching",
                desc: "Our intelligent algorithm connects you with people who share your values."
              },
              {
                icon: Star,
                title: "Success Stories",
                desc: "Thousands of successful marriages and counting. Be our next success story."
              }
            ].map((feature, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.2 }}
                className="p-8 rounded-3xl bg-pink-50/50 hover:bg-white hover:shadow-xl hover:shadow-pink-500/5 border border-transparent hover:border-pink-100 transition-all duration-300 group"
              >
                <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-display text-2xl font-bold mb-3">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Steps Section */}
      <section className="py-24 px-4 bg-secondary/30 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "radial-gradient(#ec4899 1px, transparent 1px)", backgroundSize: "32px 32px" }}></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Your Journey to <br />Happily Ever After</h2>
              <p className="text-lg text-gray-600 mb-8">We've simplified the process of finding your life partner into three easy steps.</p>

              <div className="space-y-8">
                {[
                  { step: "01", title: "Create Profile", text: "Sign up and tell us about yourself and your preferences." },
                  { step: "02", title: "Connect", text: "Browse matches and send interests to those you like." },
                  { step: "03", title: "Interact", text: "Start a conversation and get to know each other." }
                ].map((item, i) => (
                  <div key={i} className="flex gap-6 items-start">
                    <span className="flex-shrink-0 w-12 h-12 rounded-full bg-white flex items-center justify-center font-display font-bold text-primary shadow-sm border border-pink-100 text-xl">
                      {item.step}
                    </span>
                    <div>
                      <h4 className="font-bold text-xl mb-1">{item.title}</h4>
                      <p className="text-gray-500">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="relative aspect-square rounded-full overflow-hidden border-8 border-white shadow-2xl max-w-md mx-auto">
                {/* Wedding couple holding hands */}
                <img
                  src="https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=2940&auto=format&fit=crop"
                  alt="Happy Couple"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl max-w-xs animate-bounce" style={{ animationDuration: '3s' }}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white" />
                    ))}
                  </div>
                  <span className="text-sm font-bold text-gray-900">500+ Daily Matches</span>
                </div>
                <p className="text-xs text-gray-500">Join our growing community today.</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <section className="py-24 px-4 bg-primary text-white text-center">
        <h2 className="font-display text-4xl md:text-5xl font-bold mb-6">Ready to find love?</h2>
        <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">Don't wait for destiny. Take the first step towards your dream partner today.</p>
        <Link href="/auth">
          <Button size="lg" className="bg-white text-primary hover:bg-gray-100 hover:text-primary-foreground rounded-full px-10 py-6 text-lg font-bold shadow-xl">
            Register Free
          </Button>
        </Link>
      </section>
    </div>
  );
}
