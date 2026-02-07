import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertUserSchema, insertProfileSchema } from "@shared/schema";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useCreateProfile } from "@/hooks/use-profiles";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function Auth() {
  const [activeTab, setActiveTab] = useState("login");
  const { login, register, isLoggingIn, isRegistering, user } = useAuth();
  const createProfile = useCreateProfile();
  const [, setLocation] = useLocation();

  // If already logged in, redirect
  if (user) {
    if (!user.isAdmin) {
       // Check if profile exists, if not show profile creation form
       // For simplicity, we'll assume the user is redirected to dashboard
       setLocation("/dashboard"); 
    }
    return null;
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left Panel - Image */}
      <div className="hidden lg:block relative h-full">
        <div className="absolute inset-0 bg-primary/20 mix-blend-multiply z-10" />
        {/* Elegant flower background */}
        <img 
          src="https://pixabay.com/get/gcbe4053a0a3ff56b0b72a389a985379dead521b71798162981a12efc2917a2378c064e4f9783aba42ecf9a03c7554519e98b1b9e618c66030e49dcf682e3d99c_1280.png" 
          className="absolute inset-0 w-full h-full object-cover" 
          alt="Flowers" 
        />
        <div className="absolute inset-0 flex items-center justify-center z-20 text-white p-12">
          <div className="max-w-md">
            <h1 className="font-display text-6xl font-bold mb-6 drop-shadow-lg">Begin Your Story</h1>
            <p className="text-xl font-light drop-shadow-md">Join the most trusted platform for finding meaningful connections.</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Forms */}
      <div className="flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <div className="text-center mb-8 lg:hidden">
            <h1 className="font-display text-4xl font-bold text-primary">SoulMate</h1>
            <p className="text-gray-500">Find your perfect match</p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8 h-12 rounded-full bg-pink-50 p-1">
              <TabsTrigger value="login" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary font-medium transition-all">
                Login
              </TabsTrigger>
              <TabsTrigger value="register" className="rounded-full data-[state=active]:bg-white data-[state=active]:text-primary font-medium transition-all">
                Register
              </TabsTrigger>
            </TabsList>

            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <TabsContent value="login">
                <LoginForm onLogin={(data) => login(data)} isLoading={isLoggingIn} />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm 
                  onRegister={async (data) => {
                    await register(data);
                    // After register, user is logged in, show profile creation wizard
                    // But for now, we just let the auth hook handle state update
                  }} 
                  isLoading={isRegistering} 
                />
              </TabsContent>
            </motion.div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}

function LoginForm({ onLogin, isLoading }: { onLogin: (data: any) => Promise<void>, isLoading: boolean }) {
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "" }
  });

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-display">Welcome Back</CardTitle>
        <CardDescription>Enter your credentials to access your account</CardDescription>
      </CardHeader>
      <CardContent className="px-0">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onLogin)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full h-12 rounded-xl btn-romantic text-lg" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

function RegisterForm({ onRegister, isLoading }: { onRegister: (data: any) => Promise<void>, isLoading: boolean }) {
  const [step, setStep] = useState(1);
  const [creds, setCreds] = useState<any>(null);
  const { user } = useAuth(); // Will be set after step 1
  const createProfile = useCreateProfile();
  const [, setLocation] = useLocation();

  const userForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", password: "" }
  });

  const profileForm = useForm({
    resolver: zodResolver(insertProfileSchema),
    defaultValues: {
      fullName: "",
      age: 25,
      gender: "female",
      religion: "Hindu",
      city: "",
      bio: "",
      photoUrl: "",
      caste: "",
      profession: ""
    }
  });

  const handleUserSubmit = async (data: any) => {
    try {
      await onRegister(data);
      setCreds(data);
      setStep(2);
    } catch (e) {
      console.error(e);
    }
  };

  const handleProfileSubmit = async (data: any) => {
    try {
      await createProfile.mutateAsync(data);
      setLocation("/dashboard");
    } catch (e) {
      console.error(e);
    }
  };

  if (step === 1) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader className="px-0">
          <CardTitle className="text-2xl font-display">Create Account</CardTitle>
          <CardDescription>Join our community today</CardDescription>
        </CardHeader>
        <CardContent className="px-0">
          <Form {...userForm}>
            <form onSubmit={userForm.handleSubmit(handleUserSubmit)} className="space-y-4">
              <FormField
                control={userForm.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Username</FormLabel>
                    <FormControl>
                      <Input {...field} className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Choose Password</FormLabel>
                    <FormControl>
                      <Input type="password" {...field} className="rounded-xl h-12 bg-gray-50 border-gray-200 focus:border-primary focus:ring-primary/20" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full h-12 rounded-xl btn-romantic text-lg" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Next Step
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="px-0">
        <CardTitle className="text-2xl font-display">Complete Profile</CardTitle>
        <CardDescription>Tell us a bit about yourself</CardDescription>
      </CardHeader>
      <CardContent className="px-0 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
        <Form {...profileForm}>
          <form onSubmit={profileForm.handleSubmit(handleProfileSubmit)} className="space-y-4">
            <FormField
              control={profileForm.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={profileForm.control}
                name="age"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Age</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="rounded-xl" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={profileForm.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Gender</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger className="rounded-xl">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={profileForm.control}
              name="religion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Religion</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger className="rounded-xl">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Hindu">Hindu</SelectItem>
                      <SelectItem value="Muslim">Muslim</SelectItem>
                      <SelectItem value="Christian">Christian</SelectItem>
                      <SelectItem value="Sikh">Sikh</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input {...field} className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="bio"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Bio (Short description)</FormLabel>
                  <FormControl>
                    <Textarea {...field} className="rounded-xl resize-none" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={profileForm.control}
              name="photoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Photo URL</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="https://..." className="rounded-xl" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full h-12 rounded-xl btn-romantic" disabled={createProfile.isPending}>
              {createProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Complete Profile
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
