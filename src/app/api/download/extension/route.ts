import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET(request: NextRequest) {
  try {
    // Path to the extension ZIP in public folder
    // You need to manually copy AdBlock-Pro-YouTube.zip to public/downloads/
    const zipPath = path.join(process.cwd(), 'public', 'downloads', 'AdBlock-Pro-YouTube.zip');
    
    // Check if file exists
    if (!fs.existsSync(zipPath)) {
      return NextResponse.json(
        { error: 'Extension file not found' },
        { status: 404 }
      );
    }

    // Read the file
    const fileBuffer = fs.readFileSync(zipPath);

    // Return the file
    return new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': 'attachment; filename="AdBlock-Pro-YouTube.zip"',
        'Cache-Control': 'public, max-age=86400',
      }
    });
  } catch (error) {
    console.error('Download extension error:', error);
    return NextResponse.json(
      { error: 'Failed to download extension' },
      { status: 500 }
    );
  }
}
