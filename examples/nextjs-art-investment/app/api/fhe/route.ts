import { NextRequest, NextResponse } from 'next/server';

/**
 * Main FHE Operations API Route
 * Handles general FHE operations and information
 */
export async function GET(request: NextRequest) {
  try {
    return NextResponse.json({
      success: true,
      message: 'FHE API is ready',
      endpoints: {
        encrypt: '/api/fhe/encrypt',
        decrypt: '/api/fhe/decrypt',
        compute: '/api/fhe/compute',
        keys: '/api/keys'
      },
      version: '1.0.0'
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    return NextResponse.json({
      success: true,
      message: 'FHE operation completed',
      data: body
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}
