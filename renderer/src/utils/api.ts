import { createTRPCReact, createWSClient } from '@trpc/react-query';
import { AppRouter } from '../../../main/api/root';
import { inferRouterInputs, inferRouterOutputs } from '@trpc/server';

export const getBaseApiUrl = (host: string = 'localhost') => {
  if (typeof window !== 'undefined') host = window.location.hostname;
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `http://${host}:${process.env.PORT ?? 9988}`; // dev SSR should use localhost
};

export const getBaseWsUrl = (host: string = 'localhost') => {
  if (typeof window !== 'undefined') host = window.location.hostname;
  if (process.env.NODE_ENV !== 'production') return `ws://${host}:9988`; // browser should use relative url
  if (process.env.VERCEL_URL) return `ws://${process.env.VERCEL_URL}`; // SSR should use vercel url
  return `ws://${host}:${process.env.PORT ?? 9988}`; // dev SSR should use localhost
};

export const wsClient = createWSClient({
  url: `${getBaseWsUrl()}/ws/trpc`,
});

export type RouterInputs = inferRouterInputs<AppRouter>;

export type RouterOutputs = inferRouterOutputs<AppRouter>;

export const api = createTRPCReact<AppRouter>();
