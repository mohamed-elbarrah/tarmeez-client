const CURRENT_VERSION = 2;

export function migrateContent(content: any): any {
  if (!content || !content.version) {
    return { ...content, version: 2 };
  }
  // v1 → v2: CategoriesSliderBlock and ProductsSectionBlock are new block types.
  // Existing v1 pages that do not contain these blocks need no structural changes —
  // the new blocks simply don't appear in their content array.
  // We just bump the version number.
  if (content.version === 1) {
    return { ...content, version: 2 };
  }
  return content;
}

export function ensureVersion(content: any): any {
  if (content.version === CURRENT_VERSION) return content;
  return migrateContent(content);
}
