import { z } from "zod";

export const insertUserSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export const insertPartnerPreferencesSchema = z.object({
  maritalStatus: z.string().optional(),
  religion: z.string().optional(),
  education: z.string().optional(),
  countries: z.array(z.string()).optional(),
  ageMin: z.number().min(18).optional(),
  ageMax: z.number().min(18).optional(),
  drinking: z.string().optional(),
  smoking: z.string().optional(),
  residency: z.string().optional(),
  diet: z.string().optional(),
});

export const insertProfileSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  age: z.number().min(18, "Must be at least 18"),
  gender: z.string().min(1, "Gender is required"),
  religion: z.string().min(1, "Religion is required"),
  caste: z.string().optional(),
  city: z.string().min(1, "City is required"),
  profession: z.string().optional(),
  bio: z.string().optional(),
  photoUrl: z.string().optional(),

  // New Fields
  dob: z.string().optional(), // ISO date string
  education: z.string().optional(),
  country: z.string().optional(), // Place of birth / Current Country
  profileCreatedFor: z.string().optional(),
  maritalStatus: z.string().optional(),
  livingInIndiaSince: z.string().optional(),
  placeOfBirth: z.string().optional(),
  nationality: z.string().optional(),
  visaStatus: z.string().optional(),
  ethnicity: z.string().optional(),
  income: z.string().optional(),
  state: z.string().optional(),
  livingWithFamily: z.boolean().optional(),
  height: z.string().optional(),
  weight: z.string().optional(),
  bodyType: z.string().optional(),
  familyStatus: z.string().optional(),
  complexion: z.string().optional(),
  diet: z.string().optional(),
  drink: z.string().optional(),
  smoke: z.string().optional(),

  partnerPreferences: insertPartnerPreferencesSchema.optional(),
});

export const insertMessageSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
  receiverId: z.string(),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type InsertPartnerPreferences = z.infer<typeof insertPartnerPreferencesSchema>;
export type InsertMessage = z.infer<typeof insertMessageSchema>;

export type User = {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
};

export type PartnerPreferences = {
  maritalStatus?: string;
  religion?: string;
  education?: string;
  countries?: string[];
  ageMin?: number;
  ageMax?: number;
  drinking?: string;
  smoking?: string;
  residency?: string;
  diet?: string;
};

export type Profile = {
  id: string;
  userId: string;
  fullName: string;
  age: number;
  gender: string;
  religion: string;
  caste?: string | null;
  city: string;
  profession?: string | null;
  bio?: string | null;
  photoUrl?: string | null;
  isVerified: boolean;
  createdAt: Date;

  // New Fields
  dob?: string | null;
  education?: string | null;
  country?: string | null;
  profileCreatedFor?: string | null;
  maritalStatus?: string | null;
  livingInIndiaSince?: string | null;
  placeOfBirth?: string | null;
  nationality?: string | null;
  visaStatus?: string | null;
  ethnicity?: string | null;
  income?: string | null;
  state?: string | null;
  livingWithFamily?: boolean | null;
  height?: string | null;
  weight?: string | null;
  bodyType?: string | null;
  familyStatus?: string | null;
  complexion?: string | null;
  diet?: string | null;
  drink?: string | null;
  smoke?: string | null;

  partnerPreferences?: PartnerPreferences | null;
};

export type Interest = {
  id: string;
  senderId: string;
  receiverId: string;
  status: string; // "pending" | "accepted" | "rejected"
  createdAt: Date;
};

export type Message = {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  createdAt: Date;
};
