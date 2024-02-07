import connectDb from "../../utils/mongoose";
import Song from "../../../models/Song";
import { NextResponse } from 'next/server';

connectDb();

export async function GET() {
    try {
        const songs = await Song.find({});
        return NextResponse.json(songs);
    } catch (error) {
        console.error("error al obtener las canciones", error.message)
        return NextResponse.error('Error interno el servidor', 500);
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const newSong = new Song(body);
        const savedSong = await newSong.save();
        return NextResponse.json(savedSong);
    } catch (error) {
        return NextResponse.json(error.message, {
            status: 400,
        })
    }
}


