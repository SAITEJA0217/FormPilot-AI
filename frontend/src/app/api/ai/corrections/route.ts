import { NextResponse } from 'next/server';
import { adminAuth, adminDb } from '../../../../lib/firebase-admin';
import { callOpenRouter, FREE_OPENROUTER_MODEL, OpenRouterError, extractJsonFromResponse } from '@/lib/openrouter';
import { getCorsHeaders, handlePreflight, isOriginAllowed } from '@/lib/cors';
import { enforceRateLimit } from '@/lib/rate-limiter';

export async function OPTIONS(req: Request) {
  return handlePreflight(req, 'GET, POST, OPTIONS');
}

export async function POST(req: Request) {
  const reqOrigin = req.headers.get('origin');
  
  if (reqOrigin && !isOriginAllowed(reqOrigin)) {
    return NextResponse.json({ error: 'CORS policy: Unauthorized origin' }, { status: 403 });
  }

  const corsHeaders = getCorsHeaders(reqOrigin, 'GET, POST, OPTIONS');

  try {
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401, headers: corsHeaders });
    }
    const token = authHeader.split('Bearer ')[1]?.trim();
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token format' }, { status: 401, headers: corsHeaders });
    }

    let decodedToken;
    try {
      decodedToken = await adminAuth.verifyIdToken(token);
    } catch (authErr: any) {
      console.error('[API /ai/corrections] Auth token verification failed:', authErr.message);
      return NextResponse.json({ error: 'Unauthorized: Invalid token' }, { status: 401, headers: corsHeaders });
    }

    const uid = decodedToken.uid;

    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400, headers: corsHeaders });
    }

    const { originalQuestion, originalAnswer, userCorrection, sourceDetail } = body;

    // Strict input validation
    if (
      !originalQuestion ||
      typeof originalQuestion !== 'string' ||
      !originalQuestion.trim() ||
      !userCorrection ||
      typeof userCorrection !== 'string' ||
      !userCorrection.trim()
    ) {
      return NextResponse.json(
        { error: 'Invalid request: originalQuestion and userCorrection are required non-empty strings' },
        { status: 400, headers: corsHeaders }
      );
    }

    if (originalQuestion.length > 500) {
      return NextResponse.json({ error: 'originalQuestion exceeds maximum length of 500 characters' }, { status: 400, headers: corsHeaders });
    }

    if (userCorrection.length > 1000) {
      return NextResponse.json({ error: 'userCorrection exceeds maximum length of 1000 characters' }, { status: 400, headers: corsHeaders });
    }

    const cleanQuestion = originalQuestion.trim();
    const cleanCorrection = userCorrection.trim();
    const cleanOriginalAnswer = typeof originalAnswer === 'string' ? originalAnswer.substring(0, 1000).trim() : '';
    const cleanSourceDetail = typeof sourceDetail === 'string' ? sourceDetail.substring(0, 200).trim() : '';

    // Persistent Fail-Closed Rate Limiting
    const rateLimit = await enforceRateLimit({ uid, action: 'corrections', db: adminDb });
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.error },
        { status: rateLimit.status, headers: corsHeaders }
      );
    }

    // Classify correction with isolated untrusted user content
    const prompt = `
Analyze this user correction to an AI-generated form answer.

Question: "${cleanQuestion.replace(/[\r\n]+/g, ' ')}"
Original Answer: "${cleanOriginalAnswer.replace(/[\r\n]+/g, ' ')}"
User Correction: "${cleanCorrection.replace(/[\r\n]+/g, ' ')}"
Source Field: "${cleanSourceDetail.replace(/[\r\n]+/g, ' ')}"

Classify this correction as either 'fact-level' or 'phrasing-level'.
- fact-level: The user is correcting a durable fact (e.g. changing graduation year from 2023 to 2024, or adding a new skill).
- phrasing-level: The user is just changing the tone or wording for this specific context, but the underlying fact hasn't changed.

Return ONLY a JSON object: {"type": "fact-level" | "phrasing-level"}
    `.trim();

    let type = 'phrasing-level'; // safe default
    try {
      const responseText = await callOpenRouter({
        model: process.env.OPENROUTER_MODEL || FREE_OPENROUTER_MODEL,
        messages: [{ role: 'user', content: prompt }],
        responseFormat: { type: 'json_object' },
        temperature: 0.1,
        maxTokens: 200
      });
      const parsed = extractJsonFromResponse(responseText);
      if (parsed && parsed.type === 'fact-level') {
        type = 'fact-level';
      }
    } catch (e) {
      console.warn('[API /ai/corrections] Failed to classify correction with AI, falling back to default:', e);
    }

    // Save bounded correction to Firestore
    const correctionRef = adminDb.collection(`users/${uid}/corrections`).doc();
    await correctionRef.set({
      originalQuestion: cleanQuestion,
      originalAnswer: cleanOriginalAnswer,
      userCorrection: cleanCorrection,
      sourceDetail: cleanSourceDetail,
      type,
      timestamp: Date.now()
    });

    return NextResponse.json({ success: true, type }, { headers: corsHeaders });

  } catch (error: any) {
    console.error('[API /ai/corrections] Unexpected Route Error:', error);
    if (error instanceof OpenRouterError) {
      return NextResponse.json({ error: error.message }, { status: error.status || 502, headers: corsHeaders });
    }
    return NextResponse.json({ error: 'An unexpected error occurred while saving correction' }, { status: 500, headers: corsHeaders });
  }
}
