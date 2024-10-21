import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        minLength: 6,
        required: true, // It's a good practice to require the password field
    },
    profilePic: {
        type: String, // Specify the type for the profile picture (e.g., URL as a String)
        default: "", // Optionally set a default value
    },
    followers: {
        type: [String],
        default: [], // Default to an empty array
    },
    following: {
        type: [String], // Define as an array of Strings for following users
        default: [], // Default to an empty array
    },
    bio: {
        type: String, // Define bio as a String
        default: "", // Optionally set a default value
    },
}, {
    timestamps: true, // Optional: adds createdAt and updatedAt timestamps
});

const User = mongoose.model("User", userSchema);

export default User;
