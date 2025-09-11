import { NextResponse } from "next/server";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const GEMINI_MODEL = "gemini-2.0-flash"; // From your curl example

export async function GET(): Promise<NextResponse> {
  try {
    // Fixed topic (hardcoded)
    const topic = "personal questions";

    const prompt = `Give me 5 different ${topic} that someone can ask in an anonymous feedback app.
Return ONLY the questions as a numbered list.`;

    const apiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-goog-api-key": GEMINI_API_KEY,
        },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
        }),
      }
    );

    if (!apiRes.ok) {
      const text = await apiRes.text();
      console.error("Gemini API error:", text);
      return NextResponse.json(
        { error: "Gemini API failed", details: text },
        { status: 500 }
      );
    }

    const data = await apiRes.json();

    const textOutput: string =
      data.candidates?.[0]?.content?.parts?.[0]?.text || "";

    // Parse numbered list into clean array
    const questions: string[] = textOutput
      .split("\n")
      .map((q: string) => q.replace(/^\d+[\.\)]\s*/, "").trim())
      .filter((q: string) => q.length > 0)
      .slice(0, 5);

    return NextResponse.json({ questions });
  } catch (err) {
    console.error("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
