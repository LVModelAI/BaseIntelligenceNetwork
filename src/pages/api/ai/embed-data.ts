import fs from 'fs';
import mammoth from 'mammoth';
import { type NextApiRequest, type NextApiResponse } from 'next';
import path from 'path';
import pdf from 'pdf-parse';

import { embedTexts, generateChunks, storeEmbeddings } from '~/utils';

//   async function extractTextsFromPDF(filePath: string) {
//     const dataBuffer = fs.readFileSync(filePath);
//     const pdfData = await pdfParse(dataBuffer);
//     return pdfData.text; // Contains the extracted text
//   }


// Function to extract text from PDF buffer
async function extractTextFromPDF(buffer: Buffer) {
    try {
        const data = await pdf(buffer);
        return data.text;
    } catch (error) {
        console.error('Error extracting text from PDF:', error);
        throw new Error('Error extracting text from PDF');
    }
}

// Function to extract text from DOCX buffer
async function extractTextFromDocx(buffer: Buffer) {
    try {
        const { value } = await mammoth.extractRawText({ buffer });
        return value;
    } catch (error) {
        console.error('Error extracting text from DOCX:', error);
        throw new Error('Error extracting text from DOCX');
    }
}

async function readFilesFromFolder() {
    try {
        console.log("Fetching files...");
        const folderPath = path.join(process.cwd(), 'public', 'db');
        const files = fs.readdirSync(folderPath);
        const docFiles = files.filter(file => file.endsWith('.pdf') || file.endsWith('.docx'));
        console.log("File fetched", docFiles);
    
        console.log("fetching content...")
        const fileContents = await Promise.all(docFiles.map(async (file) => {
            const filePath = path.join(folderPath, file);
            const buffer = await fs.promises.readFile(filePath);
            const extension = path.extname(file).toLowerCase();
    
            if (extension === '.pdf') {
                return await extractTextFromPDF(buffer);
            } else if (extension === '.docx') {
                return await extractTextFromDocx(buffer);
            }
            return '';
        }));
    
        console.log("content fetched")
    
        return fileContents.filter(content => content);
        
    } catch (error) {
        console.error('Error reading files from folder:', error);
        throw error;
    }
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if(req.method === "GET") {
        try {
            if(process.env.NEXT_PUBLIC_NODE_ENV === "development") {
                // keep pdf files in public/db folder
                const pdfTexts = (await readFilesFromFolder()).join("\n\n");
                console.log(pdfTexts, "combineContent")
    
                // Store content in Supabase and Pinecone
                const pdfChunks = generateChunks(pdfTexts);
                const embeddings = await embedTexts(pdfChunks)
                await storeEmbeddings(embeddings);
                // res.status(200).json({success: true, message: `you are in ${process.env.NEXT_PUBLIC_NODE_ENV} mode`})
                res.status(200).json({message: `Data embedded!`, success: true})
            } else {
                res.status(400).json({ message: `you can't embed data, contact developers`, success: false })
            }
        } catch (error: any) {
            console.error("Error during streaming:", error);
            res.status(error.response?.status || 500).json({ message: error.message, success:false });
        }
    } else {
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}