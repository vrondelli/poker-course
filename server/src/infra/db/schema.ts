import { pgTable, serial, text, integer, timestamp, jsonb } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const gameSessions = pgTable('game_sessions', {
  id: serial('id').primaryKey(),
  userId: integer('user_id').references(() => users.id).notNull(),
  correctCount: integer('correct_count').notNull(),
  incorrectCount: integer('incorrect_count').notNull(),
  avgTimeMs: integer('avg_time_ms').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
  // Maybe store details like which flops were missed?
  details: jsonb('details'), 
});
