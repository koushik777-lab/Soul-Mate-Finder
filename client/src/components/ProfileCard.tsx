import { motion } from "framer-motion";
import { MapPin, Briefcase, GraduationCap, Heart, CheckCircle, XCircle, MessageCircle, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { type Profile } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";

interface ProfileCardProps {
  profile: Profile;
  onSendInterest?: (id: string) => void;
  onAccept?: (id: string) => void;
  onDecline?: (id: string) => void;
  isInterestPending?: boolean;
  variant?: "feed" | "request" | "match";
}

export function ProfileCard({
  profile,
  onSendInterest,
  onAccept,
  onDecline,
  isInterestPending,
  variant = "feed"
}: ProfileCardProps) {

  // Limited view details for feed
  // Name, Education, Age, Work, State, City

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
      className="group relative bg-white rounded-3xl overflow-hidden shadow-lg border border-pink-100 hover:shadow-2xl hover:shadow-pink-500/10 transition-all h-full"
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

        {/* Verification Badge */}
        {profile.isVerified && (
          <Badge className="absolute top-4 left-4 bg-blue-500/90 hover:bg-blue-500 backdrop-blur-sm border-0 z-10 rounded-full px-3 py-1">
            Verified
          </Badge>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 transition-opacity" />

        {/* Content Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h3 className="text-2xl font-display font-bold mb-1">{profile.fullName}, {profile.age}</h3>

          <div className="space-y-2 text-sm text-gray-200 mb-4">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-pink-400" />
              <span>{profile.city}{profile.state ? `, ${profile.state}` : ''}</span>
            </div>
            {profile.profession && (
              <div className="flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-pink-400" />
                <span>{profile.profession}</span>
              </div>
            )}
            {profile.education && (
              <div className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-pink-400" />
                <span>{profile.education}</span>
              </div>
            )}
          </div>

          {/* Actions based on variant */}
          <div className="flex gap-3 pt-2">
            {variant === "feed" && onSendInterest && (
              <Button
                className={`w-full rounded-full font-semibold shadow-lg ${isInterestPending
                  ? "bg-gray-500/50 hover:bg-gray-500/50 text-white cursor-not-allowed"
                  : "btn-romantic"
                  }`}
                onClick={() => onSendInterest(profile.userId)}
                disabled={isInterestPending}
              >
                {isInterestPending ? "Interest Sent" : "Send Interest"}
                {!isInterestPending && <Heart className="w-4 h-4 red-500 ml-2 fill-current" />}
              </Button>
            )}

            {variant === "request" && (
              <div className="flex gap-2 w-full">
                {onDecline && (
                  <Button
                    className="flex-1 rounded-full bg-white/20 hover:bg-white/30 text-white border-0 backdrop-blur-md"
                    onClick={() => onDecline(profile.id)} // Pass profile.id or interaction id? Usually interaction ID needed but handled by parent
                  >
                    <XCircle className="w-5 h-5" />
                  </Button>
                )}
                {onAccept && (
                  <Button
                    className="flex-1 rounded-full bg-green-500 hover:bg-green-600 text-white border-0 shadow-lg shadow-green-500/20"
                    onClick={() => onAccept(profile.id)}
                  >
                    <CheckCircle className="w-5 h-5" />
                  </Button>
                )}
                <Link href={`/profile/${profile.userId}`}>
                  <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/20">
                    View
                  </Button>
                </Link>
              </div>
            )}

            {variant === "match" && (
              <div className="flex gap-2 w-full">
                <Link href={`/chat/${profile.userId}`} className="w-full">
                  <Button className="w-full rounded-full bg-white text-pink-600 hover:bg-pink-50 font-bold">
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                </Link>
                {onDecline && (
                  <Button
                    className="rounded-full bg-red-500/80 hover:bg-red-600 text-white border-0 backdrop-blur-md px-3"
                    onClick={() => onDecline(profile.id)}
                    title="Remove Match"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
                <Link href={`/profile/${profile.userId}`}>
                  <Button variant="outline" className="rounded-full border-white/30 text-white hover:bg-white/20">
                    View
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
