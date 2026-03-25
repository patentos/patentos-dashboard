import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const SYSTEM_PROMPT = `
You are PatentOS.

Given a refined invention idea, generate structured novelty analysis for patent drafting.

Return under these exact headings:

1. Prior Art Summary
2. Gaps in Prior Art
3. Novelty Option 1
4. Strength 1
5. Novelty Option 2
6. Strength 2
7. Novelty Option 3
8. Strength 3

Rules:
- Do not hallucinate real patent numbers.
- Do not fabricate citations.
- Be practical, concise, and drafting-oriented.
- Each novelty option should be a possible invention angle the user may pursue.
- Each strength should be one of: Weak, Moderate, Strong.
`;

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    const anthropicApiKey = process.env.ANTHROPIC_API_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey || !anthropicApiKey) {
      return NextResponse.json(
        { error: "Missing required server environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);
    const anthropic = new Anthropic({ apiKey: anthropicApiKey });

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required." },
        { status: 400 }
      );
    }

    const { data: project, error: projectError } = await supabase
      .from("projects")
      .select("refined_idea")
      .eq("id", projectId)
      .single();

    if (projectError) {
      return NextResponse.json(
        { error: projectError.message },
        { status: 500 }
      );
    }

    if (!project?.refined_idea?.trim()) {
      return NextResponse.json(
        { error: "Refined idea not found for this project." },
        { status: 400 }
      );
    }

    const aiResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 1200,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: project.refined_idea,
        },
      ],
    });

    const output =
      aiResponse.content[0]?.type === "text" ? aiResponse.content[0].text : "";

    await supabase.from("project_messages").insert({
      project_id: projectId,
      role: "assistant",
      message_type: "prior_art_analysis",
      content: output,
      stage: "novelty_selection",
    });

    await supabase.from("project_ai_runs").insert({
      project_id: projectId,
      stage: "novelty_selection",
      model: "claude-sonnet-4-5",
      status: "success",
      request_payload: {
        refined_idea: project.refined_idea,
      },
      response_payload: {
        output,
      },
    });

    await supabase
      .from("projects")
      .update({
        stage: "novelty_selection",
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return NextResponse.json({ output });
  } catch (err) {
    const message =
      err instanceof Error
        ? err.message
        : "Failed to generate prior-art analysis.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}