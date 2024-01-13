import mongoose, { Document, Model, Schema } from "mongoose";
import { IUser } from "./user-model";

interface ICourseData extends Document {
  title: string;
  description: string;
  videoUrl: string;
  videoDuration: number;
  videoThumbnail: string;
  videoSection: string;
  suggestions: string;
  videoPlayer: string;
  link: ILink[];
  questions: IComment[];
}

interface ILink extends Document {
  title: string;
  url: string;
}

interface IComment extends Document {
  user: IUser;
  question: string;
  questionReplies: IComment[];
}

interface IReview extends Document {
  user: object;
  comment: string;
  rating: number;
  commentReply: IComment[];
}

interface ICourse extends Document {
  name: string;
  description?: string;
  price: number;
  estimatedPrice?: number;
  thumbnail: object;
  tags: string;
  level: string;
  demoVideoUrl: string;
  benefits: { title: string }[];
  prerequisites: { title: string }[];
  reviews: IReview[];
  courseData: ICourseData[];
  rating?: number;
  purchase?: number;
}

const reviewSchema = new Schema<IReview>({
  user: Object,
  rating: {
    type: Number,
    default: 0,
  },
  comment: String,
});

const linkSchema = new Schema<ILink>({
  title: String,
  url: String,
});

const commentSchema = new Schema<IComment>({
  user: Object,
  question: String,
  questionReplies: Object,
});

const courseDataSchema = new Schema<ICourseData>({
  videoUrl: String,
  videoSection: String,
  videoDuration: Number,
  title: String,
  description: String,
  videoPlayer: String,
  link: [linkSchema],
  suggestions: String,
  questions: [commentSchema],
});

const courseSchema = new Schema<ICourse>({
  name: {
    type: String,
    required: [true, "please enter course name"],
  },
  description: {
    type: String,
    required: [true, "please enter course description"],
  },

  price: {
    type: Number,
    required: [true, "please enter course price"],
  },
  estimatedPrice: {
    type: Number,
  },
  thumbnail: {
    public_id: {
      // required: [true, "please enter your thumnail public_id"],
      type: String,
    },
    url: {
      // required: [true, "please enter your thumnail url"],
      type: String,
    },
  },
  tags: {
    type: String,
    required: [true, "please enter course tags"],
  },
  level: {
    type: String,
    required: [true, "please enter course learning level"],
  },
  demoVideoUrl: {
    type: String,
    required: [true, "please enter course demoVideoUrl"],
  },
  benefits: [
    {
      title: String,
    },
  ],
  prerequisites: [
    {
      title: String,
    },
  ],
  reviews: [reviewSchema],
  courseData: [courseDataSchema],
  rating: {
    type: Number,
    default: 0,
  },
  purchase: {
    type: Number,
    default: 0,
  },
});

const courseModel: Model<ICourse> = mongoose.model("Course", courseSchema);

export default courseModel;
