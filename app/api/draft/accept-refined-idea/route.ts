import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: Request) {
  try {
    const { projectId, userId, refinedIdea } = await req.json();

    if (!projectId) {
      return NextResponse.json(
        { error: "projectId is required." },
        { status: 400 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "Missing Supabase server environment variables." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const updatePayload: {
      stage: string;
      updated_at: string;
      refined_idea?: string;
    } = {
      stage: "prior_art_search_pending",
      updated_at: new Date().toISOString(),
    };

    if (refinedIdea?.trim()) {
      updatePayload.refined_idea = refinedIdea.trim();
    }

    const { error: projectUpdateError } = await supabase
      .from("projects")
      .update(updatePayload)
      .eq("id", projectId);

    if (projectUpdateError) {
      return NextResponse.json(
        { error: projectUpdateError.message },
        { status: 500 }
      );
    }

    const { error: messageInsertError } = await supabase
      .from("project_messages")
      .insert({
        project_id: projectId,
        role: "user",
        message_type: "refinement_accepted",
        content: refinedIdea?.trim()
          ? `User accepted the refined idea.\n\nAccepted refined idea:\n${refinedIdea.trim()}`
          : "User accepted the refined idea.",
        stage: "prior_art_search_pending",
      });

    if (messageInsertError) {
      return NextResponse.json(
        { error: messageInsertError.message },
        { status: 500 }
      );
    }

    const { error: aiRunInsertError } = await supabase
      .from("project_ai_runs")
      .insert({
        project_id: projectId,
        stage: "prior_art_search_pending",
        model: "system",
        status: "success",
        request_payload: {
          userId: userId ?? null,
          action: "accept_refined_idea",
        },
        response_payload: {
          nextStage: "prior_art_search_pending",
          refinedIdea: refinedIdea?.trim() || null,
        },
      });

    if (aiRunInsertError) {
      return NextResponse.json(
        { error: aiRunInsertError.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      stage: "prior_art_search_pending",
      message: "Refined idea accepted. Project moved to prior art search stage.",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to accept refined idea." },
      { status: 500 }
    );
  }
}