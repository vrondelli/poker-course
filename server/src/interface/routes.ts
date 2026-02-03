import { FastifyInstance } from 'fastify';
import { getOrCreateUser, saveGameSession } from '../application/use-cases/game';

export async function gameRoutes(fastify: FastifyInstance) {
  
  fastify.post('/user', async (request, reply) => {
    const { name } = request.body as { name: string };
    if (!name) return reply.code(400).send({ error: 'Name required' });
    const user = await getOrCreateUser(name);
    return user;
  });

  fastify.post('/session', async (request, reply) => {
    const { userId, stats } = request.body as { 
      userId: number, 
      stats: { correct: number, incorrect: number, avgTimeMs: number } 
    };
    
    if (!userId || !stats) return reply.code(400).send({ error: 'Missing data' });
    
    const session = await saveGameSession(userId, stats);
    return session;
  });
}
