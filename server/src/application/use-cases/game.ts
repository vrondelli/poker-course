import { eq } from 'drizzle-orm';
import { db } from '../../index';
import { users, gameSessions } from '../../infra/db/schema';

export const getOrCreateUser = async (name: string) => {
  const existing = await db.query.users.findFirst({
    where: eq(users.name, name),
  });
  if (existing) return existing;

  const [newUser] = await db.insert(users).values({ name }).returning();
  return newUser;
};

export const saveGameSession = async (
  userId: number,
  stats: { correct: number; incorrect: number; avgTimeMs: number }
) => {
  return await db.insert(gameSessions).values({
    userId,
    correctCount: stats.correct,
    incorrectCount: stats.incorrect,
    avgTimeMs: stats.avgTimeMs,
  }).returning();
};
