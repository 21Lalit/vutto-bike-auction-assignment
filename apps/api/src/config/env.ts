import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const schema = z.object({
  DATABASE_URL: z.string().default("file:./dev.db"),
  JWT_SECRET: z.string().min(16).default("dev-secret-change-before-prod"),
  CLIENT_ORIGIN: z.string().default("http://localhost:5173"),
  NODE_ENV: z.string().default("development"),
  PORT: z.coerce.number().default(4000)
}).superRefine((value, ctx) => {
  if (value.NODE_ENV === "production" && value.JWT_SECRET === "dev-secret-change-before-prod") {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["JWT_SECRET"],
      message: "JWT_SECRET must be explicitly set in production"
    });
  }
  if (value.NODE_ENV === "production" && value.JWT_SECRET.length < 32) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ["JWT_SECRET"],
      message: "JWT_SECRET must be at least 32 characters in production"
    });
  }
});

export const env = schema.parse(process.env);
