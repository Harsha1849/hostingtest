import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // First check if the favorite belongs to the user
    const favorite = await prisma.favorite.findUnique({
      where: { id: params.id },
    });

    if (!favorite) {
      return NextResponse.json(
        { error: 'Favorite not found' },
        { status: 404 }
      );
    }

    if (favorite.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 403 }
      );
    }

    await prisma.favorite.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: 'Favorite deleted successfully' });
  } catch (error) {
    console.error('Error deleting favorite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import prisma from '@/lib/prisma';

// export async function DELETE(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
//     }

//     // First check if the favorite belongs to the user
//     const favorite = await prisma.favorite.findUnique({
//       where: { id: params.id },
//     });

//     if (!favorite) {
//       return NextResponse.json(
//         { error: 'Favorite not found' },
//         { status: 404 }
//       );
//     }

//     if (favorite.userId !== session.user.id) {
//       return NextResponse.json(
//         { error: 'Unauthorized' },
//         { status: 403 }
//       );
//     }

//     await prisma.favorite.delete({
//       where: { id: params.id },
//     });

//     return NextResponse.json({ message: 'Favorite deleted successfully' });
//   } catch (error) {
//     console.error('Error deleting favorite:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// } 