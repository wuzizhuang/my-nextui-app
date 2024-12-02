import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

export async function GET() {
  const filePath = path.join(process.cwd(), 'content/docs/introduction.mdx');
  const content = fs.readFileSync(filePath, 'utf8');
  
  return new NextResponse(content);
} 