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
export async function GET(_request: Request) {
    // Do whatever you want
    return new Response('Healthy!', {
      status: 200,
    });
  }