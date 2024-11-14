import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import CarModel from '@/models/Car';
import { getServerSession } from 'next-auth';
import { authOptions } from "../auth/[...nextauth]/options";

export async function GET(request: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not Authenticated.' },
      { status: 401 }
    );
  }

  await dbConnect();

  try {
    const cars = await CarModel.find({ userId: session.user._id });
    return NextResponse.json({ success: true, cars }, { status: 200 });
  } catch (error) {
    console.error('Error fetching cars:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to fetch cars.' },
      { status: 500 }
    );
  }
}


/**
 * @swagger
 * /api/list-cars:
 *   get:
 *     summary: Get all cars for the authenticated user
 *     description: Fetches all cars associated with the authenticated user.
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successfully fetched cars
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 cars:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       userId:
 *                         type: string
 *                       title:
 *                         type: string
 *                       description:
 *                         type: string
 *                       tags:
 *                         type: array
 *                         items:
 *                           type: string
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *       401:
 *         description: Not authenticated
 *       500:
 *         description: Unexpected error
 */
