import { Navigation } from "@/components/Navigation";
import { useInterests, useUpdateInterest } from "@/hooks/use-interactions";
import { ProfileCard } from "@/components/ProfileCard";
import { Loader2, Heart, Clock } from "lucide-react";

export default function Requests() {
    const { data: interests, isLoading } = useInterests('received');
    const updateInterest = useUpdateInterest();

    const pendingRequests = interests?.filter(i => i.interest.status === 'pending') || [];

    const handleAccept = (profileId: string) => {
        // We have the profileId, but we need the interestId.
        // Let's find the interest associated with this profile
        const interest = pendingRequests.find(i => i.profile.id === profileId)?.interest;
        if (interest) {
            updateInterest.mutate({ id: interest.id, status: 'accepted' });
        }
    };

    const handleDecline = (profileId: string) => {
        const interest = pendingRequests.find(i => i.profile.id === profileId)?.interest;
        if (interest) {
            updateInterest.mutate({ id: interest.id, status: 'rejected' });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-gray-900">Interest Requests</h1>
                    <p className="text-gray-500 mt-1">
                        {pendingRequests.length > 0
                            ? `You have ${pendingRequests.length} pending requests waiting for your response.`
                            : "No pending requests at the moment."}
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : pendingRequests.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Clock className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">All caught up!</h3>
                        <p className="text-gray-500">Check back later for new interests.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {pendingRequests.map((item) => (
                            <ProfileCard
                                key={item.interest.id}
                                profile={item.profile}
                                variant="request"
                                onAccept={handleAccept}
                                onDecline={handleDecline}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
