import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useMyProfile } from "@/hooks/use-profiles";
import { useInterests, useUpdateInterest } from "@/hooks/use-interactions";
import { Loader2, Heart, Clock, CheckCircle, XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: profile, isLoading } = useMyProfile();
  const { data: interests } = useInterests();
  const updateInterest = useUpdateInterest();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
      </div>
    );
  }

  // Filter interests I received
  const receivedRequests = interests?.filter(i => 
    i.interest.receiverId === user?.id && i.interest.status === 'pending'
  ) || [];

  const handleAction = (id: number, status: 'accepted' | 'rejected') => {
    updateInterest.mutate({ id, status });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="mb-8">
          <h1 className="font-display text-3xl font-bold text-gray-900">
            Hello, {profile?.fullName || user?.username}
          </h1>
          <p className="text-gray-500">Welcome to your personal dashboard.</p>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="bg-white p-1 rounded-full border border-gray-200 inline-flex h-auto">
            <TabsTrigger value="overview" className="rounded-full px-6 py-2.5 data-[state=active]:bg-pink-50 data-[state=active]:text-primary">Overview</TabsTrigger>
            <TabsTrigger value="requests" className="rounded-full px-6 py-2.5 data-[state=active]:bg-pink-50 data-[state=active]:text-primary">
              Requests {receivedRequests.length > 0 && <span className="ml-2 bg-primary text-white text-xs px-1.5 py-0.5 rounded-full">{receivedRequests.length}</span>}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <div className="grid md:grid-cols-3 gap-6">
              {/* Profile Card */}
              <Card className="md:col-span-1 rounded-3xl overflow-hidden border-pink-100 shadow-lg">
                <div className="relative h-32 bg-gradient-to-r from-pink-300 to-purple-300"></div>
                <div className="px-6 pb-6 relative">
                  <div className="absolute -top-12 left-6">
                    <Avatar className="w-24 h-24 border-4 border-white shadow-md">
                      <AvatarImage src={profile?.photoUrl || undefined} />
                      <AvatarFallback>{user?.username[0]}</AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="pt-14">
                    <h2 className="text-xl font-bold">{profile?.fullName}</h2>
                    <p className="text-gray-500">{profile?.profession || "Member"}</p>
                    <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="block text-gray-400 text-xs">Age</span>
                        <span className="font-medium">{profile?.age}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Location</span>
                        <span className="font-medium">{profile?.city}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Religion</span>
                        <span className="font-medium">{profile?.religion}</span>
                      </div>
                      <div>
                        <span className="block text-gray-400 text-xs">Status</span>
                        <span className="text-green-500 font-medium">Active</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Stats / Activity */}
              <Card className="md:col-span-2 rounded-3xl border-pink-100 shadow-sm p-6">
                <h3 className="font-display text-xl font-bold mb-6">Recent Activity</h3>
                <div className="space-y-6">
                  {/* Empty state placeholder */}
                  <div className="flex items-center gap-4 p-4 rounded-xl bg-white border border-gray-100">
                    <div className="w-10 h-10 rounded-full bg-pink-50 flex items-center justify-center text-primary">
                      <Heart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="font-medium">Profile Completed</p>
                      <p className="text-sm text-gray-500">You're all set to find matches!</p>
                    </div>
                    <span className="ml-auto text-xs text-gray-400">Just now</span>
                  </div>
                </div>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="requests">
            <Card className="rounded-3xl border-pink-100 shadow-sm overflow-hidden">
              <CardHeader className="bg-white border-b border-gray-50">
                <CardTitle>Interest Requests</CardTitle>
              </CardHeader>
              <div className="divide-y divide-gray-50">
                {receivedRequests.length === 0 ? (
                  <div className="p-12 text-center text-gray-500">
                    <Clock className="w-12 h-12 mx-auto text-gray-200 mb-4" />
                    <p>No pending requests at the moment.</p>
                  </div>
                ) : (
                  receivedRequests.map((req) => (
                    <div key={req.interest.id} className="p-6 flex items-center justify-between hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-14 h-14 border-2 border-white shadow-sm">
                          <AvatarImage src={req.profile.photoUrl || undefined} />
                          <AvatarFallback>{req.profile.fullName[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <h4 className="font-bold text-lg">{req.profile.fullName}</h4>
                          <p className="text-sm text-gray-500">{req.profile.age} • {req.profile.city} • {req.profile.profession}</p>
                          <p className="text-xs text-gray-400 mt-1">Sent {format(new Date(req.interest.createdAt!), 'MMM d, yyyy')}</p>
                        </div>
                      </div>
                      <div className="flex gap-3">
                        <Button 
                          onClick={() => handleAction(req.interest.id, 'rejected')}
                          variant="outline" 
                          className="rounded-full border-gray-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200"
                        >
                          <XCircle className="w-4 h-4 mr-2" />
                          Decline
                        </Button>
                        <Button 
                          onClick={() => handleAction(req.interest.id, 'accepted')}
                          className="rounded-full bg-green-500 hover:bg-green-600 text-white shadow-lg shadow-green-500/20"
                        >
                          <CheckCircle className="w-4 h-4 mr-2" />
                          Accept
                        </Button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
