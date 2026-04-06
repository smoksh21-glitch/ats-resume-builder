import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Read file content
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    let resumeText = '';

    // For PDF files, we send as base64 to Claude
    // For DOCX files, extract text
    if (file.type === 'application/pdf') {
      // Use pdf-parse for text extraction
      try {
        const pdfParse = require('pdf-parse');
        const data = await pdfParse(buffer);
        resumeText = data.text;
      } catch (e) {
        // Fallback: send buffer info
        resumeText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ').trim();
      }
    } else {
      // For DOCX, use mammoth
      try {
        const mammoth = require('mammoth');
        const result = await mammoth.extractRawText({ buffer });
        resumeText = result.value;
      } catch (e) {
        resumeText = buffer.toString('utf-8').replace(/[^\x20-\x7E\n]/g, ' ').trim();
      }
    }

    if (!resumeText || resumeText.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract text from resume. Please ensure the file is not image-only.' },
        { status: 400 }
      );
    }

    // Analyze with Claude
    const message = await anthropic.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 2000,
      messages: [
        {
          role: 'user',
          content: `You are an expert ATS (Applicant Tracking System) resume analyzer. Analyze the following resume text and provide a detailed ATS compatibility assessment.

RESUME TEXT:
---
${resumeText.substring(0, 5000)}
---

Respond in this exact JSON format (no markdown, no code blocks, just raw JSON):
{
  "score": <number 0-100>,
  "categories": [
    {"name": "Formatting & Structure", "score": <0-100>},
    {"name": "Keywords & Skills", "score": <0-100>},
    {"name": "Work Experience", "score": <0-100>},
    {"name": "Education", "score": <0-100>},
    {"name": "Contact Information", "score": <0-100>},
    {"name": "ATS Compatibility", "score": <0-100>}
  ],
  "issues": [
    {
      "title": "<issue title>",
      "description": "<detailed description>",
      "severity": "<critical|warning|info>",
      "fix": "<how to fix this>"
    }
  ],
  "suggestions": [
    "<specific actionable suggestion to improve ATS score>"
  ],
  "summary": "<2-3 sentence summary of the resume's ATS readiness>"
}

Be thorough but fair. Check for:
- Proper section headings (Experience, Education, Skills, etc.)
- Contact information completeness
- Use of action verbs and quantified achievements
- Relevant keywords for the apparent target role
- ATS-unfriendly elements (tables, images, headers/footers, fancy formatting)
- Proper date formatting
- Consistent formatting
- Appropriate length
- Skills section presence and relevance

The score should reflect real ATS compatibility. Most unoptimized resumes score 30-60.`,
        },
      ],
    });

    // Parse Claude's response
    const responseText = message.content[0].text;
    let analysisResult;

    try {
      // Try to parse JSON directly
      analysisResult = JSON.parse(responseText);
    } catch (e) {
      // Try to extract JSON from the response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysisResult = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    return NextResponse.json(analysisResult);
  } catch (error) {
    console.error('Resume analysis error:', error);
    return NextResponse.json(
      { error: 'Failed to analyze resume. Please try again.' },
      { status: 500 }
    );
  }
}
