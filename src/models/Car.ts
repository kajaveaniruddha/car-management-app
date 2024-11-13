import mongoose, { Schema, Document } from "mongoose";

export interface ICars extends Document {
  userId: string | undefined;
  title: string;
  description: string;
  tags: string[];
  images: string[];
}
const CarSchema: Schema<ICars> = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: String,
  description: String,
  tags: [String],
  images: [String], // URLs of images stored in Vercel Blob
});

export default mongoose.models.Car || mongoose.model("Car", CarSchema);
