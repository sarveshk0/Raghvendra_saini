import { v2 as cloudinary } from "cloudinary";
import { NextResponse } from "next/server";

// Configure Cloudinary server-side
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { file } = body;

    if (!file) {
      return NextResponse.json({ error: "No image file payload provided" }, { status: 400 });
    }

    // Graceful fallback if Cloudinary credentials are not configured
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    if (!cloudName || !apiKey || !apiSecret) {
      console.warn("⚠️ Cloudinary credentials missing in .env.local. Falling back to base64 URL.");
      return NextResponse.json({
        url: file, // Return the input base64 string as a local fallback
        warning: "Cloudinary credentials are not configured. Saved locally as base64 string."
      });
    }

    // Upload base64 string to Cloudinary securely
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder: "raghvendra-saini",
      resource_type: "auto",
    });

    console.log(`✅ Uploaded image successfully to Cloudinary: ${uploadResult.secure_url}`);

    return NextResponse.json({
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id
    });

  } catch (error) {
    console.error("❌ Cloudinary upload API error:", error);
    return NextResponse.json({ error: error.message || "Failed to upload image" }, { status: 500 });
  }
}
