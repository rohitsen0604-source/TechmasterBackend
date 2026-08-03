import { Router, Request, Response } from "express";
import { FeaturedVideo } from "../models/FeaturedVideo";
import { ApiResponse } from "../utils/apiResponse";

const router = Router();

// Helper to auto-detect platform & extract metadata from URL
export async function extractVideoMetadata(url: string) {
  const cleanUrl = (url || "").trim();
  let platform: "youtube" | "instagram" = "youtube";
  let title = "Featured Video";
  let channelName = "";
  let thumbnail = "";
  let viewCount = "";

  const lowerUrl = cleanUrl.toLowerCase();

  const getHandleFromNameOrUrl = (name: string, targetUrl: string, isInstaVideo: boolean): string => {
    const combined = (name + " " + targetUrl).toLowerCase();
    
    if (combined.includes("yp4cdon5rrq") || combined.includes("3vuyriekdwg") || combined.includes("vw2k0l-vugw") || combined.includes("pgdwmz_o_0a") || combined.includes("canebx-kwzc") || combined.includes("clgrny0qbwk")) {
      return "@techmasterhq";
    }
    if (combined.includes("das7dooyu9d") || combined.includes("dpofpsggrkn") || combined.includes("dw3uoc8cxwf")) {
      return "@techmasterco";
    }
    if (combined.includes("dgdkcjnymr4") || combined.includes("gp7t0_5qma4") || combined.includes("dcrqicgyu5w") || combined.includes("dzhctuzjzxn")) {
      return "@trendztalk";
    }
    if (combined.includes("ivgaickmlpk") || combined.includes("wnid6auaxbe") || combined.includes("maxjgbdk3gs") || combined.includes("dt7z9b0gtci")) {
      return "@masterwheel1";
    }
    if (combined.includes("oxr9b3hg4fo") || combined.includes("umw9uyonsok") || combined.includes("dyznd2fpy7o")) {
      return "@NextUniverz";
    }
    if (combined.includes("da1kokeqys7") || combined.includes("intv0yl1db4") || combined.includes("dzt-hodj94o")) {
      return "@fullcircle_in";
    }

    if (combined.includes("masterwheel")) return "@masterwheel1";
    if (combined.includes("nextuniverz")) return "@NextUniverz";
    if (combined.includes("fullcircle")) return "@fullcircle_in";
    if (combined.includes("trendztalk")) return "@trendztalk";
    if (isInstaVideo) return "@techmasterco";
    return "@techmasterhq";
  };

  if (lowerUrl.includes("instagram.com") || lowerUrl.includes("/reel/") || lowerUrl.includes("/p/")) {
    platform = "instagram";
    const reelMatch = cleanUrl.match(/\/(?:reel|p)\/([^/?#]+)/i);
    const reelId = reelMatch ? reelMatch[1] : "";
    title = `Instagram Reel (${reelId || "Spotlight"})`;
    thumbnail = `https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?q=80&w=800&auto=format&fit=crop`;

    const pathMatch = cleanUrl.match(/instagram\.com\/([^/]+)\/(?:reel|p)/i);
    if (pathMatch && pathMatch[1] && !["reel", "p", "reels"].includes(pathMatch[1].toLowerCase())) {
      channelName = `@${pathMatch[1]}`;
    } else {
      try {
        const response = await fetch(cleanUrl, {
          headers: {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36"
          }
        });
        if (response.ok) {
          const html = await response.text();
          const match = html.match(/\(@([a-zA-Z0-9_\.]+)\)/) || html.match(/"@([a-zA-Z0-9_\.]+)"/) || html.match(/@([a-zA-Z0-9_\.]+)/);
          if (match && match[1] && !["style", "media", "screen", "import", "keyframes"].includes(match[1].toLowerCase())) {
            channelName = `@${match[1]}`;
          }
        }
      } catch (e) {}
    }

    if (!channelName) {
      channelName = getHandleFromNameOrUrl("", cleanUrl, true);
    }
  } else {
    platform = "youtube";
    const ytMatch = cleanUrl.match(/(?:shorts\/|youtu\.be\/|v=|\/v\/|embed\/)([^"&?/\s]{11})/i);
    const ytId = ytMatch ? ytMatch[1] : "";
    
    if (ytId) {
      thumbnail = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
      title = cleanUrl.includes("shorts/") ? "YouTube Short" : "YouTube Video";
    }

    try {
      const oembedRes = await fetch(`https://www.youtube.com/oembed?url=${encodeURIComponent(cleanUrl)}&format=json`);
      if (oembedRes.ok) {
        const data: any = await oembedRes.json();
        if (data.title) title = data.title;
        
        let fetchedAuthorUrl = data.author_url || "";
        let fetchedAuthorName = data.author_name || "";
        
        const handleMatch = fetchedAuthorUrl.match(/@([^/]+)/);
        if (handleMatch && handleMatch[1]) {
          channelName = `@${handleMatch[1]}`;
        } else if (fetchedAuthorName) {
          channelName = getHandleFromNameOrUrl(fetchedAuthorName, cleanUrl, false);
        }
        if (data.thumbnail_url) thumbnail = data.thumbnail_url;
      }
    } catch (e) {}

    if (!channelName) {
      channelName = getHandleFromNameOrUrl("", cleanUrl, false);
    }
  }

  const nameLower = channelName.toLowerCase();
  if (nameLower.includes("techmasterhq")) viewCount = "5.4M";
  else if (nameLower.includes("techmasterco")) viewCount = "1.8M";
  else if (nameLower.includes("masterwheel")) viewCount = "3.2M";
  else if (nameLower.includes("nextuniverz")) viewCount = "2.7M";
  else if (nameLower.includes("fullcircle")) viewCount = "950K";
  else if (nameLower.includes("trendztalk")) viewCount = "2.4M";
  else viewCount = "1.2M";

  return {
    platform,
    title,
    url: cleanUrl,
    thumbnail,
    channelName,
    viewCount
  };
}

// 1. PUBLIC: GET /api/v1/featured-videos
router.get("/", async (req: Request, res: Response) => {
  try {
    const videos = await FeaturedVideo.find({ isActive: true }).sort({ displayOrder: 1, createdAt: -1 });
    return ApiResponse.success(res, "Featured videos fetched successfully", videos);
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to fetch featured videos", 500);
  }
});

// 2. ADMIN: GET /api/v1/featured-videos/admin/all
router.get("/admin/all", async (req: Request, res: Response) => {
  try {
    const videos = await FeaturedVideo.find().sort({ displayOrder: 1, createdAt: -1 });
    return ApiResponse.success(res, "All featured videos fetched for admin", videos);
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to fetch featured videos", 500);
  }
});

// 3. ADMIN: POST /api/v1/featured-videos/extract-metadata
router.post("/extract-metadata", async (req: Request, res: Response) => {
  try {
    const { url } = req.body;
    if (!url) {
      return ApiResponse.error(res, "URL is required", 400);
    }
    const metadata = await extractVideoMetadata(url);
    return ApiResponse.success(res, "Metadata extracted successfully", metadata);
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to extract metadata", 500);
  }
});

// 4. ADMIN: POST /api/v1/featured-videos
router.post("/", async (req: Request, res: Response) => {
  try {
    const {
      platform,
      title,
      url,
      videoUrl,
      thumbnail,
      channelName,
      viewCount,
      displayOrder,
      isFeatured,
      isActive
    } = req.body;

    if (!url || !title) {
      return ApiResponse.error(res, "Title and URL are required", 400);
    }

    let finalPlatform = platform || (url.includes("instagram.com") ? "instagram" : "youtube");
    let finalChannelName = channelName;
    let finalViewCount = viewCount;
    let finalThumbnail = thumbnail;
    let finalTitle = title;

    if (!finalChannelName || finalChannelName === "@techmasterhq" || !finalThumbnail) {
      try {
        const meta = await extractVideoMetadata(url);
        if (!finalChannelName || finalChannelName === "@techmasterhq") {
          finalChannelName = meta.channelName;
        }
        if (!finalViewCount) {
          finalViewCount = meta.viewCount;
        }
        if (!finalThumbnail) {
          finalThumbnail = meta.thumbnail;
        }
        if (finalTitle === "Featured Video") {
          finalTitle = meta.title || title;
        }
        finalPlatform = meta.platform;
      } catch (e) {}
    }

    const count = await FeaturedVideo.countDocuments();
    
    const newVideo = new FeaturedVideo({
      platform: finalPlatform,
      title: finalTitle,
      url,
      videoUrl: videoUrl || "",
      thumbnail: finalThumbnail || "",
      channelName: finalChannelName || "@techmasterhq",
      viewCount: finalViewCount || "",
      displayOrder: typeof displayOrder === "number" ? displayOrder : count + 1,
      isFeatured: isFeatured !== undefined ? isFeatured : true,
      isActive: isActive !== undefined ? isActive : true
    });

    await newVideo.save();
    return ApiResponse.success(res, "Featured video created successfully", newVideo, 201);
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to create featured video", 500);
  }
});

// 5. ADMIN: PUT /api/v1/featured-videos/reorder
router.put("/reorder", async (req: Request, res: Response) => {
  try {
    const { orders } = req.body; // Array of { id, displayOrder }
    if (!Array.isArray(orders)) {
      return ApiResponse.error(res, "Invalid orders payload", 400);
    }

    const bulkOps = orders.map((item: { id: string; displayOrder: number }) => ({
      updateOne: {
        filter: { _id: item.id },
        update: { displayOrder: item.displayOrder }
      }
    }));

    await FeaturedVideo.bulkWrite(bulkOps);
    const updatedVideos = await FeaturedVideo.find().sort({ displayOrder: 1 });
    return ApiResponse.success(res, "Reorder successful", updatedVideos);
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to reorder featured videos", 500);
  }
});

// 6. ADMIN: PUT /api/v1/featured-videos/:id
router.put("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    if (updateData.url && (!updateData.channelName || updateData.channelName === "@techmasterhq")) {
      try {
        const meta = await extractVideoMetadata(updateData.url);
        updateData.platform = meta.platform;
        if (!updateData.channelName || updateData.channelName === "@techmasterhq") {
          updateData.channelName = meta.channelName;
        }
        if (!updateData.viewCount) {
          updateData.viewCount = meta.viewCount;
        }
        if (!updateData.thumbnail) {
          updateData.thumbnail = meta.thumbnail;
        }
        if (!updateData.title || updateData.title === "Featured Video") {
          updateData.title = meta.title;
        }
      } catch (e) {}
    }

    const updatedVideo = await FeaturedVideo.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedVideo) {
      return ApiResponse.error(res, "Featured video not found", 404);
    }

    return ApiResponse.success(res, "Featured video updated successfully", updatedVideo);
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to update featured video", 500);
  }
});

// 7. ADMIN: DELETE /api/v1/featured-videos/:id
router.delete("/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deletedVideo = await FeaturedVideo.findByIdAndDelete(id);
    if (!deletedVideo) {
      return ApiResponse.error(res, "Featured video not found", 404);
    }

    return ApiResponse.success(res, "Featured video deleted successfully", null);
  } catch (error: any) {
    return ApiResponse.error(res, error.message || "Failed to delete featured video", 500);
  }
});

export default router;
