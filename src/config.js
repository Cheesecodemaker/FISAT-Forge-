import mongoose from "mongoose";

// Connect to MongoDB Atlas
mongoose.connect("mongodb+srv://dbUser:fisatforge@forge.tjwpe.mongodb.net/user?retryWrites=true&w=majority&appName=forge", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
    .then(() => console.log("Database Connected Successfully"))
    .catch((err) => console.error("Database Connection Failed:", err));

// Define user schema
const UserSchema = new mongoose.Schema({
    Name: { type: String, required: true },
    "Student ID": { type: String, required: true },
    Email: { type: String, required: true },
    "Phone Number": { type: String, required: true },
    "Year of Graduation": { type: Number, required: true },
    Role: { type: String, enum: ["Student", "Alumni"], required: true },
    Branch: { type: String, required: true },
    Bio: { type: String, default: "" },
    Skills: { type: [String], default: [] },
    SocialLinks: {
        LinkedIn: { type: String, default: "" },
        GitHub: { type: String, default: "" }
    },
    Company: { type: String, default: null },
    Followers: { type: [String], default: [] },
    ProfileImage: { type: String, default: "" }
});

// Define job schema
const JobSchema = new mongoose.Schema({
    title: { type: String, required: true },
    company: { type: String, required: true },
    description: { type: String, required: true },
    requirements: { type: String, required: true },
    location: { type: String, required: true },
    salary_range: { type: String },
    deadline: { type: Date, required: true },
    posted_by: { type: String, required: true },
    status: { type: String, default: 'active' },
    job_type: { type: String, required: true },
    experience_level: { type: String, required: true },
    created_at: { type: Date, default: Date.now }
});

// Add these schemas to your existing config.js

const PostSchema = new mongoose.Schema({
    author_id: { type: String, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    likes: [{ type: String }], // Array of user IDs who liked the post
    comments: [{
        author_id: { type: String, required: true },
        content: { type: String, required: true },
        created_at: { type: Date, default: Date.now }
    }],
    tags: [{ type: String }]
});

const ForumSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    created_by: { type: String, required: true },
    created_at: { type: Date, default: Date.now },
    category: { type: String, required: true },
    posts: [{
        author_id: { type: String, required: true },
        content: { type: String, required: true },
        created_at: { type: Date, default: Date.now },
        likes: [{ type: String }],
        replies: [{
            author_id: { type: String, required: true },
            content: { type: String, required: true },
            created_at: { type: Date, default: Date.now }
        }]
    }]
});
const AdminSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true }
});

const EventSchema = new mongoose.Schema({
    name: { type: String, required: true },
    details: { type: String, required: true },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    conductedBy: { type: String, required: true }
});
const MessageSchema = new mongoose.Schema({
    senderId: { type: String, required: true },
    recipientId: { type: String, required: true },
    message: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const MessageCollection = mongoose.model("message", MessageSchema);
export { MessageCollection };



// Define collections
const StudentCollection = mongoose.model("student", UserSchema, "student");
const AlumniCollection = mongoose.model("alumni", UserSchema, "alumni");
const AdminCollection = mongoose.model("admin", AdminSchema);
const JobCollection = mongoose.model("job", JobSchema, "jobs");
const PostCollection = mongoose.model("post", PostSchema, "posts");
const ForumCollection = mongoose.model("forum", ForumSchema, "forums");
const EventCollection = mongoose.model("event", EventSchema);

export { EventCollection };



export { StudentCollection, AlumniCollection, JobCollection, PostCollection, ForumCollection , AdminCollection};