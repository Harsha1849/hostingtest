import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get all properties owned by the user
    const userProperties = await prisma.property.findMany({
      where: {
        userId: session.user.id,
      },
      select: {
        id: true,
      },
    });

    const propertyIds = userProperties.map(prop => prop.id);

    // Get all contact requests for the user's properties
    const contactRequests = await prisma.contactRequest.findMany({
      where: {
        propertyId: {
          in: propertyIds,
        },
      },
      include: {
        property: {
          select: {
            title: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(contactRequests);
  } catch (error) {
    console.error('Error fetching contact requests:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, message, preferredDate, preferredTime, propertyId } = body;

    // Validate required fields
    if (!name || !email || !phone || !preferredDate || !preferredTime || !propertyId) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Convert date string to ISO DateTime
    const [hours, minutes] = preferredTime.split(':');
    const dateTime = new Date(preferredDate);
    dateTime.setHours(parseInt(hours, 10), parseInt(minutes, 10));

    // Create the contact request
    const contactRequest = await prisma.contactRequest.create({
      data: {
        name,
        email,
        phone,
        message: message || '',
        preferredDate: dateTime,
        preferredTime,
        status: 'PENDING',
        propertyId,
      },
    });

    return NextResponse.json(contactRequest);
  } catch (error) {
    console.error('Error creating contact request:', error);
    return NextResponse.json(
      { error: 'Failed to create contact request' },
      { status: 500 }
    );
  }
}