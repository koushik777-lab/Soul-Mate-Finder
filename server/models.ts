import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isAdmin: { type: Boolean, default: false },
});

export const UserModel = mongoose.model("User", userSchema);

const profileSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    fullName: { type: String, required: true },
    age: { type: Number, required: true },
    gender: { type: String, required: true },
    religion: { type: String, required: true },
    caste: { type: String },
    city: { type: String, required: true },
    profession: { type: String },
    bio: { type: String },
    photoUrl: { type: String },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },

    // New Fields
    dob: { type: String },
    education: { type: String },
    country: { type: String },
    profileCreatedFor: { type: String },
    maritalStatus: { type: String },
    livingInIndiaSince: { type: String },
    placeOfBirth: { type: String },
    nationality: { type: String },
    visaStatus: { type: String },
    ethnicity: { type: String },
    income: { type: String },
    state: { type: String },
    livingWithFamily: { type: Boolean },
    height: { type: String },
    weight: { type: String },
    bodyType: { type: String },
    familyStatus: { type: String },
    complexion: { type: String },
    diet: { type: String },
    drink: { type: String },
    smoke: { type: String },

    partnerPreferences: {
        maritalStatus: { type: String },
        religion: { type: String },
        education: { type: String },
        countries: [{ type: String }],
        ageMin: { type: Number },
        ageMax: { type: Number },
        drinking: { type: String },
        smoking: { type: String },
        residency: { type: String },
        diet: { type: String },
    }
});

export const ProfileModel = mongoose.model("Profile", profileSchema);

const interestSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    status: { type: String, default: "pending" }, // "pending" | "accepted" | "rejected"
    createdAt: { type: Date, default: Date.now },
});

export const InterestModel = mongoose.model("Interest", interestSchema);

const messageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    receiverId: { type: String, required: true },
    content: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
});

export const MessageModel = mongoose.model("Message", messageSchema);
