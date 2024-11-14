import { NextRequest, NextResponse } from "next/server";

/**
 * @swagger
 * /api/health:
 *   get:
 *     description: Returns the server is healthy or unhealthy
 *     responses:
 *       200:
 *         description: Healthy!
 *       400:
 *         description: Unhealthy!
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json(
      { success: true, message: "healthy" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Server unhealthy", error);
    return NextResponse.json(
      { success: false, message: "unhealthy" },
      { status: 500 }
    );
  }
}
