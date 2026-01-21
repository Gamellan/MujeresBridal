import { GITHUB_TOKEN, GITHUB_REPO, GITHUB_BRANCH } from "./admin-config.js";

const API_URL = "https://api.github.com";

export const githubModule = {
  async getFileContent(path) {
    try {
      const url = `${API_URL}/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
      const response = await fetch(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3.raw"
        }
      });

      if (response.status === 404) return null;
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);

      return await response.text();
    } catch (err) {
      console.error("Failed to get file from GitHub:", err);
      return null;
    }
  },

  async updateFile(path, content, message) {
    try {
      // Get current file to get its SHA (required for updates)
      const url = `${API_URL}/repos/${GITHUB_REPO}/contents/${path}?ref=${GITHUB_BRANCH}`;
      const getResponse = await fetch(url, {
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json"
        }
      });

      let sha = null;
      if (getResponse.ok) {
        const data = await getResponse.json();
        sha = data.sha;
      }

      // Prepare the update
      const payload = {
        message: message || "Update catalog data",
        content: btoa(content), // base64 encode
        branch: GITHUB_BRANCH
      };

      if (sha) {
        payload.sha = sha; // Required for updates
      }

      // Update/create file
      const putResponse = await fetch(url, {
        method: "PUT",
        headers: {
          Authorization: `token ${GITHUB_TOKEN}`,
          Accept: "application/vnd.github.v3+json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(payload)
      });

      if (!putResponse.ok) {
        const error = await putResponse.json();
        throw new Error(`GitHub API error: ${error.message}`);
      }

      return true;
    } catch (err) {
      console.error("Failed to update file on GitHub:", err);
      return false;
    }
  },

  async loadCatalogFromGitHub() {
    const content = await this.getFileContent("public/catalog-data.json");
    if (content) {
      try {
        return JSON.parse(content);
      } catch (err) {
        console.error("Failed to parse catalog data:", err);
        return null;
      }
    }
    return null;
  },

  async saveCatalogToGitHub(data) {
    const content = JSON.stringify(data, null, 2);
    const message = `Update catalog: ${new Date().toLocaleString()}`;
    return await this.updateFile("public/catalog-data.json", content, message);
  }
};
