import fs from "fs/promises";
import path from "path";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary-config.js";
import Commit from "../models/commitModel.js";

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".gitverse");
  const configPath = path.join(repoPath, "config.json");

  try {
    
    const configData = await fs.readFile(configPath, "utf-8");
    const { repoId } = JSON.parse(configData);

    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGODB_URL, { dbName: "gitverse_db" });
    }

    const commits = await Commit.find({ repoId: repoId });
    
    if (!commits || commits.length === 0) {
      console.log("No commits found in the remote repository yet.");
      await mongoose.connection.close();
      return;
    }

    console.log(`Found ${commits.length} commits strictly for this repository. Pulling...`);

    for (const commitRecord of commits) {
      const commitID = commitRecord.commitID; 

      const data = await cloudinary.api.resources({
        type: "upload",
        resource_type: "raw",
        prefix: `commits/${commitID}/`, 
        max_results: 500,
      });

      const objects = data.resources || [];

      for (const object of objects) {
        const relativePath = object.public_id.replace(/^commits\//, "");
        const localPath = path.join(repoPath, "commits", relativePath);
        const localDir = path.dirname(localPath);

        await fs.mkdir(localDir, { recursive: true });

        const response = await fetch(object.secure_url);
        const fileBuffer = Buffer.from(await response.arrayBuffer());
        await fs.writeFile(localPath, fileBuffer);
      }
    }

    console.log("Repository commits pulled safely and securely.");
    await mongoose.connection.close();

  } catch (err) {
    console.error("Unable to pull : ", err.message);
  }
}

export { pullRepo };