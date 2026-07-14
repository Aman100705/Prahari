import { NextResponse } from "next/server";
import { analyzeText } from "@/lib/intel/classifier";

/**
 * POST /api/triage  { text: string }
 * Runs the deterministic digital-arrest classifier over an arbitrary message.
 * Fully offline by design; an LLM refinement pass can be layered here in
 * production (see architecture) without changing the contract.
 */
export async function POST(req: Request) {
  try {
    const { text } = await req.json();
    if (typeof text !== "string" || !text.trim()) {
      return NextResponse.json({ error: "text required" }, { status: 400 });
    }
    const result = analyzeText(text);
    return NextResponse.json({ result, engine: "prahari-rules-v1" });
  } catch {
    return NextResponse.json({ error: "bad request" }, { status: 400 });
  }
}
