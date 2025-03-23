import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        address: true,
        bio: true,
      },
    });

    if (!profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error fetching profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    
    // Only allow updating specific fields
    const allowedFields = ['name', 'phone', 'address', 'bio'];
    const updateData = Object.keys(data)
      .filter(key => allowedFields.includes(key))
      .reduce((obj, key) => {
        obj[key] = data[key];
        return obj;
      }, {} as Record<string, string | null>);

    const profile = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        image: true,
        phone: true,
        address: true,
        bio: true,
      },
    });

    return NextResponse.json(profile);
  } catch (error) {
    console.error('Error updating profile:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import prisma from '@/lib/prisma';

// export async function GET() {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const profile = await prisma.user.findUnique({
//       where: { id: session.user.id },
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         image: true,
//         phone: true,
//         address: true,
//         bio: true,
//       },
//     });

//     if (!profile) {
//       return NextResponse.json(
//         { error: 'Profile not found' },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json(profile);
//   } catch (error) {
//     console.error('Error fetching profile:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// }

// export async function PUT(request: Request) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     const data = await request.json();
    
//     // Only allow updating specific fields
//     const allowedFields = ['name', 'phone', 'address', 'bio'];
//     const updateData = Object.keys(data)
//       .filter(key => allowedFields.includes(key))
//       .reduce((obj, key) => {
//         obj[key] = data[key];
//         return obj;
//       }, {} as any);

//     const profile = await prisma.user.update({
//       where: { id: session.user.id },
//       data: updateData,
//       select: {
//         id: true,
//         name: true,
//         email: true,
//         image: true,
//         phone: true,
//         address: true,
//         bio: true,
//       },
//     });

//     return NextResponse.json(profile);
//   } catch (error) {
//     console.error('Error updating profile:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// } 