import { NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { resumeData, enhancementType, targetRole } = body;

    if (!resumeData) {
      return NextResponse.json({ error: 'No resume data provided' }, { status: 400 });
    }

    let prompt = '';

    switch (enhancementType) {
      case 'summary':
        prompt = `You are an expert resume writer. Generate a powerful professional summary for the following person's resume that is ATS-optimized.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

${targetRole ? `TARGET ROLE: ${targetRole}` : ''}

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "enhancedSummary": "<2-4 sentence professional summary that is keyword-rich and ATS-optimized>",
  "keywords": ["<relevant keyword 1>", "<relevant keyword 2>", "..."]
}

The summary should:
- Start with years of experience and expertise area
- Include 3-5 relevant industry keywords
- Mention key achievements or skills
- Be written in third person without pronouns
- Be ATS-friendly (no special characters or formatting)`;
        break;

      case 'bullets':
        prompt = `You are an expert resume writer. Enhance the following work experience bullet points to be more impactful and ATS-optimized.

CURRENT EXPERIENCE:
${JSON.stringify(resumeData.experience, null, 2)}

${targetRole ? `TARGET ROLE: ${targetRole}` : ''}

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "enhancedExperience": [
    {
      "company": "<company name>",
      "role": "<role title>",
      "bullets": [
        "<enhanced bullet point starting with strong action verb, including metrics where possible>"
      ]
    }
  ]
}

Each bullet should:
- Start with a strong action verb (Led, Developed, Increased, etc.)
- Include quantified results where possible (%, $, numbers)
- Be relevant to ATS keywords for the target role
- Be 1-2 lines long
- Avoid personal pronouns`;
        break;

      case 'keywords':
        prompt = `You are an ATS keyword optimization expert. Analyze the following resume and suggest keywords that should be added.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

${targetRole ? `TARGET ROLE: ${targetRole}` : ''}

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "missingKeywords": ["<keyword 1>", "<keyword 2>", "..."],
  "existingKeywords": ["<keyword already present 1>", "..."],
  "suggestedSkills": {
    "technical": ["<skill 1>", "..."],
    "soft": ["<skill 1>", "..."],
    "tools": ["<tool 1>", "..."]
  },
  "atsScore": <estimated ATS score 0-100>,
  "recommendations": ["<specific recommendation>", "..."]
}`;
        break;

      case 'full':
        prompt = `You are an expert resume writer and ATS optimization specialist. Completely rewrite and optimize the following resume to score 75+ on ATS systems.

RESUME DATA:
${JSON.stringify(resumeData, null, 2)}

${targetRole ? `TARGET ROLE: ${targetRole}` : ''}

Respond in this exact JSON format (no markdown, just raw JSON):
{
  "personalInfo": {
    "name": "<name>",
    "email": "<email>",
    "phone": "<phone>",
    "location": "<city, state>",
    "linkedin": "<linkedin url if provided>"
  },
  "summary": "<ATS-optimized professional summary>",
  "experience": [
    {
      "company": "<company>",
      "role": "<role>",
      "startDate": "<start>",
      "endDate": "<end or Present>",
      "bullets": ["<ATS-optimized bullet>"]
    }
  ],
  "education": [
    {
      "institution": "<school>",
      "degree": "<degree>",
      "field": "<field of study>",
      "year": "<graduation year>"
    }
  ],
  "skills": {
    "technical": ["<skill>"],
    "soft": ["<skill>"],
    "tools": ["<tool>"]
  },
  "estimatedATSScore": <75-95>
}

Ensure:
- All section headings are standard ATS headings
- Action verbs start each bullet point
- Keywords are naturally integrated
- Quantified achievements where possible
- Clean, parseable structure
- Score should be 75+`;
        break;

      default:
        return NextResponse.json({ error: 'Invalid enhancement type' }, { status: 400 });
    }

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-6-20250514',
      max_tokens: 3000,
      messages: [{ role: 'user', content: prompt }],
    });

    const responseText = message.content[0].text;
    let result;

    try {
      result = JSON.parse(responseText);
    } catch (e) {
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        result = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Failed to parse AI response');
      }
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error('Enhancement error:', error);
    return NextResponse.json(
      { error: 'Failed to enhance resume. Please try again.' },
      { status: 500 }
    );
  }
}
