import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getAllColumns: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.column.findMany({
      include: {
        tasks: true,
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
  addTask: publicProcedure
    .input(
      z.object({
        columnId: z.string().cuid("Invalid column ID"),
        title: z.string().min(1, "Title is required"),
        description: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.create({
        data: {
          title: input.title,
          description: input.description,
          columnId: input.columnId,
        },
      });
    }),
});
