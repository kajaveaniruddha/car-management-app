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
  } catch (error) {
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

/**
 * @swagger
 * /api/add-car:
 *   post:
 *     summary: Add a new car
 *     description: Adds a new car to the authenticated user's collection.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 description: Title of the car
 *               description:
 *                 type: string
 *                 description: Description of the car
 *               tags:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Tags associated with the car
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Image URLs of the car (max 10 images)
 *     responses:
 *       201:
 *         description: Car added successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Unexpected error
 */
