import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const SYSTEM_PROMPT = `
You are PatentOS.

Refine raw invention ideas into structured, clear technical concepts.

Do not hallucinate.
Do not add unsupported details.

Return under these exact headings:

1. Refined Idea
2. Assumptions Made
3. Missing Details
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

    const anthropic = new Anthropic({
      apiKey: anthropicApiKey,
    });

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const { projectId, idea } = await req.json();

    if (!projectId || !idea?.trim()) {
      return NextResponse.json(
        { error: "projectId and idea are required." },
        { status: 400 }
      );
    }

    await supabase.from("project_messages").insert({
      project_id: projectId,
      role: "user",
      message_type: "idea_input",
      content: idea.trim(),
      stage: "idea_input",
    });

    const aiResponse = await anthropic.messages.create({
      model: "claude-sonnet-4-5",
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: idea.trim(),
        },
      ],
    });

    const output =
      aiResponse.content[0]?.type === "text" ? aiResponse.content[0].text : "";

    const refinedIdeaMatch = output.match(/Refined Idea[:\s]*([\s\S]*?)Assumptions Made[:\s]*/i);
    const assumptionsMatch = output.match(/Assumptions Made[:\s]*([\s\S]*?)Missing Details[:\s]*/i);
    const missingDetailsMatch = output.match(/Missing Details[:\s]*([\s\S]*)/i);

    const refinedIdea = refinedIdeaMatch?.[1]?.trim() || "";
    const assumptionsMade = assumptionsMatch?.[1]?.trim() || "";
    const missingDetails = missingDetailsMatch?.[1]?.trim() || "";

    await supabase.from("project_messages").insert({
      project_id: projectId,
      role: "assistant",
      message_type: "refined_idea",
      content: output,
      stage: "idea_refinement_review",
    });

    await supabase.from("project_ai_runs").insert({
      project_id: projectId,
      stage: "idea_refinement_review",
      model: "claude-sonnet-4-5",
      status: "success",
      request_payload: { idea },
      response_payload: { output },
    });

    await supabase
      .from("projects")
      .update({
        stage: "idea_refinement_review",
        refined_idea: output,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    return NextResponse.json({
      refinedIdea,
      assumptionsMade,
      missingDetails,
      rawOutput: output,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to refine idea." },
      { status: 500 }
    );
  }
}