"use client";

/**
 * Invisible component that polls the generation status and transitions
 * the workspace to the "workspace" phase once the page is ready.
 *
 * We use the generation record directly (which already carries `content` and
 * `pageId` once COMPLETED) to avoid a second round-trip to /merchant/pages/:id
 * that could fail silently and leave the UI stuck on the generating overlay.
 */

import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useGenerator } from "./GeneratorContext";
import {
  useGetGenerationQuery,
  landingPageApi,
} from "@/lib/services/landingPageApi";

interface GenerationPollerProps {
  generationId: string;
}

export function GenerationPoller({ generationId }: GenerationPollerProps) {
  const { dispatch } = useGenerator();
  const reduxDispatch = useDispatch();
  // Use state (not ref) so polling actually stops when resolved triggers a re-render
  const [resolved, setResolved] = useState(false);

  const { data: generation } = useGetGenerationQuery(generationId, {
    pollingInterval: resolved ? 0 : 2000,
  });

  const status = generation?.status;

  useEffect(() => {
    if (resolved) return;

    if (status === "COMPLETED" && generation?.pageId) {
      setResolved(true);
      dispatch({
        type: "GENERATION_COMPLETE",
        pageId: generation.pageId,
        // generation.content is already persisted by the processor at COMPLETED time
        content: (generation.content as Record<string, any>) ?? {},
      });
      // Invalidate AI pages list so it refreshes when user returns to list view
      reduxDispatch(landingPageApi.util.invalidateTags(["AIPage"]));
    }

    if (status === "FAILED") {
      setResolved(true);
      dispatch({ type: "GENERATION_FAILED" });
    }
  }, [status, generation, dispatch, reduxDispatch, resolved]);

  return null;
}
