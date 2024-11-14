// app/api/cars/[id]/route.ts

import { del } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import dbConnect from "@/lib/dbConnect";
import CarModel from "@/models/Car";
import { z } from "zod";
import { authOptions } from "../../auth/[...nextauth]/options";

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
): Promise<NextResponse> {
  const { id } = await params;

  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user._id) {
    return NextResponse.json(
      { success: false, message: "Not Authenticated." },
      { status: 401 }
    );
  }

  const userId = session.user._id;

  await dbConnect();

  try {
    // Find the car by ID
    const car = await CarModel.findById(id);

    if (!car) {
      return NextResponse.json(
        { success: false, message: "Car not found." },
        { status: 404 }
      );
    }

    // Check if the authenticated user owns the car
    if (car.userId.toString() !== userId.toString()) {
      return NextResponse.json(
        { success: false, message: "Unauthorized." },
        { status: 403 }
      );
    }

    // Delete images from Vercel Blob
    if (car.images && car.images.length > 0) {
      const deletePromises = car.images.map(async (imageUrl: string) => {
        try {
          await del(imageUrl);
        } catch (err) {
          console.error(
            `Failed to delete blob for image URL ${imageUrl}:`,
            err
          );
          // Optionally, you can handle individual deletion failures here
        }
      });

      await Promise.all(deletePromises);
    }

    // Delete the car document from the database
    await CarModel.findByIdAndDelete(id);

    return NextResponse.json(
      { success: true, message: "Car deleted successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error deleting car:", error);
    return NextResponse.json(
      { success: false, message: "Failed to delete car." },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/delete-car/{id}:
 *   delete:
 *     summary: Delete a car by ID
 *     description: Deletes a specific car by ID if the authenticated user is authorized.
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: The ID of the car to delete
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Car deleted successfully
 *       401:
 *         description: Not authenticated
 *       403:
 *         description: Unauthorized
 *       404:
 *         description: Car not found
 *       500:
 *         description: Unexpected error
 */
