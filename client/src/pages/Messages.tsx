import { Navigation } from "@/components/Navigation";
import { useConversations, useMessages, useSendMessage } from "@/hooks/use-interactions";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Loader2, Send } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export default function Messages() {
  const { user } = useAuth();
  const { data: conversations, isLoading: loadingConvos } = useConversations();
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  useEffect(() => {
    if (conversations && conversations.length > 0 && !selectedUserId) {
      setSelectedUserId(conversations[0].userId);
    }
  }, [conversations, selectedUserId]);

  const selectedProfile = conversations?.find(p => p.userId === selectedUserId);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navigation />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-24 h-[calc(100vh-64px)]">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-full">
          {/* Conversation List */}
          <Card className="bg-white/80 backdrop-blur-md rounded-2xl border border-pink-100 flex flex-col overflow-hidden h-full">
            <div className="p-4 border-b border-pink-50">
              <h2 className="font-display text-xl font-bold">Messages</h2>
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-2">
              {loadingConvos ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="w-6 h-6 animate-spin text-primary" />
                </div>
              ) : conversations?.length === 0 ? (
                <div className="text-center p-8 text-gray-500">
                  No conversations yet. Send an interest to start matching!
                </div>
              ) : (
                conversations?.map((profile) => (
                  <button
                    key={profile.userId}
                    onClick={() => setSelectedUserId(profile.userId)}
                    className={cn(
                      "w-full flex items-center gap-3 p-3 rounded-xl transition-all text-left",
                      selectedUserId === profile.userId 
                        ? "bg-pink-50 border border-pink-100 shadow-sm" 
                        : "hover:bg-gray-50 border border-transparent"
                    )}
                  >
                    <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                      <AvatarImage src={profile.photoUrl || undefined} />
                      <AvatarFallback>{profile.fullName[0]}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 overflow-hidden">
                      <h3 className="font-semibold text-gray-900 truncate">{profile.fullName}</h3>
                      <p className="text-sm text-gray-500 truncate">Click to chat</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </Card>

          {/* Chat Window */}
          <div className="md:col-span-2 h-full">
            {selectedUserId && selectedProfile ? (
              <ChatWindow 
                recipientId={selectedUserId} 
                recipientName={selectedProfile.fullName}
                recipientPhoto={selectedProfile.photoUrl || undefined}
                currentUserId={user!.id}
              />
            ) : (
              <Card className="h-full flex items-center justify-center bg-white/50 border-dashed border-2 border-gray-200 rounded-2xl">
                <div className="text-center text-gray-400">
                  <p>Select a conversation to start chatting</p>
                </div>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function ChatWindow({ 
  recipientId, 
  recipientName, 
  recipientPhoto,
  currentUserId 
}: { 
  recipientId: number;
  recipientName: string;
  recipientPhoto?: string;
  currentUserId: number;
}) {
  const { data: messages, isLoading } = useMessages(recipientId);
  const sendMessage = useSendMessage();
  const [inputText, setInputText] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!inputText.trim()) return;
    sendMessage.mutate({
      receiverId: recipientId,
      content: inputText
    });
    setInputText("");
  };

  return (
    <Card className="h-full flex flex-col bg-white rounded-2xl border border-pink-100 shadow-xl shadow-pink-500/5 overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-pink-50 flex items-center gap-3 bg-white/80 backdrop-blur-md z-10">
        <Avatar className="h-10 w-10">
          <AvatarImage src={recipientPhoto} />
          <AvatarFallback>{recipientName[0]}</AvatarFallback>
        </Avatar>
        <div>
          <h3 className="font-bold text-gray-900">{recipientName}</h3>
          <p className="text-xs text-green-500 font-medium">Online</p>
        </div>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50">
        {isLoading ? (
          <div className="flex justify-center p-4">
            <Loader2 className="w-6 h-6 animate-spin text-primary" />
          </div>
        ) : (
          messages?.map((msg) => {
            const isMe = msg.senderId === currentUserId;
            return (
              <div key={msg.id} className={cn("flex", isMe ? "justify-end" : "justify-start")}>
                <div 
                  className={cn(
                    "max-w-[75%] px-4 py-2 rounded-2xl shadow-sm text-sm",
                    isMe 
                      ? "bg-primary text-white rounded-tr-none" 
                      : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                  )}
                >
                  <p>{msg.content}</p>
                  <p className={cn("text-[10px] mt-1 text-right opacity-70", isMe ? "text-white" : "text-gray-400")}>
                    {format(new Date(msg.createdAt!), 'HH:mm')}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input */}
      <div className="p-4 bg-white border-t border-pink-50">
        <form 
          onSubmit={(e) => { e.preventDefault(); handleSend(); }}
          className="flex gap-2"
        >
          <Input
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="rounded-full bg-gray-50 border-gray-200 focus:ring-primary/20"
          />
          <Button 
            type="submit" 
            size="icon" 
            className="rounded-full bg-primary hover:bg-pink-600 shadow-md shadow-pink-500/20"
            disabled={!inputText.trim() || sendMessage.isPending}
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </Card>
  );
}
