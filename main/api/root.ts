import { createTRPCRouter } from './trpc';
import { chargePointRouter } from './routers/charge-point';

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  chargePoint: chargePointRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
