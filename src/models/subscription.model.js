import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
  {
    // the one who's subscribing
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    // the one to whom the 'subscriber' is subscribing
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export const Subscription = mongoose.model("Subscription", subscriptionSchema);
