import express from "express";
import cors from "cors";
import { StudentCollection, AlumniCollection, JobCollection,PostCollection, ForumCollection } from "./config.js";
import { EventCollection } from "./config.js";
import { AdminCollection } from "./config.js";
import multer from "multer";
import { Server } from "socket.io";
import http from "http";
import { MessageCollection } from "./config.js";
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const app = express();
const port = 5000;
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173",
        methods: ["GET", "POST"]
    }
});

app.use(cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"],
    credentials: true
}));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// ✅ Login Route
app.post("/login", async (req, res) => {
    try {
        const { email, admission_no } = req.body;
        console.log("Received login request for:", email, admission_no);

        let user = await StudentCollection.findOne({ Email: email }) ||
                   await AlumniCollection.findOne({ Email: email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        if (user["Student ID"] !== admission_no) {
            return res.status(401).json({ message: "Incorrect Admission Number" });
        }

        res.status(200).json({ 
            message: "Login successful", 
            user, 
            studentId: user["Student ID"]
        });

    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Fetch User Profile
app.get("/profile/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        let user = await StudentCollection.findOne({ "Student ID": studentId }) ||
                   await AlumniCollection.findOne({ "Student ID": studentId });

        if (!user) {
            return res.status(404).json({ message: "User profile not found" });
        }

        res.json(user);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Upload Profile Image
app.post("/upload/:id", upload.single("image"), async (req, res) => {
    try {
        const studentId = req.params.id;
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }

        const imageBase64 = req.file.buffer.toString("base64");

        let updatedUser = await StudentCollection.findOneAndUpdate(
            { "Student ID": studentId },
            { $set: { ProfileImage: `data:${req.file.mimetype};base64,${imageBase64}` } },
            { new: true }
        ) || await AlumniCollection.findOneAndUpdate(
            { "Student ID": studentId },
            { $set: { ProfileImage: `data:${req.file.mimetype};base64,${imageBase64}` } },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({ message: "Image uploaded successfully", image: updatedUser.ProfileImage });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Follow a User
app.post("/follow", async (req, res) => {
    try {
        const { userId, targetId } = req.body;
        if (!userId || !targetId) return res.status(400).json({ message: "Invalid request" });

        await StudentCollection.updateOne({ "Student ID": targetId }, { $addToSet: { Followers: userId } });
        await AlumniCollection.updateOne({ "Student ID": targetId }, { $addToSet: { Followers: userId } });

        res.status(200).json({ message: "Followed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error following user" });
    }
});

// ✅ Unfollow a User
app.post("/unfollow", async (req, res) => {
    try {
        const { userId, targetId } = req.body;
        if (!userId || !targetId) return res.status(400).json({ message: "Invalid request" });

        await StudentCollection.updateOne({ "Student ID": targetId }, { $pull: { Followers: userId } });
        await AlumniCollection.updateOne({ "Student ID": targetId }, { $pull: { Followers: userId } });

        res.status(200).json({ message: "Unfollowed successfully" });
    } catch (error) {
        res.status(500).json({ message: "Error unfollowing user" });
    }
});

// ✅ Update User Profile
app.put("/profile/:id", async (req, res) => {
    try {
        const studentId = req.params.id;
        const updateData = req.body;

        let updatedUser = await StudentCollection.findOneAndUpdate(
            { "Student ID": studentId },
            { $set: updateData },
            { new: true }
        ) || await AlumniCollection.findOneAndUpdate(
            { "Student ID": studentId },
            { $set: updateData },
            { new: true }
        );

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json({ message: "Profile updated successfully", updatedUser });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
});

// ✅ Search Users
app.get("/search", async (req, res) => {
    try {
        const { query } = req.query;
        if (!query) {
            return res.status(400).json({ message: "Search query is required" });
        }

        const searchRegex = new RegExp(query, 'i');

        const studentResults = await StudentCollection.find({
            $or: [
                { Name: searchRegex },
                { Email: searchRegex },
                { "Student ID": searchRegex },
                { Branch: searchRegex },
                { Skills: searchRegex }
            ]
        }).limit(10);

        const alumniResults = await AlumniCollection.find({
            $or: [
                { Name: searchRegex },
                { Email: searchRegex },
                { "Student ID": searchRegex },
                { Branch: searchRegex },
                { Skills: searchRegex },
                { Company: searchRegex }
            ]
        }).limit(10);

        const combinedResults = [
            ...studentResults.map(user => ({ ...user.toObject(), type: 'Student' })),
            ...alumniResults.map(user => ({ ...user.toObject(), type: 'Alumni' }))
        ];

        res.status(200).json(combinedResults);
    } catch (error) {
        res.status(500).json({ message: "Server error during search" });
    }
});

// ✅ Post a Job (Only Alumni)
app.post("/jobs", async (req, res) => {
    try {
        const jobData = req.body;

        const alumni = await AlumniCollection.findOne({ "Student ID": jobData.posted_by });
        if (!alumni) {
            return res.status(403).json({ message: "Only alumni can post jobs" });
        }

        const newJob = new JobCollection(jobData);
        await newJob.save();

        res.status(201).json({ message: "Job posted successfully", job: newJob });
    } catch (error) {
        res.status(500).json({ message: "Failed to post job" });
    }
});

// ✅ Fetch Jobs with Poster Name
app.get("/jobs", async (req, res) => {
    try {
        const jobs = await JobCollection.find().sort({ created_at: -1 });

        const today = new Date();
        const updatedJobs = jobs.map((job) => {
            // If the deadline has passed, mark the job as "closed"
            if (new Date(job.deadline) < today) {
                return { ...job.toObject(), status: "closed" };
            }
            return job.toObject();
        });

        // Fetch the name of the person who posted the job
        const enrichedJobs = await Promise.all(updatedJobs.map(async (job) => {
            const poster = await AlumniCollection.findOne({ "Student ID": job.posted_by });
            return {
                ...job,
                posted_by_name: poster ? poster.Name : "Unknown"
            };
        }));

        res.json(enrichedJobs);
    } catch (error) {
        res.status(500).json({ message: "Failed to fetch jobs" });
    }
});


app.put("/jobs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId, ...updateData } = req.body;

        const job = await JobCollection.findById(id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        // Check if the logged-in alumni is the one who posted the job
        if (job.posted_by !== studentId) {
            return res.status(403).json({ message: "Unauthorized to edit this job" });
        }

        const updatedJob = await JobCollection.findByIdAndUpdate(id, updateData, { new: true });

        res.status(200).json({ message: "Job updated successfully", updatedJob });
    } catch (error) {
        res.status(500).json({ message: "Failed to update job" });
    }
});

app.delete("/jobs/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { studentId } = req.body;

        const job = await JobCollection.findById(id);
        if (!job) return res.status(404).json({ message: "Job not found" });

        if (job.posted_by !== studentId) {
            return res.status(403).json({ message: "Unauthorized to delete this job" });
        }

        await JobCollection.findByIdAndDelete(id);
        res.status(200).json({ message: "Job deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: "Failed to delete job" });
    }
});



// Create a new post
app.post("/posts", async (req, res) => {
    try {
        const { author_id, title, content, tags } = req.body;
        
        // Verify if the author is a student or alumni
        const author = await StudentCollection.findOne({ "Student ID": author_id }) ||
                      await AlumniCollection.findOne({ "Student ID": author_id });
        
        if (!author) {
            return res.status(403).json({ message: "Unauthorized to create posts" });
        }

        const newPost = new PostCollection({
            author_id,
            title,
            content,
            tags,
            likes: [],
            comments: []
        });

        await newPost.save();
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ message: "Failed to create post" });
    }
});

// Get all posts
app.get("/posts", async (req, res) => {
    try {
        const posts = await PostCollection.find().sort({ created_at: -1 });

        const enrichedPosts = await Promise.all(
            posts.map(async (post) => {
                // Fetch post author details
                const author = await StudentCollection.findOne({ "Student ID": post.author_id }) ||
                               await AlumniCollection.findOne({ "Student ID": post.author_id });

                // Fetch comment authors
                const enrichedComments = await Promise.all(
                    post.comments.map(async (comment) => {
                        const commentAuthor = await StudentCollection.findOne({ "Student ID": comment.author_id }) ||
                                              await AlumniCollection.findOne({ "Student ID": comment.author_id });

                        return {
                            ...comment.toObject(),
                            authorName: commentAuthor ? commentAuthor.Name : "Unknown",
                            authorProfileImage: commentAuthor ? commentAuthor.ProfileImage : "/default-avatar.png"
                        };
                    })
                );

                return {
                    ...post.toObject(),
                    authorName: author ? author.Name : "Unknown",
                    authorProfileImage: author ? author.ProfileImage : "/default-avatar.png",
                    comments: enrichedComments // Updated comments with author details
                };
            })
        );

        res.json(enrichedPosts);
    } catch (error) {
        console.error("Error fetching posts:", error);
        res.status(500).json({ message: "Failed to fetch posts" });
    }
});


// Like a post
app.post("/posts/:postId/like", async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId } = req.body;

        const post = await PostCollection.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        const likeIndex = post.likes.indexOf(userId);
        if (likeIndex === -1) {
            post.likes.push(userId);
        } else {
            post.likes.splice(likeIndex, 1);
        }

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to update like" });
    }
});

// Add a comment to a post
app.post("/posts/:postId/comment", async (req, res) => {
    try {
        const { postId } = req.params;
        const { userId, content } = req.body;

        const post = await PostCollection.findById(postId);
        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        post.comments.push({
            author_id: userId,
            content,
            created_at: new Date()
        });

        await post.save();
        res.json(post);
    } catch (error) {
        res.status(500).json({ message: "Failed to add comment" });
    }
});
// Admin Login
app.post("/admin/login", async (req, res) => {
    const { username, password } = req.body;
    const admin = await AdminCollection.findOne({ username, password });
    if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
    }
    res.status(200).json({ message: "Login successful", admin });
});

app.get("/events", async (req, res) => {
    const events = await EventCollection.find();
    res.json(events);
});

// Add Event
app.post("/events", async (req, res) => {
    const { name, details, startDate, endDate, conductedBy } = req.body;
    const newEvent = new EventCollection({ name, details, startDate, endDate, conductedBy });
    await newEvent.save();
    res.status(201).json({ message: "Event added successfully" });
});

// Delete Event
app.delete("/events/:id", async (req, res) => {
    await EventCollection.findByIdAndDelete(req.params.id);
    res.json({ message: "Event deleted" });
});

// Update Event
app.put("/events/:id", async (req, res) => {
    const { name, details, startDate, endDate, conductedBy } = req.body;
    await EventCollection.findByIdAndUpdate(req.params.id, { name, details, startDate, endDate, conductedBy });
    res.json({ message: "Event updated" });
});
// ✅ Handle Socket Connections
io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("joinRoom", (roomId) => {
        socket.join(roomId);
        console.log(`User joined room: ${roomId}`);
    });

    socket.on("sendMessage", async ({ senderId, recipientId, message }) => {
        try {
            // Ensure both users follow each other
            const recipient = await StudentCollection.findOne({ "Student ID": recipientId }) ||
                              await AlumniCollection.findOne({ "Student ID": recipientId });
    
            if (!recipient || !recipient.Followers.includes(senderId)) {
                return socket.emit("error", "You can only message users you follow");
            }
    
            // Save message in database
            const newMessage = new MessageCollection({ senderId, recipientId, message, createdAt: new Date() });
            await newMessage.save();
    
            // Create message object with ID included
            const messageObject = { 
                id: newMessage._id, 
                senderId, 
                recipientId, 
                message,
                createdAt: newMessage.createdAt 
            };
    
            // Send confirmation only to the sender
            socket.emit("messageSent", messageObject);
            
            // Send message only to recipient(s) in the room (excluding sender)
            const chatRoom = [senderId, recipientId].sort().join("-");
            socket.to(chatRoom).emit("receiveMessage", messageObject);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    });

    socket.on("disconnect", () => {
        console.log("User disconnected:", socket.id);
    });
});
// Add these routes to index.js (after your other routes but before server.listen)

// Get messages between two users
app.get("/messages/:userId/:recipientId", async (req, res) => {
    try {
      const { userId, recipientId } = req.params;
      
      // Find all messages between these two users (in either direction)
      const messages = await MessageCollection.find({
        $or: [
          { senderId: userId, recipientId: recipientId },
          { senderId: recipientId, recipientId: userId }
        ]
      }).sort({ createdAt: 1 });
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });
  
  // Send a message (REST endpoint as fallback for Socket.IO)
  app.post("/send-message", async (req, res) => {
    try {
      const { senderId, recipientId, message } = req.body;
      
      // Ensure both users follow each other
      const recipient = await StudentCollection.findOne({ "Student ID": recipientId }) ||
                        await AlumniCollection.findOne({ "Student ID": recipientId });
      
      if (!recipient || !recipient.Followers.includes(senderId)) {
        return res.status(403).json({ message: "You can only message users you follow" });
      }
      
      // Save message in database
      const newMessage = new MessageCollection({ 
        senderId, 
        recipientId, 
        message, 
        createdAt: new Date() 
      });
      await newMessage.save();
      
      // Emit to socket if possible
      const chatRoom = [senderId, recipientId].sort().join("-");
      io.to(chatRoom).emit("receiveMessage", { senderId, recipientId, message });
      
      res.status(201).json({ message: "Message sent successfully" });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });
  
  // Get user's chat list (conversations)
  app.get("/chats/:userId", async (req, res) => {
    try {
      const { userId } = req.params;
      
      // Find all messages where the user is either sender or recipient
      const messages = await MessageCollection.find({
        $or: [
          { senderId: userId },
          { recipientId: userId }
        ]
      }).sort({ createdAt: -1 });
      
      // Extract unique users this person has chatted with
      const chatUsers = new Set();
      messages.forEach(msg => {
        if (msg.senderId === userId) {
          chatUsers.add(msg.recipientId);
        } else {
          chatUsers.add(msg.senderId);
        }
      });
      
      // Get info about these users
      const chatList = await Promise.all(
        Array.from(chatUsers).map(async (chatUserId) => {
          const user = await StudentCollection.findOne({ "Student ID": chatUserId }) ||
                       await AlumniCollection.findOne({ "Student ID": chatUserId });
          
          // Find the most recent message
          const lastMessage = messages.find(msg => 
            (msg.senderId === userId && msg.recipientId === chatUserId) || 
            (msg.senderId === chatUserId && msg.recipientId === userId)
          );
          
          return {
            userId: chatUserId,
            name: user?.Name || "Unknown User",
            profileImage: user?.ProfileImage || "/default-avatar.png",
            lastMessage: lastMessage?.message || "",
            lastMessageTime: lastMessage?.createdAt || new Date()
          };
        })
      );
      
      // Sort by most recent message
      chatList.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
      
      res.json(chatList);
    } catch (error) {
      console.error("Error fetching chats:", error);
      res.status(500).json({ message: "Failed to fetch chat list" });
    }
  });

server.listen(port, () => {
    console.log(`Server running on port ${port}`);
});