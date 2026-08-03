import { Router } from "express";
import { Homepage } from "../models/Homepage";
import { CMSData } from "../models/CMSData";
import { ApiResponse } from "../utils/apiResponse";
import { authenticate } from "../middlewares/auth";
import { homepageController } from "../controllers";
import { createCmsRouter } from "./cmsRouterHelper";

const router = Router();

const defaultHomepageData = {
  hero: {
    badge: 'TECH MASTER',
    topBadgeText: "India's most-watched media production house",
    mainHeading: 'TECH MASTER',
    highlightedWord: 'MASTER',
    tagline: '"Nothing We Make Is Forgettable. Unskippable. Unforgettable."',
    subTagline: 'Attention and Influence — At Scale',
    primaryCtaText: 'Scroll down',
    primaryCtaLink: '#intro'
  },
  introVision: {
    introBadge: 'INTRO',
    introHeading: 'Building High-Scale Media Channels',
    introDescription: 'Tech Master Digital Pvt Ltd builds and runs a portfolio of high-scale content channels across tech, automobiles, and entertainment. We take complex subjects and make them impossible to scroll past. Combining editorial rigor with production value that stands out.',
    visionBadge: 'THE VISION',
    visionHeading: 'Complexity Made Simple & Unforgettable',
    visionDescription: 'Tech Master exists to make complexity feel simple, and simplicity feel unforgettable. We tell stories that inform without lecturing, entertain without diluting, and connect without pretending. The result: content built to travel across platforms, across formats, across the world.'
  },
  founder: {
    badge: 'ABOUT THE CEO / FOUNDER',
    name: 'Arvind Kharra',
    highlightedName: 'aka Tech Master',
    description: "An engineering graduate from Rajasthan who turned his passion for technology into world's #1 tech YouTube channel. No corporate job, no conventional path. Just a small-town outsider who made technology feel human, fun, and relatable to millions."
  },
  channelsTicker: {
    heading: 'Different audiences.',
    highlightedHeading: 'Same Obsession.',
    subHeading: "We're just getting started / Five channels today. A Media Empire in Motion.",
    channels: [
      { id: 'ch-1', name: 'Tech Master', circleImage: '', logoUrl: '', ytSubs: '33M Subs on YT', igFollowers: '5.8M Followers on IG' },
      { id: 'ch-2', name: 'Next Univerz', circleImage: '', logoUrl: '', ytSubs: '5.5M Subs on YT', igFollowers: '' },
      { id: 'ch-3', name: 'Master Wheels', circleImage: '', logoUrl: '', ytSubs: '4.6M Subs on YT', igFollowers: '1.2M Followers on IG' },
      { id: 'ch-4', name: 'Full Circle', circleImage: '', logoUrl: '', ytSubs: '300K Subs on YT', igFollowers: '' },
      { id: 'ch-5', name: 'Trendz Talk', circleImage: '', logoUrl: '', ytSubs: '', igFollowers: '15K Followers on IG' }
    ]
  },
  coreValues: {
    badge: 'HOW WE MOVE',
    heading: 'Core Values',
    cards: [
      { id: 'cv-1', title: 'Fearless Energy', description: 'Pushing creative boundaries with unyielding momentum and passion.' },
      { id: 'cv-2', title: 'Creative Storytelling', description: 'Crafting narratives that resonate, inform, and inspire millions.' },
      { id: 'cv-3', title: 'Community First', description: 'Building genuine connections and putting our audience at the heart of everything we create.' }
    ]
  },
  statistics: {
    badge: 'GLOBAL REACH & STATISTICS',
    heading: 'Influence & Impact',
    counters: [
      { id: 'st-1', value: '50M+', label: 'Community' },
      { id: 'st-2', value: '1B+', label: 'Monthly Views' },
      { id: 'st-3', value: '2500+', label: 'Videos Published' },
      { id: 'st-4', value: '500K+', label: 'FB Followers' },
      { id: 'st-5', value: '25B+', label: 'Lifetime Views on YT' },
      { id: 'st-6', value: '50+', label: 'Global Brand Collaborations' }
    ]
  },
  brandCollaborations: {
    badge: 'BRAND COLLABORATIONS',
    heading: 'Trusted By Leading Technology Brands',
    description: 'Proud collaborations and partnerships with globally recognized technology brands that have helped shape our educational ecosystem.'
  },
  newsletterContact: {
    newsletterBadge: 'NEWSLETTER SUBSCRIPTION',
    newsletterHeading: 'Stay in the Loop',
    newsletterDescription: 'Join my newsletter for behind-the-scenes content and insights.',
    buttonText: 'Subscribe',
    contactBadge: 'COLLABORATION INQUIRY',
    contactHeading: 'Ready to Collaborate?',
    contactCtaText: 'Get In Touch'
  }
};

// GET Homepage Data
router.get("/", async (req, res, next) => {
  try {
    let cmsDoc = await CMSData.findOne({ key: "homepageCMS" });
    if (!cmsDoc) {
      cmsDoc = await CMSData.create({ key: "homepageCMS", value: defaultHomepageData });
    }
    ApiResponse.success(res, "Homepage data retrieved successfully", cmsDoc.value || defaultHomepageData);
  } catch (err) {
    next(err);
  }
});

// PUT / Update Homepage Data (Protected)
router.put("/", authenticate as any, async (req, res, next) => {
  try {
    const payload = req.body;
    await CMSData.findOneAndUpdate({ key: "homepageCMS" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "homepage" }, { value: payload }, { upsert: true, new: true });
    await CMSData.findOneAndUpdate({ key: "homeData" }, { value: payload }, { upsert: true, new: true });
    
    try {
      await Homepage.findOneAndUpdate({}, payload, { upsert: true, new: true });
    } catch (e) {
      console.warn("Homepage model sync warning:", e);
    }

    ApiResponse.success(res, "Homepage data updated successfully", payload);
  } catch (err) {
    next(err);
  }
});

// Standard router compatibility
const standardCmsRouter = createCmsRouter(homepageController);
router.use("/", standardCmsRouter);

export default router;
