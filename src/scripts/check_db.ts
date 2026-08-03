import mongoose from "mongoose";
import dotenv from "dotenv";
import { FeaturedVideo } from "../models/FeaturedVideo";
import { connectDB } from "../config/database";

dotenv.config();

async function check() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for check script");
    
    const videos = await FeaturedVideo.find({}).lean();
    console.log("Total videos in featuredvideos:", videos.length);
    if (videos.length > 0) {
      console.log("All videos:");
      videos.forEach((v, idx) => {
        console.log(`[${idx}] URL: ${v.url}, ChannelName: ${v.channelName}, Title: ${v.title}`);
      });
    }
    
    process.exit(0);
  } catch (err) {
    console.error("Error checking DB:", err);
    process.exit(1);
  }
}

check();
