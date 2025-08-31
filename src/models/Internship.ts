//models/Internship.ts
import mongoose, { Schema, Document, model, models } from 'mongoose';
export interface Internship extends Document {
title: string;
firmName: string;
location?: string;
stipend?: string;
startDate?: Date | null;
durationWeeks?: number;
roleDescription?: string;
responsibilities?: string[];
requirements?: string[];
applyBy?: Date | null;
contactEmail?: string;
createdAt: Date;
}


const InternshipSchema = new Schema<Internship>({
title: { type: String, required: true },
firmName: { type: String, required: true },
location: String,
stipend: String,
startDate: Date,
durationWeeks: Number,
roleDescription: String,
responsibilities: [String],
requirements: [String],
applyBy: Date,
contactEmail: String,
createdAt: { type: Date, default: () => new Date() },
});


export default models.Internship || model<Internship>('Internship', InternshipSchema);