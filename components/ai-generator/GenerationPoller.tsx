"use client";

/**
 * Invisible component that polls the generation status and transitions
 * the workspace to the "workspace" phase once the page is ready.
 */

import { useEffect, useState } from "react";
import { useGenerator } from "./GeneratorContext";
import { useGetGenerationQuery } from "@/lib/services/landingPageApi";
import { useGetPageQuery } from "@/lib/services/pagesApi";

interface GenerationPollerProps {
  generationId: string;
}

export function GenerationPoller({ generationId }: GenerationPollerProps) {
  const { dispatch } = useGenerator();
  // Use state (not ref) so polling actually stops when resolved triggers a re-render
  const [resolved, setResolved] = useState(false);

  const { data: generation } = useGetGenerationQuery(generationId, {
    pollingInterval: resolved ? 0 : 2000,
  });

  const status = generation?.status;

  // Fetch the page once completed
  const { data: page } = useGetPageQuery(generation?.pageId ?? "", {
    skip: !generation?.pageId || status !== "COMPLETED",
  });

  useEffect(() => {
    if (resolved) return;

    if (status === "COMPLETED" && page) {
      setResolved(true);
      dispatch({
        type: "GENERATION_COMPLETE",
        pageId: page.id,
        content: page.content ?? {},
      });
    }

    if (status === "FAILED") {
      setResolved(true);
      dispatch({ type: "GENERATION_FAILED" });
    }
  }, [status, page, dispatch, resolved]);

  return null;
}
