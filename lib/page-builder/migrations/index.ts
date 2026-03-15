const CURRENT_VERSION = 1;

export function migrateContent(content: any): any {
  if (!content || !content.version) {
    return { ...content, version: 1 };
  }
  // Future: add v1→v2, v2→v3 here
  return content;
}

export function ensureVersion(content: any): any {
  if (content.version === CURRENT_VERSION) return content;
  return migrateContent(content);
}
