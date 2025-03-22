import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { writeFile } from 'fs/promises';
import { join } from 'path';
import { unlink } from 'fs/promises';

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const formData = await request.formData();
    const files = formData.getAll('files') as File[];

    const urls = await Promise.all(
      files.map(async (file) => {
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Create a unique filename
        const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const filename = `property-${uniqueSuffix}${file.name.substring(file.name.lastIndexOf('.'))}`;
        
        // Save to public/uploads directory
        const path = join(process.cwd(), 'public', 'uploads', filename);
        await writeFile(path, buffer);
        
        // Return the URL that can be used to access the file
        return `/uploads/${filename}`;
      })
    );

    return NextResponse.json({ urls });
  } catch (error) {
    console.error('Error uploading images:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { url } = body;

    // Extract filename from URL
    const filename = url.split('/').pop();
    
    if (filename) {
      const path = join(process.cwd(), 'public', 'uploads', filename);
      await unlink(path).catch(() => {
        // Ignore errors if file doesn't exist
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting image:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
    // if (!session) {
    //   return new NextResponse('Unauthorized', { status: 401 });
    // }

    // const body = await request.json();
    // const { url } = body;

    // // Extract filename from URL
    // const filename = url.split('/').pop();
    
    // if (filename) {
    //   const path = join(process.cwd(), 'public', 'uploads', filename);
    //   await unlink(path).catch(() => {
    //     // Ignore errors if file doesn't exist
    //   });
    // }

//     return NextResponse.json({ success: true });
//   } catch (error) {
//     console.error('Error deleting image:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// } 