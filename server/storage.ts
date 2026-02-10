import {
  type User, type InsertUser, type Profile, type Interest, type Message
} from "@shared/schema";
import { UserModel, ProfileModel, InterestModel, MessageModel } from "./models";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>; // For admin

  // Profiles
  createProfile(profile: any): Promise<Profile>;
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByUserId(userId: string): Promise<Profile | undefined>;
  listProfiles(filters: any): Promise<Profile[]>;
  updateProfile(id: string, profile: Partial<Profile>): Promise<Profile>;

  // Interests
  createInterest(senderId: string, receiverId: string): Promise<Interest>;
  getInterests(userId: string, type: 'sent' | 'received' | 'matches'): Promise<{ interest: Interest, profile: Profile }[]>;
  updateInterestStatus(id: string, status: string): Promise<Interest | undefined>;
  getInterestById(id: string): Promise<Interest | undefined>;

  // Messages
  createMessage(senderId: string, receiverId: string, content: string): Promise<Message>;
  getMessages(userId1: string, userId2: string): Promise<Message[]>;
  getConversations(userId: string): Promise<Profile[]>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    try {
      const user = await UserModel.findById(id);
      return user ? this.mapUser(user) : undefined;
    } catch {
      return undefined;
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const user = await UserModel.findOne({ username });
    return user ? this.mapUser(user) : undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const user = await UserModel.create(insertUser);
    return this.mapUser(user);
  }

  async getAllUsers(): Promise<User[]> {
    const users = await UserModel.find();
    return users.map(this.mapUser);
  }

  // Profiles
  async createProfile(profile: any): Promise<Profile> {
    const newProfile = await ProfileModel.create(profile);
    return this.mapProfile(newProfile);
  }

  async getProfile(id: string): Promise<Profile | undefined> {
    // Mongoose findById(id) expects an ObjectId.
    // If the ID passed is invalid length/format, it might throw.
    // We'll wrap in try-catch or just define it's valid.
    try {
      const profile = await ProfileModel.findById(id);
      return profile ? this.mapProfile(profile) : undefined;
    } catch {
      return undefined;
    }
  }

  async getProfileByUserId(userId: string): Promise<Profile | undefined> {
    const profile = await ProfileModel.findOne({ userId });
    return profile ? this.mapProfile(profile) : undefined;
  }

  async listProfiles(filters: any = {}): Promise<Profile[]> {
    const query: any = {};
    if (filters.gender) query.gender = filters.gender;
    if (filters.religion) query.religion = filters.religion;
    if (filters.city) query.city = filters.city;

    if (filters.ageMin || filters.ageMax) {
      query.age = {};
      if (filters.ageMin) query.age.$gte = filters.ageMin;
      if (filters.ageMax) query.age.$lte = filters.ageMax;
    }

    const profiles = await ProfileModel.find(query);
    return profiles.map(this.mapProfile);
  }

  async updateProfile(id: string, update: Partial<Profile>): Promise<Profile> {
    const profile = await ProfileModel.findByIdAndUpdate(id, update, { new: true });
    if (!profile) throw new Error("Profile not found");
    return this.mapProfile(profile);
  }

  // Interests
  async createInterest(senderId: string, receiverId: string): Promise<Interest> {
    const interest = await InterestModel.create({ senderId, receiverId });
    return this.mapInterest(interest);
  }

  async getInterests(userId: string, type: 'sent' | 'received' | 'matches'): Promise<{ interest: Interest, profile: Profile }[]> {
    if (type === 'matches') {
      // Find all accepted interests where user is sender OR receiver
      const sent = await InterestModel.find({ senderId: userId, status: 'accepted' });
      const received = await InterestModel.find({ receiverId: userId, status: 'accepted' });

      const results = [];

      // Process sent (user matched with receiver)
      for (const interest of sent) {
        const profile = await this.getProfileByUserId(interest.receiverId);
        if (profile) {
          results.push({ interest: this.mapInterest(interest), profile });
        }
      }

      // Process received (user matched with sender)
      for (const interest of received) {
        const profile = await this.getProfileByUserId(interest.senderId);
        if (profile) {
          results.push({ interest: this.mapInterest(interest), profile });
        }
      }

      return results;
    } else if (type === 'sent') {
      const interests = await InterestModel.find({ senderId: userId });
      const results = [];
      for (const interest of interests) {
        const profile = await this.getProfileByUserId(interest.receiverId);
        if (profile) {
          results.push({ interest: this.mapInterest(interest), profile });
        }
      }
      return results;
    } else {
      const interests = await InterestModel.find({ receiverId: userId });
      const results = [];
      for (const interest of interests) {
        const profile = await this.getProfileByUserId(interest.senderId);
        if (profile) {
          results.push({ interest: this.mapInterest(interest), profile });
        }
      }
      return results;
    }
  }

  async updateInterestStatus(id: string, status: string): Promise<Interest | undefined> {
    const interest = await InterestModel.findByIdAndUpdate(id, { status }, { new: true });
    return interest ? this.mapInterest(interest) : undefined;
  }

  async getInterestById(id: string): Promise<Interest | undefined> {
    try {
      const interest = await InterestModel.findById(id);
      return interest ? this.mapInterest(interest) : undefined;
    } catch {
      return undefined;
    }
  }

  // Messages
  async createMessage(senderId: string, receiverId: string, content: string): Promise<Message> {
    const message = await MessageModel.create({ senderId, receiverId, content });
    return this.mapMessage(message);
  }

  async getMessages(userId1: string, userId2: string): Promise<Message[]> {
    const messages = await MessageModel.find({
      $or: [
        { senderId: userId1, receiverId: userId2 },
        { senderId: userId2, receiverId: userId1 }
      ]
    }).sort({ createdAt: 1 });
    return messages.map(this.mapMessage);
  }

  async getConversations(userId: string): Promise<Profile[]> {
    const sent = await MessageModel.distinct("receiverId", { senderId: userId });
    const received = await MessageModel.distinct("senderId", { receiverId: userId });

    const ids = new Set([...sent, ...received]);
    const profileList = [];

    for (const id of Array.from(ids)) {
      if (typeof id === 'string') {
        const profile = await this.getProfileByUserId(id);
        if (profile) profileList.push(profile);
      }
    }

    return profileList;
  }

  // Helpers to map Mongoose documents to plain objects with string IDs
  private mapUser(doc: any): User {
    return {
      id: doc._id.toString(),
      username: doc.username,
      password: doc.password,
      isAdmin: doc.isAdmin
    };
  }

  private mapProfile(doc: any): Profile {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      fullName: doc.fullName,
      age: doc.age,
      gender: doc.gender,
      religion: doc.religion,
      caste: doc.caste,
      city: doc.city,
      profession: doc.profession,
      bio: doc.bio,
      photoUrl: doc.photoUrl,
      isVerified: doc.isVerified,
      createdAt: doc.createdAt
    };
  }

  private mapInterest(doc: any): Interest {
    return {
      id: doc._id.toString(),
      senderId: doc.senderId,
      receiverId: doc.receiverId,
      status: doc.status,
      createdAt: doc.createdAt
    };
  }

  private mapMessage(doc: any): Message {
    return {
      id: doc._id.toString(),
      senderId: doc.senderId,
      receiverId: doc.receiverId,
      content: doc.content,
      createdAt: doc.createdAt
    };
  }
}

export const storage = new DatabaseStorage();
