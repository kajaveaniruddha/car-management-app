import { put } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';

export async function POST(request: Request): Promise<NextResponse> {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  if (!filename) {
    return NextResponse.json(
      { success: false, message: 'Filename is required.' },
      { status: 400 }
    );
  }

  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    return NextResponse.json(
      { success: false, message: 'Not Authenticated.' },
      { status: 401 }
    );
  }

  const body = request.body;
  if (!body) {
    return NextResponse.json(
      { success: false, message: 'No file provided.' },
      { status: 400 }
    );
  }

  try {
    const blob = await put(filename, body, {
      access: 'public',
    });

    return NextResponse.json(blob, { status: 200 });
  } catch (error) {
    console.error('Error uploading to Vercel Blob:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to upload image.' },
      { status: 500 }
    );
  }
}
