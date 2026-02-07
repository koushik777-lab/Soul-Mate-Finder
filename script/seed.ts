import { db } from "../server/db";
import { users, profiles } from "../shared/schema";
import { scrypt, randomBytes } from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

async function main() {
  console.log("Seeding database...");

  const password = await hashPassword("password123");

  // Create Admin
  const [admin] = await db.insert(users).values({
    username: "admin",
    password,
    isAdmin: true,
  }).returning();

  console.log("Created admin user");

  // Create Users & Profiles
  const sampleProfiles = [
    {
      username: "rohit_verma",
      fullName: "Rohit Verma",
      age: 28,
      gender: "Male",
      religion: "Hindu",
      caste: "Brahmin",
      city: "Mumbai",
      profession: "Software Engineer",
      bio: "I am a simple, down-to-earth person looking for a partner who values family and career.",
      photoUrl: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop",
      isVerified: true,
    },
    {
      username: "priya_sharma",
      fullName: "Priya Sharma",
      age: 26,
      gender: "Female",
      religion: "Hindu",
      caste: "Khatri",
      city: "Delhi",
      profession: "Doctor",
      bio: "Passionate about my work and love traveling. Looking for someone with a good sense of humor.",
      photoUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&h=400&fit=crop",
      isVerified: true,
    },
    {
      username: "arjun_singh",
      fullName: "Arjun Singh",
      age: 30,
      gender: "Male",
      religion: "Sikh",
      caste: "Jat",
      city: "Chandigarh",
      profession: "Businessman",
      bio: "Ambitious and family-oriented. I enjoy sports and outdoor activities.",
      photoUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop",
      isVerified: true,
    },
    {
      username: "aisha_khan",
      fullName: "Aisha Khan",
      age: 25,
      gender: "Female",
      religion: "Muslim",
      caste: "Sunni",
      city: "Bangalore",
      profession: "Architect",
      bio: "Creative and artistic. I love reading and painting in my free time.",
      photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&h=400&fit=crop",
      isVerified: false,
    },
    {
       username: "raj_patel",
       fullName: "Raj Patel",
       age: 29,
       gender: "Male",
       religion: "Hindu",
       caste: "Patel",
       city: "Ahmedabad",
       profession: "Chartered Accountant",
       bio: "Focused and disciplined. I value honesty and integrity.",
       photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop",
       isVerified: true,
    }
  ];

  for (const p of sampleProfiles) {
    const [user] = await db.insert(users).values({
      username: p.username,
      password,
    }).returning();

    await db.insert(profiles).values({
      userId: user.id,
      fullName: p.fullName,
      age: p.age,
      gender: p.gender,
      religion: p.religion,
      caste: p.caste,
      city: p.city,
      profession: p.profession,
      bio: p.bio,
      photoUrl: p.photoUrl,
      isVerified: p.isVerified,
    });
    console.log(`Created profile for ${p.fullName}`);
  }

  console.log("Seeding complete!");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seeding failed", err);
  process.exit(1);
});
