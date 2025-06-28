import { NextResponse, NextRequest } from 'next/server';
import { Types } from 'mongoose';
import dbConnect from '../../../../../../dbConnect';
import Batches from '../../../../../../modals/Batches';

export async function GET(req: NextRequest, { params }: { params: Promise<{ CorId: string }> }) {
  try {
    const { CorId } = await params;

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(CorId)) {
      return NextResponse.json({ error: 'Invalid course ID' }, { status: 400 });
    }

    await dbConnect();

    const now = new Date();
    const upcomingBatches = await Batches.find({
      courseId: CorId,
      startDate: { $gte: now },
    })
      .sort({ startDate: 1 }); 

    return NextResponse.json({ batchByCorId: upcomingBatches }, { status: 200 });
  } catch (err: any) {
    console.error('Error fetching upcoming batches:', err.message);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
