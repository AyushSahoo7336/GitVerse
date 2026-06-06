import mongoose from "mongoose";

const commitSchema = new mongoose.Schema({
  commitID: { 
    type: String, 
    required: true 
  },
  message: { 
    type: String, 
    required: true 
  },
  timestamp: { 
    type: Date, 
    default: Date.now 
  },
  repoId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Repository',
    required: true 
  }
});

const Commit = mongoose.model("Commit", commitSchema);

export default Commit;