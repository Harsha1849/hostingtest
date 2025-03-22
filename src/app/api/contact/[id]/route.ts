import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const { status } = body;

    // Verify that the user owns the property associated with this contact request
    const contactRequest = await prisma.contactRequest.findUnique({
      where: { id: params.id },
      include: {
        property: {
          select: {
            userId: true,
          },
        },
      },
    });

    if (!contactRequest) {
      return new NextResponse('Contact request not found', { status: 404 });
    }

    if (contactRequest.property.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const updatedRequest = await prisma.contactRequest.update({
      where: { id: params.id },
      data: { status },
    });

    return NextResponse.json(updatedRequest);
  } catch (error) {
    console.error('Error updating contact request:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

// import { NextResponse } from 'next/server';
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import prisma from '@/lib/prisma';

// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const body = await request.json();
//     const { status } = body;

//     // Verify that the user owns the property associated with this contact request
//     const contactRequest = await prisma.contactRequest.findUnique({
//       where: { id: params.id },
//       include: {
//         property: {
//           select: {
//             userId: true
//           }
//         }
//       }
//     });

//     if (!contactRequest) {
//       return new NextResponse('Contact request not found', { status: 404 });
//     }

//     if (contactRequest.property.userId !== session.user.id) {
//       return new NextResponse('Forbidden', { status: 403 });
//     }

//     const updatedRequest = await prisma.contactRequest.update({
//       where: { id: params.id },
//       data: { status },
//     });

//     return NextResponse.json(updatedRequest);
//   } catch (error) {
//     console.error('Error updating contact request:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// } 
// import { getServerSession } from 'next-auth';
// import { authOptions } from '@/lib/auth';
// import prisma from '@/lib/prisma';

// export async function PATCH(
//   request: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);
    
//     if (!session) {
//       return new NextResponse('Unauthorized', { status: 401 });
//     }

//     const body = await request.json();
//     const { status } = body;

//     // Verify that the user owns the property associated with this contact request
//     const contactRequest = await prisma.contactRequest.findUnique({
//       where: { id: params.id },
//       include: {
//         property: {
//           select: {
//             userId: true
//           }
//         }
//       }
//     });

//     if (!contactRequest) {
//       return new NextResponse('Contact request not found', { status: 404 });
//     }

//     if (contactRequest.property.userId !== session.user.id) {
//       return new NextResponse('Forbidden', { status: 403 });
//     }

//     const updatedRequest = await prisma.contactRequest.update({
//       where: { id: params.id },
//       data: { status },
//     });

//     return NextResponse.json(updatedRequest);
//   } catch (error) {
//     console.error('Error updating contact request:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// } 