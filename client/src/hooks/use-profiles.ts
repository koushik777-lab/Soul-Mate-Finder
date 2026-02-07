import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl, type InsertProfile } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

type FilterParams = z.infer<typeof api.profiles.list.input>;

export function useProfiles(filters?: FilterParams) {
  return useQuery({
    queryKey: [api.profiles.list.path, filters],
    queryFn: async () => {
      const url = new URL(api.profiles.list.path, window.location.origin);
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) url.searchParams.append(key, String(value));
        });
      }
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch profiles");
      return api.profiles.list.responses[200].parse(await res.json());
    },
  });
}

export function useProfile(id: number) {
  return useQuery({
    queryKey: [api.profiles.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.profiles.get.path, { id });
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profiles.get.responses[200].parse(await res.json());
    },
    enabled: !!id,
  });
}

export function useMyProfile() {
  return useQuery({
    queryKey: [api.profiles.mine.path],
    queryFn: async () => {
      const res = await fetch(api.profiles.mine.path);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch profile");
      return api.profiles.mine.responses[200].parse(await res.json());
    },
    retry: false,
  });
}

export function useCreateProfile() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (data: InsertProfile) => {
      // Ensure numeric fields are numbers
      const payload = {
        ...data,
        age: Number(data.age),
      };
      
      const res = await fetch(api.profiles.create.path, {
        method: api.profiles.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.message || "Failed to create profile");
      }
      return api.profiles.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.profiles.mine.path] });
      toast({ title: "Profile Created", description: "Your profile is now visible." });
    },
    onError: (error: Error) => {
      toast({ variant: "destructive", title: "Error", description: error.message });
    },
  });
}
