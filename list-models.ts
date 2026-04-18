
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const apiKey = process.env.VITE_GEMINI_API_KEY;

if (!apiKey) {
    console.error('API Key missing');
    process.exit(1);
}

const genAI = new GoogleGenAI({ apiKey });

async function listModels() {
    try {
        const models = await genAI.models.list();
        console.log('Available Models:');
        models.forEach(m => console.log(`- ${m.name} (${m.displayName})`));
    } catch (error) {
        console.error('Error listing models:', error);
    }
}

listModels();
