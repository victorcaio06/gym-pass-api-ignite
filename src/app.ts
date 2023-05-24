import fastify from 'fastify';
import { PrismaClient } from '@prisma/client';

const app = fastify();

const prisma = new PrismaClient();



export { app };
