import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    session: { type: mongoose.Schema.Types.ObjectId, ref: "Session", required: true },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    text: { type: String, required: true },
    kind: { type: String, enum: ["chat", "system", "code"], default: "chat" },
  },
  { timestamps: true }
);

const Message = mongoose.model("Message", messageSchema);

export default Message;