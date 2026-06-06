import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";

async function commitRepo(message) {
  const repoPath = path.resolve(process.cwd(), ".gitverse");
  const stagedPath = path.join(repoPath, "staging");
  const commitPath = path.join(repoPath, "commits");

  try {
    const commitID = uuidv4();
    const commitDir = path.join(commitPath, commitID);
    await fs.mkdir(commitDir, { recursive: true });

    await fs.cp(stagedPath, commitDir, { recursive: true });

    await fs.writeFile(
      path.join(commitDir, "commit.json"),
      JSON.stringify({ message, date: new Date().toISOString() })
    );

    await fs.rm(stagedPath, { recursive: true, force: true });
    await fs.mkdir(stagedPath, { recursive: true });

    console.log(`Commit ${commitID} created with message: "${message}"`);
  } catch (err) {
    console.error("Error committing files : ", err.message);
  }
}

export { commitRepo };