// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration

import {
  boolean,
  index,
  integer,
  numeric,
  pgTableCreator,
  serial,
  text,
  timestamp,
  unique,
  varchar,
} from "drizzle-orm/pg-core";
import {
  DIFFICULTIES,
  POINTS,
  PROBLEM_NUMBERS,
  SECTIONS,
  TOPICS,
} from "~/lib/consts";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";
import { type z } from "zod";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `feprep.org_${name}`);

export const UsersTable = createTable(
  "user",
  {
    id: serial("id").primaryKey(),
    email: varchar("email", { length: 255 }).unique().notNull(),
    hashedPassword: varchar("hashed_password", { length: 255 }),
    isEmailVerified: boolean("is_email_verified").default(false).notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
      () => new Date(),
    ),
  },
  (t) => ({
    emailIdx: index("user_email_idx").on(t.email),
  }),
);

export const insertUserSchema = createInsertSchema(UsersTable);
export const selectUserSchema = createSelectSchema(UsersTable);
export type InsertUser = z.infer<typeof insertUserSchema>;
export type SelectUser = z.infer<typeof selectUserSchema>;

export const SessionsTable = createTable(
  "session",
  {
    id: text("id").notNull().primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (t) => ({
    userIdx: index("session_user_idx").on(t.userId),
  }),
);

export const insertSessionSchema = createInsertSchema(SessionsTable);
export const selectSessionSchema = createSelectSchema(SessionsTable);
export type InsertSession = z.infer<typeof insertSessionSchema>;
export type SelectSession = z.infer<typeof selectSessionSchema>;

export const EmailVerificationCodesTable = createTable(
  "email_verification_token",
  {
    id: serial("id").primaryKey(),
    userId: varchar("user_id", { length: 21 }).unique().notNull(),
    email: varchar("email", { length: 255 }).notNull(),
    code: varchar("code", { length: 8 }).notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (t) => ({
    userIdx: index("email_verification_token_user_idx").on(t.userId),
    emailIdx: index("email_verification_token_email_idx").on(t.email),
  }),
);

export const PasswordResetTokensTable = createTable(
  "password_reset_token",
  {
    id: varchar("id", { length: 40 }).primaryKey(),
    userId: varchar("user_id", { length: 21 }).notNull(),
    expiresAt: timestamp("expires_at", {
      withTimezone: true,
      mode: "date",
    }).notNull(),
  },
  (t) => ({
    userIdx: index("password_reset_token_user_idx").on(t.userId),
  }),
);

export const ProblemsTable = createTable("problem", {
  id: varchar("id", { length: 15 }).primaryKey(),
  title: varchar("title", {
    length: 255,
  }).notNull(),
  pdf_url: text("pdf_url").notNull(),
  average_score: numeric("average_score", { precision: 5, scale: 2 }).notNull(),
  points: varchar("points", { length: 2, enum: POINTS }).notNull(),
  section: varchar("section", { length: 50, enum: SECTIONS }).notNull(),
  topic: varchar("topic", { length: 50, enum: TOPICS }).notNull(),
  problemNumber: varchar("problem_number", {
    length: 1,
    enum: PROBLEM_NUMBERS,
  }).notNull(),

  easyVotes: integer("easy_votes").notNull().default(0),
  mediumVotes: integer("medium_votes").notNull().default(0),
  hardVotes: integer("hard_votes").notNull().default(0),
});

export const ResourcesTable = createTable("resource", {
  id: varchar("id", { length: 15 }).primaryKey(),
  topic: varchar("topic", { length: 50, enum: TOPICS }).notNull(),
  url: text("url").notNull(),
  isVideo: boolean("is_video").notNull(),
});

export const CommentsTable = createTable("comment", {
  id: varchar("id", { length: 15 }).primaryKey(),
  problemID: varchar("problem_id", { length: 15 }).notNull(),
  userId: varchar("user_id", { length: 21 }).notNull(),
  text: text("text").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).$onUpdate(
    () => new Date(),
  ),
  parent_comment_id: varchar("parxent_comment_id", { length: 15 }),
});

export const VotesTable = createTable(
  "vote",
  {
    id: varchar("id", { length: 15 }).primaryKey(),
    userId: varchar("user_id", { length: 21 })
      .notNull()
      .references(() => UsersTable.id),
    problemID: varchar("problem_id", { length: 15 })
      .notNull()
      .references(() => ProblemsTable.id),
    vote: varchar("vote", {
      length: 6,
      enum: DIFFICULTIES,
    }).notNull(),
  },
  (t) => ({
    unique: unique("vote_unique_idx").on(t.userId, t.problemID),
  }),
);
