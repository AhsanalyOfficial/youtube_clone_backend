import { Schema, model } from "mongoose";

const subscriberSchema = new Schema(
  {
    subscriber: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    channel: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const Subscriber = model("subscriber", subscriberSchema);
export { Subscriber };
