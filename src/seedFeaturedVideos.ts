import mongoose from "mongoose";
import dotenv from "dotenv";
import { FeaturedVideo } from "./models/FeaturedVideo";
import { connectDB } from "./config/database";

dotenv.config();

const INITIAL_URLS = [
  "https://youtube.com/shorts/YP4CdON5rrQ?si=DOx4bPZIJPpc2LSa",
  "https://www.youtube.com/watch?v=3VuyriEkDwg",
  "https://youtu.be/vW2K0L-vUgw?si=4KrnU7BeuuZIlO97",
  "https://www.instagram.com/reel/DAs7dOoyU9d/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DGdKcjNymR4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://youtu.be/iVGAICmKlpk?si=cL_9koXbTowODWEx",
  "https://www.youtube.com/watch?v=oXr9B3Hg4fo",
  "https://www.instagram.com/reel/Da1kOKEqys7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.youtube.com/watch?v=pGdwMZ_O_0A",
  "https://youtube.com/shorts/gP7t0_5qMa4?si=1A54F_DsBGGlaPPF",
  "https://youtu.be/Wnid6auAxbE?si=mJKMPlZLMcCTLnuz",
  "https://www.youtube.com/watch?v=uMW9UyONsOk",
  "https://www.instagram.com/techmasterco/reel/DPOfpSGgRkN/?hl=en",
  "https://www.instagram.com/reel/DCRQiCgyu5W/?igsh=ZGVyMTRnOGpqNDVi",
  "https://youtu.be/iNtv0Yl1DB4?si=TTeocdaRSPQnL8_U",
  "https://www.youtube.com/watch?v=CaNEbx-Kwzc",
  "https://www.youtube.com/watch?v=ClgRNy0QBWk",
  "https://www.youtube.com/watch?v=mAXjgBDK3Gs",
  "https://www.instagram.com/reel/DW3uoC8CXWf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DZHCtuzJzxn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DZt-HodJ94O/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DYZnd2FpY7O/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
  "https://www.instagram.com/reel/DT7z9b0gTCi/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA=="
];

import { extractVideoMetadata } from "./routes/featuredVideo.routes";

async function seed() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for seeding Featured Videos...");

    await FeaturedVideo.deleteMany({});
    console.log("Cleared existing Featured Videos.");

    const itemsToInsert = [];
    for (let idx = 0; idx < INITIAL_URLS.length; idx++) {
      const url = INITIAL_URLS[idx];
      console.log(`Fetching metadata for ${idx + 1}/${INITIAL_URLS.length}: ${url}`);
      try {
        const meta = await extractVideoMetadata(url);
        itemsToInsert.push({
          platform: meta.platform,
          title: meta.title,
          url,
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vertical-animation-of-a-futuristic-robot-41527-large.mp4",
          thumbnail: meta.thumbnail,
          channelName: meta.channelName,
          viewCount: meta.viewCount,
          displayOrder: idx + 1,
          isFeatured: true,
          isActive: true
        });
      } catch (err) {
        console.error(`Failed to fetch metadata for ${url}, using fallback`, err);
        const isInsta = url.includes("instagram.com");
        itemsToInsert.push({
          platform: isInsta ? "instagram" : "youtube",
          title: `Featured Item #${idx + 1}`,
          url,
          videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-vertical-animation-of-a-futuristic-robot-41527-large.mp4",
          thumbnail: isInsta ? "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop" : "",
          channelName: isInsta ? "@techmasterco" : "@techmasterhq",
          viewCount: "1.2M",
          displayOrder: idx + 1,
          isFeatured: true,
          isActive: true
        });
      }
    }

    await FeaturedVideo.insertMany(itemsToInsert);
    console.log(`Successfully seeded ${itemsToInsert.length} Featured Videos into MongoDB!`);
    process.exit(0);
  } catch (e) {
    console.error("Seeding error:", e);
    process.exit(1);
  }
}

seed();
