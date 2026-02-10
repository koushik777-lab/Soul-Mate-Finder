import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertProfileSchema, type InsertProfile } from "@shared/schema";
import { useAuth } from "@/hooks/use-auth";
import { useLocation } from "wouter";
import { useCreateProfile } from "@/hooks/use-profiles";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";
import { Loader2 } from "lucide-react";
import { IoMale, IoFemale } from "react-icons/io5";

export default function ProfileWizard() {
    const [step, setStep] = useState(1);
    const { user } = useAuth();
    const [, setLocation] = useLocation();
    const createProfile = useCreateProfile();

    // If we already have user data from registration (e.g. username), we could use it?
    // But here we need profile data.
    // We should fetch if a profile exists partially?
    // For now assume new profile.

    const form = useForm<InsertProfile>({
        resolver: zodResolver(insertProfileSchema),
        defaultValues: {
            fullName: "",
            age: 18,
            gender: "male", // default or fetch from somewhere if passed
            religion: "",
            city: "",
            // ... initialize other fields
            partnerPreferences: {}
        }
    });

    const nextStep = async () => {
        // Validate current step fields before moving?
        // For simplicity, we might validate all at end or use trigger()
        setStep(s => Math.min(s + 1, 10));
        // Trigger animations?
    };

    const prevStep = () => {
        setStep(s => Math.max(s - 1, 1));
    };

    const onSubmit = async (data: InsertProfile) => {
        try {
            await createProfile.mutateAsync(data);
            setLocation("/dashboard");
        } catch (error) {
            console.error(error);
        }
    };

    const progress = (step / 10) * 100;

    return (
        <div className="min-h-screen bg-pink-50 flex items-center justify-center p-4">
            <Card className="w-full max-w-2xl border-none shadow-xl">
                <CardHeader>
                    <CardTitle className="text-3xl font-display text-center text-primary">
                        {step <= 7 ? "Complete Your Profile" : "Partner Preferences"}
                    </CardTitle>
                    <CardDescription className="text-center">
                        Step {step} of 10
                    </CardDescription>
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2.5 mt-4">
                        <motion.div
                            className={`h-2.5 rounded-full ${step > 7 ? 'bg-red-500' : 'bg-pink-500'}`}
                            initial={{ width: 0 }}
                            animate={{ width: `${progress}%` }}
                            transition={{ duration: 0.5 }}
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">

                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={step}
                                    initial={{ opacity: 0, x: 20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    exit={{ opacity: 0, x: -20 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    {/* Steps Logic */}
                                    {/* Step 1: Basic Details */}
                                    {step === 1 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Basic Details</h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormItem>
                                                    <FormLabel>First Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="First Name" className="rounded-xl"
                                                            onChange={(e) => {
                                                                const lastName = form.getValues("fullName").split(" ")[1] || "";
                                                                form.setValue("fullName", `${e.target.value} ${lastName}`);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                                <FormItem>
                                                    <FormLabel>Last Name</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="Last Name" className="rounded-xl"
                                                            onChange={(e) => {
                                                                const firstName = form.getValues("fullName").split(" ")[0] || "";
                                                                form.setValue("fullName", `${firstName} ${e.target.value}`);
                                                            }}
                                                        />
                                                    </FormControl>
                                                </FormItem>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="gender"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Gender</FormLabel>
                                                            <div className="flex gap-4">
                                                                <div className={`flex flex-col items-center p-3 border rounded-xl cursor-pointer ${field.value === 'male' ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'}`} onClick={() => field.onChange('male')}>
                                                                    <IoMale className="w-6 h-6 text-blue-500" />
                                                                    <span className="text-xs mt-1">Male</span>
                                                                </div>
                                                                <div className={`flex flex-col items-center p-3 border rounded-xl cursor-pointer ${field.value === 'female' ? 'bg-pink-50 border-pink-200' : 'hover:bg-gray-50'}`} onClick={() => field.onChange('female')}>
                                                                    <IoFemale className="w-6 h-6 text-pink-500" />
                                                                    <span className="text-xs mt-1">Female</span>
                                                                </div>
                                                            </div>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {/* Looking For - distinct from gender? Usually implied but explicit request */}
                                                {/* We don't have a 'lookingFor' field in schema yet, let's skip or map to partner prefs? */}
                                                {/* User asked for "looking for (male icon or female icon)" in Step 1 */}
                                                {/* I'll add a dummy state for now or map to partnerPreferences.gender? */}
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="dob"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Date of Birth</FormLabel>
                                                            <FormControl>
                                                                <Input type="date" {...field} value={field.value || ''} className="rounded-xl" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
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
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="education"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Education</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="High School">High School</SelectItem>
                                                                    <SelectItem value="Bachelors">Bachelor's</SelectItem>
                                                                    <SelectItem value="Masters">Master's</SelectItem>
                                                                    <SelectItem value="Doctorate">Doctorate</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="country"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Country</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="India">India</SelectItem>
                                                                    <SelectItem value="USA">USA</SelectItem>
                                                                    <SelectItem value="UK">UK</SelectItem>
                                                                    <SelectItem value="Canada">Canada</SelectItem>
                                                                    <SelectItem value="Australia">Australia</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 2: Additional Details */}
                                    {step === 2 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Additional Details</h3>

                                            <FormField
                                                control={form.control}
                                                name="profileCreatedFor"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Profile Created For</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Self">Self</SelectItem>
                                                                <SelectItem value="Son">Son</SelectItem>
                                                                <SelectItem value="Daughter">Daughter</SelectItem>
                                                                <SelectItem value="Brother">Brother</SelectItem>
                                                                <SelectItem value="Sister">Sister</SelectItem>
                                                                <SelectItem value="Friend">Friend</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="maritalStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Marital Status</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Single">Single</SelectItem>
                                                                <SelectItem value="Divorced">Divorced</SelectItem>
                                                                <SelectItem value="Widowed">Widowed</SelectItem>
                                                                <SelectItem value="Awaiting Divorce">Awaiting Divorce</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Step 3: Location & Citizenship */}
                                    {step === 3 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Location & Citizenship</h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="livingInIndiaSince"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Living in India Since</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Year" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    {Array.from({ length: 50 }, (_, i) => new Date().getFullYear() - i).map(year => (
                                                                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
                                                                    ))}
                                                                    <SelectItem value="Birth">Since Birth</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="placeOfBirth"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Place of Birth</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || "India"}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="India">India</SelectItem>
                                                                    <SelectItem value="USA">USA</SelectItem>
                                                                    <SelectItem value="UK">UK</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="nationality"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Nationality</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || "India"}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="India">India</SelectItem>
                                                                    <SelectItem value="Other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="visaStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Visa Status</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Citizenship">Citizenship</SelectItem>
                                                                    <SelectItem value="Permanent Resident">Legal Permanent Residence</SelectItem>
                                                                    <SelectItem value="Work Visa">Work Visa</SelectItem>
                                                                    <SelectItem value="Student Visa">Student Visa</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* Step 4: Professional & Background Details */}
                                    {step === 4 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Professional & Background</h3>

                                            <FormField
                                                control={form.control}
                                                name="ethnicity"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Ethnicity</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Asian">Asian</SelectItem>
                                                                <SelectItem value="South Asian">South Asian</SelectItem>
                                                                <SelectItem value="Caucasian">Caucasian</SelectItem>
                                                                <SelectItem value="Hispanic">Hispanic</SelectItem>
                                                                <SelectItem value="African">African</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="profession"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Profession</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Software Engineer">Software Engineer</SelectItem>
                                                                <SelectItem value="Doctor">Doctor</SelectItem>
                                                                <SelectItem value="Engineer">Engineer</SelectItem>
                                                                <SelectItem value="Teacher">Teacher</SelectItem>
                                                                <SelectItem value="Business">Business</SelectItem>
                                                                <SelectItem value="Student">Student</SelectItem>
                                                                <SelectItem value="Other">Other</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />

                                            <FormField
                                                control={form.control}
                                                name="income"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Income</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="No Income">No Income</SelectItem>
                                                                <SelectItem value="Below 5 Lakhs">Below 5 Lakhs</SelectItem>
                                                                <SelectItem value="5 - 10 Lakhs">5 - 10 Lakhs</SelectItem>
                                                                <SelectItem value="10 - 20 Lakhs">10 - 20 Lakhs</SelectItem>
                                                                <SelectItem value="20 - 50 Lakhs">20 - 50 Lakhs</SelectItem>
                                                                <SelectItem value="Above 50 Lakhs">Above 50 Lakhs</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Step 5: Residence & Family Details */}
                                    {step === 5 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Residence & Family</h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="state"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>State</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="West Bengal">West Bengal</SelectItem>
                                                                    <SelectItem value="Maharashtra">Maharashtra</SelectItem>
                                                                    <SelectItem value="Delhi">Delhi</SelectItem>
                                                                    <SelectItem value="Karnataka">Karnataka</SelectItem>
                                                                    <SelectItem value="Tamil Nadu">Tamil Nadu</SelectItem>
                                                                    <SelectItem value="Other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="city"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>City</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} placeholder="Enter City" className="rounded-xl" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="livingWithFamily"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Living With Family</FormLabel>
                                                        <Select
                                                            onValueChange={(val) => field.onChange(val === 'Yes')}
                                                            defaultValue={field.value !== undefined ? (field.value ? 'Yes' : 'No') : undefined}
                                                        >
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Yes">Yes</SelectItem>
                                                                <SelectItem value="No">No</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Step 6: Physical & Family Background */}
                                    {step === 6 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Physical & Family Background</h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="height"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Height</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="5'0">5'0"</SelectItem>
                                                                    <SelectItem value="5'5">5'5"</SelectItem>
                                                                    <SelectItem value="5'8">5'8"</SelectItem>
                                                                    <SelectItem value="6'0">6'0"</SelectItem>
                                                                    <SelectItem value="Other">Other</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="weight"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Weight</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="50-60kg">50-60kg</SelectItem>
                                                                    <SelectItem value="60-70kg">60-70kg</SelectItem>
                                                                    <SelectItem value="70-80kg">70-80kg</SelectItem>
                                                                    <SelectItem value="80+kg">80+kg</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="bodyType"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Body Type</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Slim">Slim</SelectItem>
                                                                    <SelectItem value="Athletic">Athletic</SelectItem>
                                                                    <SelectItem value="Average">Average</SelectItem>
                                                                    <SelectItem value="Heavy">Heavy</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="complexion"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Complexion</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Fair">Fair</SelectItem>
                                                                    <SelectItem value="Wheatish">Wheatish</SelectItem>
                                                                    <SelectItem value="Dark">Dark</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="familyStatus"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Family Status</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Rich / Affluent">Rich / Affluent</SelectItem>
                                                                <SelectItem value="Upper Middle Class">Upper Middle Class</SelectItem>
                                                                <SelectItem value="Middle Class">Middle Class</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Step 7: Lifestyle & Habits */}
                                    {step === 7 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Lifestyle & Habits</h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="diet"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Diet</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Vegetarian">Vegetarian</SelectItem>
                                                                    <SelectItem value="Non-Vegetarian">Non-Vegetarian</SelectItem>
                                                                    <SelectItem value="Eggetarian">Eggetarian</SelectItem>
                                                                    <SelectItem value="Vegan">Vegan</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="drink"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Drink</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Select" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="No">No</SelectItem>
                                                                    <SelectItem value="Occasionally">Occasionally</SelectItem>
                                                                    <SelectItem value="Yes">Yes</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <FormField
                                                control={form.control}
                                                name="smoke"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Smoke</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Select" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="No">No</SelectItem>
                                                                <SelectItem value="Occasionally">Occasionally</SelectItem>
                                                                <SelectItem value="Yes">Yes</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Step 8: Partner Preferences */}
                                    {step === 8 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Partner Preferences</h3>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="partnerPreferences.ageMin"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Min Age</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="rounded-xl" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="partnerPreferences.ageMax"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Max Age</FormLabel>
                                                            <FormControl>
                                                                <Input type="number" {...field} onChange={e => field.onChange(parseInt(e.target.value))} className="rounded-xl" />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <FormField
                                                    control={form.control}
                                                    name="partnerPreferences.maritalStatus"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Marital Status</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Any" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Any">Any</SelectItem>
                                                                    <SelectItem value="Single">Single</SelectItem>
                                                                    <SelectItem value="Divorced">Divorced</SelectItem>
                                                                    <SelectItem value="Widowed">Widowed</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="partnerPreferences.religion"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Religion</FormLabel>
                                                            <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                                <FormControl>
                                                                    <SelectTrigger className="rounded-xl">
                                                                        <SelectValue placeholder="Any" />
                                                                    </SelectTrigger>
                                                                </FormControl>
                                                                <SelectContent>
                                                                    <SelectItem value="Any">Any</SelectItem>
                                                                    <SelectItem value="Hindu">Hindu</SelectItem>
                                                                    <SelectItem value="Muslim">Muslim</SelectItem>
                                                                    <SelectItem value="Christian">Christian</SelectItem>
                                                                    <SelectItem value="Sikh">Sikh</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                            </div>

                                            {/* Simplified preference inputs for now */}
                                            <FormField
                                                control={form.control}
                                                name="partnerPreferences.education"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Education</FormLabel>
                                                        <Select onValueChange={field.onChange} defaultValue={field.value || undefined}>
                                                            <FormControl>
                                                                <SelectTrigger className="rounded-xl">
                                                                    <SelectValue placeholder="Any" />
                                                                </SelectTrigger>
                                                            </FormControl>
                                                            <SelectContent>
                                                                <SelectItem value="Any">Any</SelectItem>
                                                                <SelectItem value="Bachelors">Bachelor's</SelectItem>
                                                                <SelectItem value="Masters">Master's</SelectItem>
                                                                <SelectItem value="Doctorate">Doctorate</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Step 9: Self Introduction */}
                                    {step === 9 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">About Yourself</h3>
                                            <FormField
                                                control={form.control}
                                                name="bio"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Bio / Self Summary</FormLabel>
                                                        <FormControl>
                                                            <Textarea {...field} placeholder="Tell us about your hobbies, interests, and what you are looking for..." className="rounded-xl h-32 resize-none" />
                                                        </FormControl>
                                                        <FormMessage />
                                                    </FormItem>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {/* Step 10: Upload Photos */}
                                    {step === 10 && (
                                        <div className="space-y-4">
                                            <h3 className="text-xl font-semibold mb-4 text-pink-700">Upload Photos</h3>
                                            <FormField
                                                control={form.control}
                                                name="photoUrl"
                                                render={({ field }) => (
                                                    <FormItem>
                                                        <FormLabel>Profile Photo URL</FormLabel>
                                                        <FormControl>
                                                            <Input {...field} placeholder="https://..." className="rounded-xl" />
                                                        </FormControl>
                                                        <FormMessage />
                                                        <p className="text-xs text-gray-500">
                                                            Currently we only support image URLs. File upload coming soon!
                                                        </p>
                                                    </FormItem>
                                                )}
                                            />
                                            {/* Preview if URL is valid */}
                                            {form.watch("photoUrl") && (
                                                <div className="mt-4">
                                                    <p className="text-sm font-medium mb-2">Preview:</p>
                                                    <img src={form.watch("photoUrl")} alt="Profile Preview" className="w-32 h-32 rounded-full object-cover border-4 border-pink-100 mx-auto"
                                                        onError={(e) => { (e.target as HTMLImageElement).src = 'https://placehold.co/150?text=Invalid+URL'; }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    )}

                                </motion.div>
                            </AnimatePresence>

                            <div className="flex justify-between pt-6">
                                {step > 1 && (
                                    <Button type="button" variant="outline" onClick={prevStep}>
                                        Previous
                                    </Button>
                                )}

                                {step < 10 ? (
                                    <Button type="button" onClick={nextStep} className="ml-auto btn-romantic">
                                        Next
                                    </Button>
                                ) : (
                                    <Button type="submit" className="ml-auto btn-romantic" disabled={createProfile.isPending}>
                                        {createProfile.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                        Submit Profile
                                    </Button>
                                )}
                            </div>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
