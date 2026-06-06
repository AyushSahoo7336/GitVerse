import fs from "fs/promises";
import path from "path";

async function shouldIgnore(filePath) {
  const ignorePath = path.join(process.cwd(), ".gitverseignore");
  try {
    const ignoreContent = await fs.readFile(ignorePath, "utf-8");
    const ignoredItems = ignoreContent
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line !== "" && !line.startsWith("#"));

    for (const item of ignoredItems) {
      if (filePath.includes(item)) {
        return true;
      }
    }
    return false;
  } catch (err) {
    return false;
  }
}

async function addRepo(targetPath) {
  const repoPath = path.resolve(process.cwd(), ".gitverse");
  const stagingPath = path.join(repoPath, "staging");

  try {
    await fs.mkdir(stagingPath, { recursive: true });

    async function processItem(currentPath) {
      const absolutePath = path.resolve(process.cwd(), currentPath);

      if (await shouldIgnore(absolutePath)) return;
      
      const folderName = path.basename(absolutePath);
      if (folderName === ".gitverse" || folderName === ".git") {
        return; 
      }

      const stats = await fs.stat(absolutePath);

      if (stats.isDirectory()) {
  
        const items = await fs.readdir(absolutePath);
        for (const item of items) {
          await processItem(path.join(currentPath, item));
        }
      } else {
        const relativePath = path.relative(process.cwd(), absolutePath);
        const destPath = path.join(stagingPath, relativePath);
        const destDir = path.dirname(destPath);

        await fs.mkdir(destDir, { recursive: true });
        await fs.copyFile(absolutePath, destPath);
        console.log(`Staged: ${relativePath}`);
      }
    }
    await processItem(targetPath);
    console.log("Staging complete!");

  } catch (err) {
    console.error("Error adding file : ", err.message);
  }
}

export { addRepo };