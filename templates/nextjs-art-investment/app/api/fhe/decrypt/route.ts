import { NextRequest, NextResponse } from 'next/server';

/**
 * Decryption API Route
 * Handles decryption of encrypted values using FHEVM SDK
 * Supports both user-specific and public decryption
 */
export async function POST(request: NextRequest) {
  try {
    const { handle, contractAddress, signature, publicDecrypt = false } = await request.json();

    // Validate inputs
    if (!handle || !contractAddress) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: handle, contractAddress'
        },
        { status: 400 }
      );
    }

    if (!publicDecrypt && !signature) {
      return NextResponse.json(
        {
          success: false,
          error: 'Signature required for user-specific decryption'
        },
        { status: 400 }
      );
    }

    // In a real implementation, you would use FHEVM SDK here
    // This is a placeholder that shows the expected API structure
    const decryptedData = {
      value: 'decrypted-value',
      handle,
      contractAddress,
      decryptionType: publicDecrypt ? 'public' : 'user',
      timestamp: Date.now()
    };

    return NextResponse.json({
      success: true,
      data: decryptedData
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : 'Decryption failed'
      },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  return NextResponse.json({
    success: true,
    message: 'Decryption endpoint ready',
    usage: {
      method: 'POST',
      body: {
        handle: 'encrypted handle',
        contractAddress: 'contract address',
        signature: 'EIP-712 signature (for user decrypt)',
        publicDecrypt: 'boolean (optional)'
      }
    }
  });
}
