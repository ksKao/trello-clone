import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

export const taskRouter = createTRPCRouter({
  getAllColumns: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.db.column.findMany({
      where: {
        userId: ctx.auth.user.id,
      },
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
  addColumn: protectedProcedure
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
          userId: ctx.auth.user.id,
        },
      });
    }),
  addTask: protectedProcedure
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
  sortColumn: protectedProcedure
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
            userId: ctx.auth.user.id,
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
  updateTaskOrder: protectedProcedure
    .input(
      z.array(
        z.object({
          id: z.string().cuid("Invalid task ID"),
          columnId: z.string().cuid("Invalid column ID"),
          order: z
            .number()
            .min(0, "Sort order cannot be negative")
            .int("Sort order must be an integer"),
        }),
      ),
    )
    .mutation(async ({ input, ctx }) => {
      const transaction = input.map((task) =>
        ctx.db.task.update({
          where: {
            id: task.id,
            column: {
              userId: ctx.auth.user.id,
            },
          },
          data: {
            columnId: task.columnId,
            order: task.order,
          },
        }),
      );

      await ctx.db.$transaction(transaction, {
        isolationLevel: "Serializable",
      });
    }),
  editColumnName: protectedProcedure
    .input(
      z.object({
        columnId: z.string().cuid("Invalid column ID"),
        newTitle: z.string().min(1, "Column name is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.column.update({
        data: {
          title: input.newTitle,
        },
        where: {
          id: input.columnId,
          userId: ctx.auth.user.id,
        },
      });
    }),
  deleteColumn: protectedProcedure
    .input(z.string().cuid("Invalid column ID"))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.column.delete({
        where: {
          id: input,
          userId: ctx.auth.user.id,
        },
      });
    }),
  editTask: protectedProcedure
    .input(
      z.object({
        taskId: z.string().cuid("Invalid task ID"),
        newTitle: z.string().min(1, "Title is required"),
        newDescription: z.string(),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.update({
        data: {
          title: input.newTitle,
          description: input.newDescription,
        },
        where: {
          id: input.taskId,
          column: {
            userId: ctx.auth.user.id,
          },
        },
      });
    }),
  deleteTask: protectedProcedure
    .input(z.string().cuid("Invalid task ID"))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.task.delete({
        where: {
          id: input,
          column: {
            userId: ctx.auth.user.id,
          },
        },
      });
    }),
});
