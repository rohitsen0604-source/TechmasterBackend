import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";
import { connectDB } from "./config/database";
import { FeaturedVideo } from "./models/FeaturedVideo";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "qm3umdmz",
  api_key: process.env.CLOUDINARY_API_KEY || "153856442951571",
  api_secret: process.env.CLOUDINARY_API_SECRET || "sP_mqcDudHZG0Fn7go9tnYsrgkM",
  secure: true,
});

const sampleVideos = [
  "https://assets.mixkit.co/videos/preview/mixkit-vertical-animation-of-a-futuristic-robot-41527-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-hands-holding-a-smartphone-with-a-green-screen-41529-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-woman-holding-a-smartphone-with-a-green-screen-41530-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-holding-a-smartphone-with-a-green-screen-41528-large.mp4",
  "https://assets.mixkit.co/videos/preview/mixkit-vertical-animation-of-a-futuristic-robot-41527-large.mp4"
];

const REELS_DATA = [
  {
    id: "reel-1",
    platform: "youtube",
    title: "Tech Master Viral Short #1",
    views: "5.4M",
    channelName: "@techmasterhq",
    url: "https://youtube.com/shorts/YP4CdON5rrQ?si=DOx4bPZIJPpc2LSa",
    sampleVideo: sampleVideos[0]
  },
  {
    id: "reel-2",
    platform: "youtube",
    title: "Tech Master Official Showcase",
    views: "3.8M",
    channelName: "@techmasterhq",
    url: "https://www.youtube.com/watch?v=3VuyriEkDwg",
    sampleVideo: sampleVideos[1]
  },
  {
    id: "reel-3",
    platform: "youtube",
    title: "Tech Master Exclusive Video",
    views: "4.2M",
    channelName: "@techmasterhq",
    url: "https://youtu.be/vW2K0L-vUgw?si=4KrnU7BeuuZIlO97",
    sampleVideo: sampleVideos[2]
  },
  {
    id: "reel-4",
    platform: "instagram",
    title: "Tech Master Instagram Reel #1",
    views: "1.8M",
    channelName: "@techmasterco",
    url: "https://www.instagram.com/reel/DAs7dOoyU9d/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    sampleVideo: sampleVideos[3]
  },
  {
    id: "reel-5",
    platform: "instagram",
    title: "Trendz Talk Viral Reel",
    views: "2.4M",
    channelName: "@trendztalk",
    url: "https://www.instagram.com/reel/DGdKcjNymR4/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    sampleVideo: sampleVideos[4]
  },
  {
    id: "reel-6",
    platform: "youtube",
    title: "Master Wheels High-Speed Breakdown",
    views: "3.2M",
    channelName: "@masterwheel1",
    url: "https://youtube.com/shorts/iVGAICmKlpk?si=cL_9koXbTowODWEx",
    sampleVideo: sampleVideos[1]
  },
  {
    id: "reel-7",
    platform: "youtube",
    title: "Next Univerz Masterclass",
    views: "2.7M",
    channelName: "@NextUniverz",
    url: "https://www.youtube.com/watch?v=oXr9B3Hg4fo",
    sampleVideo: sampleVideos[2]
  },
  {
    id: "reel-8",
    platform: "instagram",
    title: "Full Circle Creator Story",
    views: "950K",
    channelName: "@fullcircle_in",
    url: "https://www.instagram.com/reel/Da1kOKEqys7/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    sampleVideo: sampleVideos[3]
  },
  {
    id: "reel-9",
    platform: "youtube",
    title: "Tech Master Hardware Teardown",
    views: "8.4M",
    channelName: "@techmasterhq",
    url: "https://www.youtube.com/watch?v=pGdwMZ_O_0A",
    sampleVideo: sampleVideos[0]
  },
  {
    id: "reel-10",
    platform: "youtube",
    title: "Pop Tech Short-Form Reel",
    views: "9.1M",
    channelName: "@trendztalk",
    url: "https://youtube.com/shorts/gP7t0_5qMa4?si=1A54F_DsBGGlaPPF",
    sampleVideo: sampleVideos[1]
  },
  {
    id: "reel-11",
    platform: "youtube",
    title: "Automotive Tech Special",
    views: "4.1M",
    channelName: "@masterwheel1",
    url: "https://youtu.be/Wnid6auAxbE?si=mJKMPlZLMcCTLnuz",
    sampleVideo: sampleVideos[2]
  },
  {
    id: "reel-12",
    platform: "youtube",
    title: "Developer Deep Dive",
    views: "2.2M",
    channelName: "@NextUniverz",
    url: "https://www.youtube.com/watch?v=uMW9UyONsOk",
    sampleVideo: sampleVideos[3]
  },
  {
    id: "reel-13",
    platform: "instagram",
    title: "Tech Master Official Reel",
    views: "1.5M",
    channelName: "@techmasterco",
    url: "https://www.instagram.com/techmasterco/reel/DPOfpSGgRkN/?hl=en",
    sampleVideo: sampleVideos[0]
  },
  {
    id: "reel-14",
    platform: "instagram",
    title: "Viral Pop Culture Tech",
    views: "3.1M",
    channelName: "@trendztalk",
    url: "https://www.instagram.com/reel/DCRQiCgyu5W/?igsh=ZGVyMTRnOGpqNDVi",
    sampleVideo: sampleVideos[1]
  },
  {
    id: "reel-15",
    platform: "youtube",
    title: "Full Circle Podcast Highlight",
    views: "1.9M",
    channelName: "@fullcircle_in",
    url: "https://youtu.be/iNtv0Yl1DB4?si=TTeocdaRSPQnL8_U",
    sampleVideo: sampleVideos[2]
  },
  {
    id: "reel-16",
    platform: "youtube",
    title: "Tech Master Cinematic Reveal",
    views: "4.4M",
    channelName: "@techmasterhq",
    url: "https://www.youtube.com/watch?v=CaNEbx-Kwzc",
    sampleVideo: sampleVideos[3]
  },
  {
    id: "reel-17",
    platform: "youtube",
    title: "Future Gadget Breakdown",
    views: "3.9M",
    channelName: "@techmasterhq",
    url: "https://www.youtube.com/watch?v=ClgRNy0QBWk",
    sampleVideo: sampleVideos[0]
  },
  {
    id: "reel-18",
    platform: "youtube",
    title: "Supercar Track Telemetry Test",
    views: "7.2M",
    channelName: "@masterwheel1",
    url: "https://www.youtube.com/watch?v=mAXjgBDK3Gs",
    sampleVideo: sampleVideos[1]
  },
  {
    id: "reel-19",
    platform: "instagram",
    title: "Tech Master Instagram Special",
    views: "2.8M",
    channelName: "@techmasterco",
    url: "https://www.instagram.com/reel/DW3uoC8CXWf/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    sampleVideo: sampleVideos[2]
  },
  {
    id: "reel-20",
    platform: "instagram",
    title: "Trendz Talk Pop Reel",
    views: "1.7M",
    channelName: "@trendztalk",
    url: "https://www.instagram.com/reel/DZHCtuzJzxn/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    sampleVideo: sampleVideos[3]
  },
  {
    id: "reel-21",
    platform: "instagram",
    title: "Full Circle Studio Reel",
    views: "890K",
    channelName: "@fullcircle_in",
    url: "https://www.instagram.com/reel/DZt-HodJ94O/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    sampleVideo: sampleVideos[0]
  },
  {
    id: "reel-22",
    platform: "instagram",
    title: "Next Univerz Tech Highlight",
    views: "1.4M",
    channelName: "@NextUniverz",
    url: "https://www.instagram.com/reel/DYZnd2FpY7O/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    sampleVideo: sampleVideos[1]
  },
  {
    id: "reel-23",
    platform: "instagram",
    title: "Master Wheels Track Performance",
    views: "4.5M",
    channelName: "@masterwheel1",
    url: "https://www.instagram.com/reel/DT7z9b0gTCi/?utm_source=ig_web_copy_link&igsh=MzRlODBiNWFlZA==",
    sampleVideo: sampleVideos[2]
  }
];

