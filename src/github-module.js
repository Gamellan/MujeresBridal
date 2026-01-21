// This module is no longer used
// All persistence is now local (IndexedDB)
// User exports JSON manually from admin panel
export const githubModule = {
  async loadCatalogFromGitHub() {
    console.log("GitHub sync disabled - using local catalog only");
    return null;
  }
};
