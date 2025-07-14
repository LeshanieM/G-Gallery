import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userprofile: {
        type: [],
        required: true
    }
}, { timestamps: true });

// model
const GalleryuserDB = new mongoose.model("GalleryDB", userSchema);
export default GalleryuserDB;