import mongoose from "mongoose";
import { COLLECTIONS } from "../Constants/Constants.js";

const studentSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTIONS.USER,
      required: true,
    },
    profile: {
      type: mongoose.Schema.Types.ObjectId,
      ref: COLLECTIONS.PROFILE,
      required: true,
    },
    coursesEnrolled: [
      {
        course: {
          type: mongoose.Schema.Types.ObjectId,
          ref: COLLECTIONS.COURSE,
          required: true,
        },
        status: {
          type: String,
          required: true,
          enum: [
            "enrolled",
            "completed",
            "inProgress",
            "pending",
            "failed",
            "passed",
            "dropped",
          ],
        },
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
        courseCompletionDate: { type: Date, required: true },
        completedVideos: [
          {
            video: {
              type: mongoose.Schema.Types.ObjectId,
              ref: COLLECTIONS.VIDEO,
              required: true,
            },
            completionDate: { type: Date, required: true },
          },
        ],
        completedQuizzes: [
          {
            quiz: {
              type: mongoose.Schema.Types.ObjectId,
              ref: COLLECTIONS.QUIZ,
              required: true,
            },
            completionDate: { type: Date, required: true },
            score: { type: Number, required: true },
            totalScore: { type: Number, required: true },
            answers:[
                {
                    question: { type: mongoose.Schema.Types.ObjectId, ref: COLLECTIONS.QUESTION,required:true},
                    answer: { type: String, required: true },
                    isCorrect: { type: Boolean, required: true ,default:false},
                }
            ]
          },
        ],
      },
    ],
  },
  {
    timestamps: true,
  }
);

export const Student = mongoose.model(COLLECTIONS.STUDENT, studentSchema);
