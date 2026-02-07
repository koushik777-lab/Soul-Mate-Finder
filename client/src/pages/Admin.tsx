import { Navigation } from "@/components/Navigation";
import { useAuth } from "@/hooks/use-auth";
import { useQuery } from "@tanstack/react-query";
import { api } from "@shared/routes";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";

export default function Admin() {
  const { user } = useAuth();
  const [, setLocation] = useLocation();

  if (user && !user.isAdmin) {
    setLocation("/dashboard");
    return null;
  }

  const { data: users, isLoading } = useQuery({
    queryKey: [api.admin.listUsers.path],
    queryFn: async () => {
      const res = await fetch(api.admin.listUsers.path);
      if (!res.ok) throw new Error("Failed");
      return api.admin.listUsers.responses[200].parse(await res.json());
    }
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <h1 className="text-3xl font-display font-bold mb-8">Admin Dashboard</h1>
        
        <Card className="rounded-2xl border-pink-100 shadow-sm">
          <CardHeader>
            <CardTitle>Registered Users</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin" /></div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Username</TableHead>
                    <TableHead>Full Name</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Joined</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users?.map((u: any) => (
                    <TableRow key={u.user.id}>
                      <TableCell className="font-medium">{u.user.username}</TableCell>
                      <TableCell>{u.profile?.fullName || "No Profile"}</TableCell>
                      <TableCell>
                        <Badge variant={u.profile?.isVerified ? "default" : "secondary"}>
                          {u.profile?.isVerified ? "Verified" : "Unverified"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {u.profile?.createdAt ? format(new Date(u.profile.createdAt), 'MMM d, yyyy') : '-'}
                      </TableCell>
                      <TableCell>
                        <Button variant="ghost" size="sm">Edit</Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

import { format } from "date-fns";
