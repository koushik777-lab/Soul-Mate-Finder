import { Navigation } from "@/components/Navigation";
import { useInterests, useUpdateInterest } from "@/hooks/use-interactions";
import { ProfileCard } from "@/components/ProfileCard";
import { Loader2, MessageCircle } from "lucide-react";

export default function Matches() {
    const { data: matches, isLoading } = useInterests('matches');
    const updateInterest = useUpdateInterest();

    return (
        <div className="min-h-screen bg-gray-50">
            <Navigation />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
                <div className="mb-8">
                    <h1 className="text-3xl font-display font-bold text-gray-900">Your Matches</h1>
                    <p className="text-gray-500 mt-1">People you have connected with.</p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-10 h-10 text-primary animate-spin" />
                    </div>
                ) : !matches || matches.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                            <MessageCircle className="w-8 h-8 text-gray-400" />
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">No matches yet</h3>
                        <p className="text-gray-500">Start sending interests to find your soul mate!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {matches.map((item) => (
                            <ProfileCard
                                key={item.interest.id}
                                profile={item.profile}
                                variant="match"
                                onSendInterest={() => { }}
                                onDecline={() => {
                                    // Remove match by rejecting the interest (setting status to 'rejected')
                                    updateInterest.mutate({ id: item.interest.id, status: 'rejected' });
                                }}
                            />
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
