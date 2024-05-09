import { inferAsyncReturnType, initTRPC } from '@trpc/server';
import { type CreateHTTPContextOptions } from '@trpc/server/adapters/standalone';
import { ZodError } from 'zod';
import { prisma } from '../prisma';
import { CreateWSSContextFnOptions } from '@trpc/server/dist/adapters/ws';

export const createTRPCContext = async (_opts: CreateHTTPContextOptions | CreateWSSContextFnOptions) => {
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
