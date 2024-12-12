import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getAllColumns: publicProcedure.query(async ({ ctx }) => {
    return await ctx.db.column.findMany({
      include: {
        tasks: {
          orderBy: {
            order: "asc",
          },
        },
      },
      orderBy: {
        order: "asc",
      },
    });
  }),
  addColumn: publicProcedure
    .input(
      z.object({
        title: z.string().min(1, "Title is required"),
        order: z.number().nonnegative("Order must be positive number"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.column.create({
        data: {
          ...input,
        },
      });
    }),
  addTask: publicProcedure
    .input(
      z.object({
        columnId: z.string().cuid("Invalid column ID"),
        title: z.string().min(1, "Title is required"),
        description: z.string(),
        order: z.number().nonnegative("Order must be positive number"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.create({
        data: {
          ...input,
        },
      });
    }),
  sortColumn: publicProcedure
    .input(
      z.array(
        z.object({
          id: z.string().cuid("Invalid column ID"),
          sortOrder: z
            .number()
            .min(0, "Sort order must not be negative")
            .int("Number must be an integer"),
        }),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const transaction = input.map((c) =>
        ctx.db.column.update({
          where: {
            id: c.id,
          },
          data: {
            order: c.sortOrder,
          },
        }),
      );

      await ctx.db.$transaction(transaction, {
        isolationLevel: "Serializable",
      });
    }),
});
