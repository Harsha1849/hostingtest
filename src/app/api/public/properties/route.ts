import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit') as string, 10) : undefined;

    const properties = await prisma.property.findMany({
      where: { status: 'available' },
      orderBy: { createdAt: 'desc' },
      take: limit,
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
    console.error('Error fetching public properties:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
}
