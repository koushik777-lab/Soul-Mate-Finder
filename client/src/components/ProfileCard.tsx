import { motion } from "framer-motion";
import { MapPin, Briefcase, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Profile } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface ProfileCardProps {
  profile: Profile;
  onSendInterest: (id: number) => void;
  isInterestPending?: boolean;
}

export function ProfileCard({ profile, onSendInterest, isInterestPending }: ProfileCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-lg border border-pink-100 hover:shadow-2xl hover:shadow-pink-500/10 transition-all"
    >
      <div className="relative aspect-[3/4] overflow-hidden">
        {profile.photoUrl ? (
          <img
            src={profile.photoUrl}
            alt={profile.fullName}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-pink-50 flex items-center justify-center">
            <Heart className="w-16 h-16 text-pink-200 animate-pulse" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
        
        <div className="absolute top-3 right-3">
          <Button
            size="icon"
            variant="ghost"
            className="rounded-full bg-white/20 backdrop-blur-md hover:bg-white text-white hover:text-primary transition-all"
          >
            <Heart className="w-5 h-5" />
          </Button>
        </div>

        <div className="absolute bottom-0 left-0 right-0 p-5 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
          <h3 className="text-xl font-display font-bold">{profile.fullName}, {profile.age}</h3>
          
          <div className="mt-2 space-y-1 text-sm text-white/90">
            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5" />
              <span>{profile.city}</span>
            </div>
            {profile.profession && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-3.5 h-3.5" />
                <span>{profile.profession}</span>
              </div>
            )}
          </div>

          <div className="mt-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
            <Button 
              size="sm" 
              className="flex-1 bg-white text-primary hover:bg-pink-50 font-semibold rounded-full"
              onClick={() => onSendInterest(profile.userId)}
              disabled={isInterestPending}
            >
              {isInterestPending ? "Sent" : "Send Interest"}
            </Button>
            <Link href={`/profile/${profile.id}`}>
              <Button size="sm" variant="outline" className="rounded-full bg-transparent text-white border-white/50 hover:bg-white/20 hover:text-white">
                View
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {profile.isVerified && (
        <Badge className="absolute top-3 left-3 bg-blue-500/90 hover:bg-blue-500 backdrop-blur-sm border-0">
          Verified
        </Badge>
      )}
    </motion.div>
  );
}
