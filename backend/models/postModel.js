import mongoose from 'mongoose';

const postSchema = mongoose.Schema({
    postedBy: {  // Fixed typo from 'posteBy' to 'postedBy'
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String, // Specify type for text
        required: true, // Optionally require text
    },
    img: {
        type: String, // Assuming this is a URL to an image
        default: "", // Optionally set a default value
    },
    likes: {
        type:Number, // Array of user IDs who liked the post
        ref: 'User', // Reference to the User model
        default: [], // Default to an empty array
    },
    replies: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        text: {
            type: String, // Specify type for reply text
            required: true, // Optionally require text
        },
        userProfilePic: {
            type: String, // Assuming this is a URL to the user's profile picture
            default: "", // Optionally set a default value
        },
        username: {
            type: String, // Specify type for username
            required: true, // Optionally require username
        }
    }]
}, {
    timestamps: true, // Optional: adds createdAt and updatedAt timestamps
});

const Post = mongoose.model('Post', postSchema);

export default Post;
