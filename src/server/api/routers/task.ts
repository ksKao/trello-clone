import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getAllColumns: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.column.findMany({
      include: {
        task: true,
      },
    });
  }),
  addColumn: publicProcedure
    .input(z.string().min(1, "Column title is required"))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.column.create({
        data: {
          name: input,
        },
      });
    }),
});
