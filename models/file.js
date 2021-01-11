import mongoose from "mongoose";

const { Schema } = mongoose;

const imageSchema = new Schema(
  {
    fileUrl: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    data: [
      {
        type: Object,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model("Files", imageSchema);
