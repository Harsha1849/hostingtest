import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!property) {
      return new NextResponse('Property not found', { status: 404 });
    }

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error fetching property:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const property = await prisma.property.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!property) {
      return new NextResponse('Property not found', { status: 404 });
    }

    if (property.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    await prisma.property.delete({
      where: { id: params.id },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting property:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const body = await request.json();
    const property = await prisma.property.findUnique({
      where: { id: params.id },
      select: { userId: true }
    });

    if (!property) {
      return new NextResponse('Property not found', { status: 404 });
    }

    if (property.userId !== session.user.id) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    // Parse numeric values
    const updatedData = {
      ...body,
      price: parseFloat(body.price),
      bedrooms: parseInt(body.bedrooms),
      bathrooms: parseInt(body.bathrooms),
      area: parseFloat(body.area),
    };

    const updatedProperty = await prisma.property.update({
      where: { id: params.id },
      data: updatedData,
    });

    return NextResponse.json(updatedProperty);
  } catch (error) {
    console.error('Error updating property:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 
//     });

//     return NextResponse.json(updatedProperty);
//   } catch (error) {
//     console.error('Error updating property:', error);
//     return new NextResponse('Internal Server Error', { status: 500 });
//   }
// } 