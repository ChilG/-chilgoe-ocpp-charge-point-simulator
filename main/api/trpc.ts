import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { type CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { ZodError } from 'zod';
import { prisma } from '../prisma';

export const createTRPCContext = async (_opts: CreateHTTPContextOptions) => {
  return { prisma };
};

export type Context = inferAsyncReturnType<typeof createTRPCContext>;

const t = initTRPC.context<typeof createTRPCContext>().create({
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        // @ts-ignore
        zodError: error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;
