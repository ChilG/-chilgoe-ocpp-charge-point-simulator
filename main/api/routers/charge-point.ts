import { z } from 'zod';
import { TRPCError } from '@trpc/server';
import { createTRPCRouter, publicProcedure } from '../trpc';
import { prisma } from '../../prisma';
import { Prisma } from '../../../prisma/generated/prisma-client-js';
import { SimulateStatusEnum } from '../shared/enum/app/SimulateStatus';

const defaultChargePointSelect = Prisma.validator<Prisma.ChargePointSelect>()({
  chargePointId: true,
  ocppProtocol: true,
  simulationStatus: true,
});

export type ChargePoint = Prisma.ChargePointGetPayload<{ select: typeof defaultChargePointSelect }>;

const defaultChargePointListPanelItemSelect = Prisma.validator<Prisma.ChargePointSelect>()({
  chargePointId: true,
});

export type ChargePointListPanelItem = Prisma.ChargePointGetPayload<{
  select: typeof defaultChargePointListPanelItemSelect;
}>;

const byIdInputSchema = z.object({
  chargePointId: z.string().nullable(),
});

export type ByIdInput = z.infer<typeof byIdInputSchema>;

const simulateStatusInputSchema = z.object({
  chargePointId: z.string(),
  status: z.nativeEnum(SimulateStatusEnum),
});

export type SimulateStatusInput = z.infer<typeof simulateStatusInputSchema>;

export const chargePointRouter = createTRPCRouter({
  listPanel: publicProcedure.query(() => {
    return prisma.chargePoint.findMany({
      where: {},
      select: defaultChargePointListPanelItemSelect,
    });
  }),
  byId: publicProcedure.input(byIdInputSchema).query(async ({ input }) => {
    const result = await prisma.chargePoint.findUnique({
      where: { chargePointId: input.chargePointId },
      select: defaultChargePointSelect,
    });
    if (!result) {
      throw new TRPCError({
        code: 'NOT_FOUND',
        message: `No charge point id: ${input.chargePointId}`,
      });
    }
    return result;
  }),
  byIdIgnoreNull: publicProcedure.input(byIdInputSchema).query(async ({ input }) => {
    if (!input.chargePointId) return null;
    return prisma.chargePoint.findUnique({
      where: { chargePointId: input.chargePointId },
      select: defaultChargePointSelect,
    });
  }),
  simulateStatus: publicProcedure.input(simulateStatusInputSchema).mutation(({ input }) => {
    return prisma.chargePoint.update({
      where: { chargePointId: input.chargePointId },
      data: {},
      select: defaultChargePointSelect,
    });
  }),
});
