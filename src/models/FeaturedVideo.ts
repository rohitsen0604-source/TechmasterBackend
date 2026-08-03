import mongoose, { Schema, Document } from "mongoose";

export interface IFeaturedVideo extends Document {
  platform: "youtube" | "instagram";
  title: string;
  url: string;
  videoUrl?: string;
  thumbnail?: string;
  channelName: string;
  viewCount?: string;
  displayOrder: number;
  isFeatured: boolean;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const FeaturedVideoSchema: Schema = new Schema(
  {
    platform: {
      type: String,
      enum: ["youtube", "instagram"],
      required: true,
      default: "youtube"
    },
    title: {
      type: String,
      required: true,
      trim: true
    },
    url: {
      type: String,
      required: true,
      trim: true
    },
    videoUrl: {
      type: String,
      default: ""
    },
    thumbnail: {
      type: String,
      default: ""
    },
    channelName: {
      type: String,
      required: true,
      default: "@techmasterhq"
    },
    viewCount: {
      type: String,
      default: ""
    },
    displayOrder: {
      type: Number,
      default: 0
    },
    isFeatured: {
      type: Boolean,
      default: true
    },
    isActive: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

export const FeaturedVideo = mongoose.model<IFeaturedVideo>(
  "FeaturedVideo",
  FeaturedVideoSchema
);
