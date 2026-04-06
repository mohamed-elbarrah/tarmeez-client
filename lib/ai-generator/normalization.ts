import {
  LandingPageContentSchema,
  LandingSectionSchema,
  CANONICAL_SECTION_ORDER,
  type LandingPageContent,
  type LandingSection,
  type SectionType,
} from "./schemas";

// ─── Normalization Result ────────────────────────────────────
export interface NormalizationResult {
  success: boolean;
  data: LandingPageContent | null;
  errors: NormalizationError[];
  warnings: string[];
}

export interface NormalizationError {
  section: string;
  path: string;
  message: string;
}

// ─── Normalization Layer ─────────────────────────────────────
export function normalizeAIOutput(raw: unknown): NormalizationResult {
  const errors: NormalizationError[] = [];
  const warnings: string[] = [];

  // Step 1: Ensure we have a parseable object
  let parsed: Record<string, unknown>;
  if (typeof raw === "string") {
    try {
      parsed = JSON.parse(raw);
    } catch {
      return {
        success: false,
        data: null,
        errors: [{ section: "root", path: "", message: "Invalid JSON string" }],
        warnings: [],
      };
    }
  } else if (typeof raw === "object" && raw !== null) {
    parsed = raw as Record<string, unknown>;
  } else {
    return {
      success: false,
      data: null,
      errors: [{ section: "root", path: "", message: "Expected object or JSON string" }],
      warnings: [],
    };
  }

  // Step 2: Extract sections array (handle multiple AI output shapes)
  let rawSections: unknown[];
  if (Array.isArray(parsed.sections)) {
    rawSections = parsed.sections;
  } else if (Array.isArray(parsed)) {
    rawSections = parsed;
    warnings.push("AI returned array directly; wrapped as sections");
  } else {
    return {
      success: false,
      data: null,
      errors: [{ section: "root", path: "sections", message: "Missing sections array" }],
      warnings: [],
    };
  }

  // Step 3: Validate each section individually
  const validSections: LandingSection[] = [];
  for (let i = 0; i < rawSections.length; i++) {
    const rawSection = rawSections[i];
    const result = LandingSectionSchema.safeParse(rawSection);
    if (result.success) {
      validSections.push(result.data);
    } else {
      const sectionType =
        typeof rawSection === "object" && rawSection !== null && "type" in rawSection
          ? String((rawSection as Record<string, unknown>).type)
          : `index_${i}`;
      for (const issue of result.error.issues) {
        errors.push({
          section: sectionType,
          path: issue.path.join("."),
          message: issue.message,
        });
      }
    }
  }

  if (validSections.length === 0) {
    return { success: false, data: null, errors, warnings };
  }

  // Step 4: Deduplicate — keep first occurrence of each type
  const seen = new Set<string>();
  const deduped: LandingSection[] = [];
  for (const section of validSections) {
    if (seen.has(section.type)) {
      warnings.push(`Duplicate section "${section.type}" removed`);
      continue;
    }
    seen.add(section.type);
    deduped.push(section);
  }

  // Step 5: Sort by canonical order
  const sorted = sortByCanonicalOrder(deduped);

  // Step 6: Extract metadata with defaults
  const rawMetadata = typeof parsed.metadata === "object" && parsed.metadata !== null ? parsed.metadata : {};
  const metadata = {
    language: getStringField(rawMetadata, "language", "ar") as "ar" | "en",
    tone: getStringField(rawMetadata, "tone", "professional") as LandingPageContent["metadata"]["tone"],
    colorScheme: getStringField(rawMetadata, "colorScheme", undefined),
  };

  // Step 7: Final full-schema validation
  const finalResult = LandingPageContentSchema.safeParse({
    sections: sorted,
    metadata,
  });

  if (!finalResult.success) {
    for (const issue of finalResult.error.issues) {
      errors.push({
        section: "root",
        path: issue.path.join("."),
        message: issue.message,
      });
    }
    return { success: false, data: null, errors, warnings };
  }

  if (errors.length > 0) {
    warnings.push(`${errors.length} section(s) failed validation and were dropped`);
  }

  return {
    success: true,
    data: finalResult.data,
    errors,
    warnings,
  };
}

// ─── Helpers ─────────────────────────────────────────────────
function sortByCanonicalOrder(sections: LandingSection[]): LandingSection[] {
  const orderMap = new Map<string, number>();
  CANONICAL_SECTION_ORDER.forEach((type, idx) => orderMap.set(type, idx));

  return [...sections].sort((a, b) => {
    const aIdx = orderMap.get(a.type) ?? 999;
    const bIdx = orderMap.get(b.type) ?? 999;
    return aIdx - bIdx;
  });
}

function getStringField(
  obj: unknown,
  key: string,
  fallback: string | undefined
): string | undefined {
  if (typeof obj !== "object" || obj === null) return fallback;
  const val = (obj as Record<string, unknown>)[key];
  return typeof val === "string" ? val : fallback;
}
