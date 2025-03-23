import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import prisma from '@/lib/prisma';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Return all properties for all authenticated users
    const properties = await prisma.property.findMany({
      orderBy: {
        createdAt: 'desc'
      },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
          },
        },
      },
    });

    return NextResponse.json(properties);
  } catch (error) {
    console.error('Error fetching properties:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // Only allow owner to create properties
    if (!session.user.isOwner) {
      return new NextResponse('Forbidden - Only the owner can create properties', { status: 403 });
    }

    const body = await request.json();
    const {
      title,
      description,
      price,
      bedrooms,
      bathrooms,
      area,
      address,
      city,
      state,
      zipCode,
      type,
      status,
      images,
      features,
    } = body;

    // Validate required fields
    if (!title || !price || !address || !city || !state || !zipCode) {
      return new NextResponse('Missing required fields', { status: 400 });
    }

    const property = await prisma.property.create({
      data: {
        title,
        description: description || '',
        price: parseFloat(price),
        bedrooms: bedrooms ? parseInt(bedrooms) : 0,
        bathrooms: bathrooms ? parseInt(bathrooms) : 0,
        area: area ? parseFloat(area) : 0,
        address,
        city,
        state,
        zipCode,
        type: type || 'house',
        status: status || 'available',
        images: images || [],
        features: features || [],
        userId: session.user.id,
      },
    });

    return NextResponse.json(property);
  } catch (error) {
    console.error('Error creating property:', error);
    return new NextResponse(`Error creating property: ${error.message}`, { status: 500 });
  }
} 