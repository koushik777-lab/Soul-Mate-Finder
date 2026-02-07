import { 
  users, profiles, interests, messages,
  type User, type InsertUser, type Profile, type Interest, type Message 
} from "@shared/schema";
import { db } from "./db";
import { eq, ne, and, or, desc, gte, lte, sql } from "drizzle-orm";

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>; // For admin

  // Profiles
  createProfile(profile: any): Promise<Profile>;
  getProfile(id: number): Promise<Profile | undefined>;
  getProfileByUserId(userId: number): Promise<Profile | undefined>;
  listProfiles(filters: any): Promise<Profile[]>;
  updateProfile(id: number, profile: Partial<Profile>): Promise<Profile>;

  // Interests
  createInterest(senderId: number, receiverId: number): Promise<Interest>;
  getInterests(userId: number, type: 'sent' | 'received'): Promise<{interest: Interest, profile: Profile}[]>;
  updateInterestStatus(id: number, status: string): Promise<Interest | undefined>;
  getInterestById(id: number): Promise<Interest | undefined>;

  // Messages
  createMessage(senderId: number, receiverId: number, content: string): Promise<Message>;
  getMessages(userId1: number, userId2: number): Promise<Message[]>;
  getConversations(userId: number): Promise<Profile[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users);
  }

  // Profiles
  async createProfile(profile: any): Promise<Profile> {
    const [newProfile] = await db.insert(profiles).values(profile).returning();
    return newProfile;
  }

  async getProfile(id: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.id, id));
    return profile;
  }

  async getProfileByUserId(userId: number): Promise<Profile | undefined> {
    const [profile] = await db.select().from(profiles).where(eq(profiles.userId, userId));
    return profile;
  }

  async listProfiles(filters: any = {}): Promise<Profile[]> {
    const conditions = [];
    if (filters.gender) conditions.push(eq(profiles.gender, filters.gender));
    if (filters.religion) conditions.push(eq(profiles.religion, filters.religion));
    if (filters.city) conditions.push(eq(profiles.city, filters.city));
    if (filters.ageMin) conditions.push(gte(profiles.age, filters.ageMin));
    if (filters.ageMax) conditions.push(lte(profiles.age, filters.ageMax));
    
    // Exclude current user if passed in filters context? 
    // Usually logic handles this, but let's keep it simple for now
    
    if (conditions.length > 0) {
      return await db.select().from(profiles).where(and(...conditions));
    }
    return await db.select().from(profiles);
  }

  async updateProfile(id: number, update: Partial<Profile>): Promise<Profile> {
    const [profile] = await db.update(profiles).set(update).where(eq(profiles.id, id)).returning();
    return profile;
  }

  // Interests
  async createInterest(senderId: number, receiverId: number): Promise<Interest> {
    const [interest] = await db.insert(interests).values({ senderId, receiverId }).returning();
    return interest;
  }

  async getInterests(userId: number, type: 'sent' | 'received'): Promise<{interest: Interest, profile: Profile}[]> {
    const isSent = type === 'sent';
    const joinTable = isSent ? interests.receiverId : interests.senderId;
    
    const results = await db.select({
      interest: interests,
      profile: profiles,
    })
    .from(interests)
    .where(eq(isSent ? interests.senderId : interests.receiverId, userId))
    .innerJoin(profiles, eq(profiles.userId, joinTable));

    return results;
  }

  async updateInterestStatus(id: number, status: string): Promise<Interest | undefined> {
    const [interest] = await db.update(interests).set({ status }).where(eq(interests.id, id)).returning();
    return interest;
  }

  async getInterestById(id: number): Promise<Interest | undefined> {
    const [interest] = await db.select().from(interests).where(eq(interests.id, id));
    return interest;
  }

  // Messages
  async createMessage(senderId: number, receiverId: number, content: string): Promise<Message> {
    const [message] = await db.insert(messages).values({ senderId, receiverId, content }).returning();
    return message;
  }

  async getMessages(userId1: number, userId2: number): Promise<Message[]> {
    return await db.select().from(messages)
      .where(or(
        and(eq(messages.senderId, userId1), eq(messages.receiverId, userId2)),
        and(eq(messages.senderId, userId2), eq(messages.receiverId, userId1))
      ))
      .orderBy(messages.createdAt);
  }

  async getConversations(userId: number): Promise<Profile[]> {
    // Find all unique userIds communicated with
    const sent = await db.selectDistinct({ id: messages.receiverId }).from(messages).where(eq(messages.senderId, userId));
    const received = await db.selectDistinct({ id: messages.senderId }).from(messages).where(eq(messages.receiverId, userId));
    
    const ids = new Set([...sent.map(s => s.id), ...received.map(r => r.id)]);
    const profileList = [];
    
    for (const id of ids) {
      const profile = await this.getProfileByUserId(id);
      if (profile) profileList.push(profile);
    }
    
    return profileList;
  }
}

export const storage = new DatabaseStorage();
