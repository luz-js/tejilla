import mongoose from "mongoose"
import { Schema } from "mongoose";

const SongSchema = new Schema({
    title: { type: String, required: true },
    escritor: { type: String, required: true },
    urlCancion: String,
}, {
    timestamps: true,
});

const Song = mongoose.models.Song || mongoose.model('Song', SongSchema);
export default Song;