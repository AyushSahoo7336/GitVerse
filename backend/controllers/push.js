import fs from "fs/promises";
import path from "path";
import cloudinary from "../config/cloudinary-config.js";
import mongoose from "mongoose";
import Commit from "../models/commitModel.js";
import Repository from "../models/repoModel.js";

async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".gitverse");
  const commitsPath = path.join(repoPath, "commits");
  const configPath = path.join(repoPath, "config.json");

  let repoId;
  try {
    const configData = await fs.readFile(configPath, "utf-8");
    repoId = JSON.parse(configData).repoId;
  } catch (err) {
    console.log("No remote repository linked. Run 'node index.js remote add <ID>' first.");
    return;
  }

  try {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URL, { dbName: "gitverse_db" });
    }
    const commitDirs = await fs.readdir(commitsPath);
    console.log(`Found ${commitDirs.length} commits in local folder...`);

    for (const commitDir of commitDirs) {
      const existingCommit = await Commit.findOne({ commitID: commitDir });
      
      if (existingCommit) {
        console.log(` - Commit ${commitDir} already pushed. Skipping...`);
        continue; 
      }

      const commitPath = path.join(commitsPath, commitDir);

      let commitMessage = "No message";
      try {
        const jsonContent = await fs.readFile(path.join(commitPath, "commit.json"), "utf-8");
        commitMessage = JSON.parse(jsonContent).message;
      } catch (err) {
        console.error(`Warning: Could not read commit.json for ${commitDir}`);
      }

      console.log(`Pushing NEW commit: ${commitDir}...`);

      async function uploadFolderRecursively(currentLocalPath, baseCloudPath = "") {
        const items = await fs.readdir(currentLocalPath, { withFileTypes: true });

        for (const item of items) {
          const fullLocalPath = path.join(currentLocalPath, item.name);
          
          const relativeCloudPath = baseCloudPath === "" ? item.name : `${baseCloudPath}/${item.name}`;

          if (item.isDirectory()) {
            await uploadFolderRecursively(fullLocalPath, relativeCloudPath);
          } else {
            await cloudinary.uploader.upload(fullLocalPath, {
              resource_type: "raw",
              public_id: `commits/${commitDir}/${relativeCloudPath}`,
              use_filename: false,
              unique_filename: false,
              overwrite: true,
            });
            console.log(` - Uploaded: ${relativeCloudPath}`);
          }
        }
      }

      await uploadFolderRecursively(commitPath);
      
      const savedCommit = await Commit.findOneAndUpdate(
        { commitID: commitDir },
        { commitID: commitDir, message: commitMessage, repoId: repoId },
        { upsert: true, returnDocument: 'after' }
      );

      await Repository.findByIdAndUpdate(
        repoId,
        { $addToSet: { content: savedCommit._id } } 
      );
    }

    console.log("Push operation complete!");
    await mongoose.connection.close();

  } catch (err) {
    console.error("Error pushing to Cloudinary:", err.message);
  }
}

export { pushRepo };