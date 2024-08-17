import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import connectDB from '../../../db/index';

interface Data {
    title: string;
    description: string;
    h1: string;
}

const DataSchema = new mongoose.Schema<Data>({
    title: { type: String, required: true },
    description: { type: String, required: true },
    h1: { type: String, required: true },
});

const Data = mongoose.models.Data || mongoose.model<Data>('Data', DataSchema);

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const url = searchParams.get('url');
    
        if (!url) {
            return NextResponse.json({ error: 'URL parameter is required' }, { status: 400 });
        }
    
        // Connect to the database
        await connectDB();
    
        // Scrape the page
        const response = await axios.get(url);
        const $ = cheerio.load(response.data);
        const title = $('title').text();
        const description = $('meta[name="description"]').attr('content') || '';
        const h1 = $('h1').text() || '';
    
        // Save the scraped data to the database
        const newData = new Data({ title, description, h1 });
        await newData.save();
    
        // Return the scraped data
        return NextResponse.json({ title, description, h1 });
    } catch (error) {
        console.error('Error:', error);
        return NextResponse.json({ error: 'Failed to process the request' }, { status: 500 });
    }
}