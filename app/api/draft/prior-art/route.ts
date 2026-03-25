import { NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";

const SYSTEM_PROMPT = `
You are PatentOS Prior-Art Engine.

Your job is to convert a refined invention idea into structured prior-art search inputs.

Do NOT hallucinate specific patents.
Do NOT fabricate references.

Return ONLY under these exact headings:

1. Core Keywords
2. Expanded Keywords
3. Suggested CPC Classes
4. Search Strategy
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

    const { projectId } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required." },
        { status: 400 }
      );
    }

    const { data: project, error: projectFetchError } = await supabase
      .from("projects")
      .select("id, refined_idea")
      .eq("id", projectId)
      .single();

    if (projectFetchError) {
      return NextResponse.json(
        { error: projectFetchError.message },
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
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: project.refined_idea.trim(),
        },
      ],
    });

    const output =
      aiResponse.content[0]?.type === "text" ? aiResponse.content[0].text : "";

    const { error: messageInsertError } = await supabase
      .from("project_messages")
      .insert({
        project_id: projectId,
        role: "assistant",
        message_type: "prior_art_input",
        content: output,
        stage: "prior_art_search_ready",
      });

    if (messageInsertError) {
      return NextResponse.json(
        { error: messageInsertError.message },
        { status: 500 }
      );
    }

    const { error: runInsertError } = await supabase
      .from("project_ai_runs")
      .insert({
        project_id: projectId,
        stage: "prior_art_search",
        model: "claude-sonnet-4-5",
        status: "success",
        request_payload: {
          refined_idea: project.refined_idea,
        },
        response_payload: {
          output,
        },
      });

    if (runInsertError) {
      return NextResponse.json(
        { error: runInsertError.message },
        { status: 500 }
      );
    }

    const { error: updateProjectError } = await supabase
      .from("projects")
      .update({
        stage: "prior_art_search_ready",
        prior_art_input: output,
        updated_at: new Date().toISOString(),
      })
      .eq("id", projectId);

    if (updateProjectError) {
      return NextResponse.json(
        { error: updateProjectError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ output });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to generate prior art input.";

    return NextResponse.json(
      { error: message },
      { status: 500 }
    );
  }
}