async function runUpload() {
  try {
    await connectDB();
    console.log("Connected to MongoDB for Cloudinary Reels Upload...");

    // Upload sample videos to Cloudinary cloud 'qm3umdmz'
    const uploadedCloudinaryUrls: string[] = [];
    for (let i = 0; i < sampleVideos.length; i++) {
      console.log(`Uploading sample video ${i + 1}/${sampleVideos.length} to Cloudinary (cloud: qm3umdmz)...`);
      try {
        const result = await cloudinary.uploader.upload(sampleVideos[i], {
          resource_type: "video",
          folder: "techmaster/reels",
          public_id: `reel_sample_${i + 1}`
        });
        console.log(`Cloudinary Upload Success ${i + 1}:`, result.secure_url);
        uploadedCloudinaryUrls.push(result.secure_url);
      } catch (err: any) {
        console.warn(`Cloudinary upload failed for index ${i}, using fallback:`, err.message || err);
        uploadedCloudinaryUrls.push("https://res.cloudinary.com/qm3umdmz/video/upload/v1/techmaster/reels/sample_reel.mp4");
      }
    }

    // Clear and re-seed database with Cloudinary video URLs
    await FeaturedVideo.deleteMany({});
    console.log("Cleared existing Featured Videos in MongoDB.");

    const seedDocs = REELS_DATA.map((item, index) => {
      const cloudinaryVideoUrl = uploadedCloudinaryUrls[index % uploadedCloudinaryUrls.length];
      return {
        platform: item.platform,
        title: item.title,
        url: item.url,
        videoUrl: cloudinaryVideoUrl,
        thumbnail: `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop`,
        channelName: item.channelName,
        viewCount: item.views,
        displayOrder: index + 1,
        isFeatured: true,
        isActive: true
      };
    });

    await FeaturedVideo.insertMany(seedDocs);
    console.log(`Successfully uploaded & seeded ${seedDocs.length} Featured Videos with Cloudinary URLs to MongoDB!`);
    console.log("Cloudinary URL example:", seedDocs[0].videoUrl);
    process.exit(0);
  } catch (error) {
    console.error("Error running Cloudinary upload script:", error);
    process.exit(1);
  }
}

runUpload();
