import { Navigation } from "@/components/Navigation";
import { useProfiles, useMyProfile } from "@/hooks/use-profiles";
import { useSendInterest, useInterests } from "@/hooks/use-interactions";
import { ProfileCard } from "@/components/ProfileCard";
import { Loader2, Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Browse() {
  const [filters, setFilters] = useState<{
    ageMin?: number;
    ageMax?: number;
    religion?: string;
    city?: string;
    gender?: string;
  }>({
    ageMin: undefined,
    ageMax: undefined,
    religion: undefined,
    city: undefined
  });

  const { data: profiles, isLoading } = useProfiles(filters);
  const { data: myProfile } = useMyProfile();
  const { data: interests } = useInterests();
  const sendInterest = useSendInterest();

  // Filter out my own profile and already interacted profiles
  // Filter out my own profile, already interacted profiles, and SAME gender profiles
  const filteredProfiles = profiles?.filter(p => {
    const isMe = p.userId === myProfile?.userId;
    const hasInteracted = interests?.some(i => i.profile.userId === p.userId);
    const isSameGender = myProfile?.gender && p.gender === myProfile.gender;
    return !isMe && !isSameGender; // Show only opposite gender (or just not same gender)
  });

  const handleSendInterest = (id: string) => {
    sendInterest.mutate(id);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-display font-bold text-gray-900">Find Your Soul Mate</h1>
            <p className="text-gray-500 mt-1">Discover {myProfile?.gender === 'male' ? 'Female' : 'Male'} profiles matching your preferences</p>
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" className="gap-2 border-pink-200 hover:bg-pink-50 text-pink-700">
                <Filter className="w-4 h-4" /> Filters
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle className="font-display text-2xl">Filter Profiles</SheetTitle>
                <SheetDescription>Refine your search to find the perfect match.</SheetDescription>
              </SheetHeader>

              <div className="py-6 space-y-6">
                <div className="space-y-2">
                  <Label>Age Range</Label>
                  <div className="flex gap-4">
                    <Input
                      type="number"
                      placeholder="Min"
                      className="rounded-lg"
                      onChange={(e) => setFilters(prev => ({ ...prev, ageMin: e.target.value ? parseInt(e.target.value) : undefined }))}
                    />
                    <Input
                      type="number"
                      placeholder="Max"
                      className="rounded-lg"
                      onChange={(e) => setFilters(prev => ({ ...prev, ageMax: e.target.value ? parseInt(e.target.value) : undefined }))}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Religion</Label>
                  <Select onValueChange={(val) => setFilters(prev => ({ ...prev, religion: val === "All" ? undefined : val }))}>
                    <SelectTrigger className="rounded-lg">
                      <SelectValue placeholder="Select Religion" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All">All</SelectItem>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Muslim">Muslim</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Sikh">Sikh</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>City</Label>
                  <Input
                    placeholder="Enter city..."
                    className="rounded-lg"
                    onChange={(e) => setFilters(prev => ({ ...prev, city: e.target.value || undefined }))}
                  />
                </div>

                <Button className="w-full btn-romantic mt-4" onClick={() => document.getElementById("close-sheet")?.click()}>
                  Apply Filters
                </Button>
              </div>
            </SheetContent>
          </Sheet>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="w-10 h-10 text-primary animate-spin" />
          </div>
        ) : filteredProfiles?.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
            <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <X className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">No profiles found</h3>
            <p className="text-gray-500">Try adjusting your filters to see more results.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProfiles?.map((profile) => (
              <ProfileCard
                key={profile.id}
                profile={profile}
                onSendInterest={handleSendInterest}
                isInterestPending={interests?.some(i => i.interest.receiverId === profile.userId)}
                variant="feed"
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
