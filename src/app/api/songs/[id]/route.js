import connectDb from '../../../utils/mongoose';
import { NextResponse } from 'next/server';
import Song from '../../../../models/Song';

export async function DELETE(request, {params}) {
    
    connectDb();

    try {
        const deletedSong = await Song.findByIdAndDelete(params.id);
        if (!deletedSong)
            return NextResponse.json(
        {
          message: "Task not found",
        },
        {
          status: 404,
        }
      );
      return NextResponse.json(deletedSong);
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400,
        });
    }
}