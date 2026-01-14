import express, { Request, Response } from "express";
import cookieParser from "cookie-parser";
import mysql, { Pool } from "mysql2/promise";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import { rootResolvers } from "./graphql/rootResolvers";
import { upload } from "./assets/upload";
import cors from "cors";
import { AdmissionRouter } from "./rest/Router/admissionRouter";
import { FaqRouter } from "./rest/Router/faqRouter";
import { GalleryRouter } from "./rest/Router/galleryRouter";
import { ActivityRouter } from "./rest/Router/activityRouter";
import { UserRouter } from "./rest/Router/userRouter";
import { SocketRouter } from "./rest/Router/socketSeederRouter";
import { SocketUserRouter } from "./rest/Router/socketRoute";
import { LeaveRequestRouter } from "./rest/Router/leaveRequestRouter";
const Schema = buildSchema(`

  type Admission {
    id: ID!
    name: String!
    email: String!
    age: String!
    phone: String!
    prevSchool_doc: String
    grade: String!
    gender: String!
    guardianName: String
    guardianPhone: String
    guardianEmail: String
    profile: String
    created_at: String
    updated_at: String
  }

  type User {
    id: ID!
    name: String!
    role: String!
    email: String!
    age: String!
    phone: String!
    guardianPhone: String
    guardianName: String
    father_name: String
    profile: String
    class: String
    grade: String!
    gender: String!
    city: String
    prevClassDocument: String
    created_at: String
    updated_at: String
  }

  type Activity {
    id: ID!
    activityName: String!
    image: String
    created_at: String
  }

  type Faq {
    id: ID!
    question: String!
    answer: String!
    created_at: String
  }

  type Gallery {
    id: ID!
    galleryName: String!
    image: String
    created_at: String
  }

  type AdmissionsResponse {
    success: Boolean!
    message: String!
    data: [Admission!]!
  }

  type AdmissionResponse {
    success: Boolean!
    message: String!
    data: Admission
  }

  type UsersResponse {
    success: Boolean!
    message: String!
    data: [User!]!
  }

  type UserResponse {
    success: Boolean!
    message: String!
    data: User
  }

  type ActivitiesResponse {
    success: Boolean!
    message: String!
    data: [Activity!]!
  }

  type ActivityResponse {
    success: Boolean!
    message: String!
    data: Activity
  }

  type FaqsResponse {
    success: Boolean!
    message: String!
    data: [Faq!]!
  }

  type FaqResponse {
    success: Boolean!
    message: String!
    data: Faq
  }

  type GalleriesResponse {
    success: Boolean!
    message: String!
    data: [Gallery!]!
  }

  type GalleryResponse {
    success: Boolean!
    message: String!
    data: Gallery
  }

  input AdmissionInput {
    name: String!
    email: String!
    age: String!
    phone: String!
    prevSchool_doc: String
    grade: String!
    gender: String!
    guardianName: String
    guardianPhone: String
    guardianEmail: String
    profile: String
  }

  input AdmissionUpdateInput {
    name: String
    email: String
    age: String
    phone: String
    prevSchool_doc: String
    grade: String
    gender: String
    guardianName: String
    guardianPhone: String
    guardianEmail: String
    profile: String
  }

  input UserInput {
    name: String!
    role: String!
    email: String!
    age: String!
    phone: String!
    guardianPhone: String
    guardianName: String
    father_name: String
    profile: String
    class: String
    grade: String!
    gender: String!
    city: String
    prevClassDocument: String
  }

  input UserUpdateInput {
    name: String
    role: String
    email: String
    age: String
    phone: String
    guardianPhone: String
    guardianName: String
    father_name: String
    profile: String
    class: String
    grade: String
    gender: String
    city: String
    prevClassDocument: String
  }

  input ActivityInput {
    activityName: String!
    image: String
  }

  input ActivityUpdateInput {
    activityName: String
    image: String
  }

  input FaqInput {
    question: String!
    answer: String!
  }

  input FaqUpdateInput {
    question: String
    answer: String
  }

  input GalleryInput {
    galleryName: String!
    image: String
  }

  input GalleryUpdateInput {
    galleryName: String
    image: String
  }

  type Query {
    admissions: AdmissionsResponse
    admission(id: ID!): AdmissionResponse

    users: UsersResponse
    user(id: ID!): UserResponse

    activities: ActivitiesResponse
    activity(id: ID!): ActivityResponse

    faqs: FaqsResponse
    faq(id: ID!): FaqResponse

    galleries: GalleriesResponse
    gallery(id: ID!): GalleryResponse
  }

  type Mutation {
    createAdmission(input: AdmissionInput!): Admission
    updateAdmission(id: ID!, input: AdmissionUpdateInput!): Admission
    deleteAdmission(id: ID!): Boolean

    createUser(input: UserInput!): User
    updateUser(id: ID!, input: UserUpdateInput!): User
    deleteUser(id: ID!): Boolean

    createActivity(input: ActivityInput!): Activity
    updateActivity(id: ID!, input: ActivityUpdateInput!): Activity
    deleteActivity(id: ID!): Boolean

    createFaq(input: FaqInput!): Faq
    updateFaq(id: ID!, input: FaqUpdateInput!): Faq
    deleteFaq(id: ID!): Boolean

    createGallery(input: GalleryInput!): Gallery
    updateGallery(id: ID!, input: GalleryUpdateInput!): Gallery
    deleteGallery(id: ID!): Boolean
  }

`);
const allowedOrigins = [
  "https://admin.yourdomain.com",
  "https://yourdomain.com",
  "http://localhost:5174",
  "http://localhost:5173",
];
const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS: " + origin));
      }
    },
    credentials: true,
  })
);
console.log("Server is running bro dude due")
app.use(cookieParser());
app.use(express.json());
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use("/api/admissions", AdmissionRouter);
app.use("/api/leaveRequests", LeaveRequestRouter);
app.use("/api/faq", FaqRouter)
app.use("/api/gallery", GalleryRouter );
app.use("/api/activity", ActivityRouter);
app.use("/api/user", UserRouter);
app.use("/api/seeder", SocketRouter );
app.use("/api/socket", SocketUserRouter);
console.log("we are doing it properly")
const db: Pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "",
  database: "aswedaul_ed",
});

app.use(
  "/graphql",
  upload.fields([
    { name: "profile", maxCount: 1 },
    { name: "prevClassDocument", maxCount: 1 },
  ]),
  graphqlHTTP((req) => ({
    schema: Schema,
    rootValue: rootResolvers,
    graphiql: true,
    context: { req },
  }))
);

app.get("/", (_req: Request, res: Response) => {
  res.status(200).send("<h1>Hello We are ok in home</h1>");
});

const PORT = Number(process.env.PORT) || 1500;

(async () => {
  try {
    await db.getConnection();
    console.log("MySQL Connected ✔");

    app.listen(PORT, () => {
      console.log("Server running on PORT:", PORT);
    });
  } catch (err) {
    console.error("MySQL Error ❌", err);
  }
})();
