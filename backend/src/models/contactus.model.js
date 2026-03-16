import mongoose from "mongoose";

const contactUsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    subject: {
      type: String,
      required: true,
      trim: true,
    },

    message: {
      type: String,
      required: true,
      minlength: 10,
      trim: true,
    },

    // for admin read / unread tracking
    isRead: {
      type: Boolean,
      default: false, // unread by default
    },
  },
  { timestamps: true }
);

export const ContactUs = mongoose.model("ContactUs", contactUsSchema);
