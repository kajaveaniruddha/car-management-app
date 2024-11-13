// app/api/cars/route.ts

import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import CarModel from "@/models/Car";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { z } from "zod";

const addCarSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  tags: z.array(z.string()).optional(),
  images: z
    .array(z.string())
    .max(10, "Maximum of 10 images allowed")
    .optional(),
});

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated." },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const cars = await CarModel.find({ userId: session.user._id });
    return NextResponse.json({ success: true, cars }, { status: 200 });
  } catch (error) {
    console.error("Error fetching cars:", error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch cars." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated." },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const body = await request.json();
    const { title, description, tags, images } = addCarSchema.parse(body);

    const newCar = await CarModel.create({
      userId: session.user._id,
      title,
      description,
      tags,
      images,
    });

    return NextResponse.json(
      { success: true, message: "Car added successfully.", car: newCar },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error adding car:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors.map((e) => e.message).join(", "),
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { success: false, message: "An unexpected error occurred." },
      { status: 500 }
    );
  }
}
