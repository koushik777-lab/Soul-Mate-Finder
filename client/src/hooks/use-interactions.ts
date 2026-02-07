import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertMessage } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

// === INTERESTS ===

export function useInterests() {
  return useQuery({
    queryKey: [api.interests.list.path],
    queryFn: async () => {
      const res = await fetch(api.interests.list.path);
      if (!res.ok) throw new Error("Failed to fetch interests");
      return api.interests.list.responses[200].parse(await res.json());
    },
  });
}

export function useSendInterest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (receiverId: number) => {
      const res = await fetch(api.interests.send.path, {
        method: api.interests.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ receiverId }),
      });
      if (!res.ok) throw new Error("Failed to send interest");
      return api.interests.send.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.interests.list.path] });
      toast({ title: "Interest Sent!", description: "Fingers crossed!" });
    },
    onError: (err: Error) => {
      toast({ variant: "destructive", title: "Error", description: err.message });
    },
  });
}

export function useUpdateInterest() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, status }: { id: number; status: 'accepted' | 'rejected' }) => {
      const url = buildUrl(api.interests.update.path, { id });
      const res = await fetch(url, {
        method: api.interests.update.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Failed to update interest");
      return api.interests.update.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.interests.list.path] });
      toast({ title: "Updated", description: "Interest status updated." });
    },
  });
}

// === MESSAGES ===

export function useConversations() {
  return useQuery({
    queryKey: [api.messages.history.path],
    queryFn: async () => {
      const res = await fetch(api.messages.history.path);
      if (!res.ok) throw new Error("Failed to fetch conversations");
      return api.messages.history.responses[200].parse(await res.json());
    },
  });
}

export function useMessages(userId: number | null) {
  return useQuery({
    queryKey: [api.messages.list.path, userId],
    enabled: !!userId,
    refetchInterval: 3000, // Simple polling for chat
    queryFn: async () => {
      if (!userId) return [];
      const url = buildUrl(api.messages.list.path, { userId });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: InsertMessage) => {
      const res = await fetch(api.messages.send.path, {
        method: api.messages.send.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to send message");
      return api.messages.send.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ 
        queryKey: [api.messages.list.path, variables.receiverId] 
      });
    },
  });
}
