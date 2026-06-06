import express from "express";
import * as repoController from "../controllers/repoController.js";
import verifyToken from "../middleware/auth.js";
const repoRouter = express.Router();

repoRouter.post("/repo/create", repoController.createRepository);
repoRouter.get("/repo/all", repoController.getAllRepositories);
repoRouter.get("/repo/:id", repoController.fetchRepositoryById);
repoRouter.get("/repo/name/:name", repoController.fetchRepositoryByName);
repoRouter.get("/repo/user/:userID", repoController.fetchRepositoriesForCurrentUser);
repoRouter.put("/repo/update/:id", repoController.updateRepositoryById);
repoRouter.delete("/repo/delete/:id", repoController.deleteRepositoryById);
repoRouter.patch("/repo/toggle/:id", repoController.toggleVisibilityById);
repoRouter.get("/repo/:id/commits", verifyToken, repoController.fetchCommitsForRepository);
repoRouter.get("/repo/commits/:commitID/files", verifyToken, repoController.fetchCommitFiles);

export default repoRouter;