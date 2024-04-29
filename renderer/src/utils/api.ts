import { createTRPCReact } from '@trpc/react-query';
import { AppRouter } from '../../../main/api/root';

export const api = createTRPCReact<AppRouter>();
