import fs from "fs/promises";
import path from "path";

async function addRemote(repoId) {
  const repoPath = path.resolve(process.cwd(), ".gitverse");
  const configPath = path.join(repoPath, "config.json");

  try {
    try {
      await fs.access(repoPath);
    } catch {
      console.log("GitVerse is not initialized in this directory. Run 'node index.js init' first.");
      return;
    }

    const configData = { repoId: repoId };
    await fs.writeFile(configPath, JSON.stringify(configData, null, 2));

    console.log(`Remote repository linked successfully! ID: ${repoId}`);
  } catch (err) {
    console.error("Failed to link remote repository:", err);
  }
}

export { addRemote };