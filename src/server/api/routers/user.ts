import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import {
  createSession,
  generateSessionToken,
  hashPasswordWithSalt,
  setSessionTokenCookie,
} from "@/lib/auth";

export const userRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, "Username is required"),
        password: z
          .string()
          .min(6, "Password must be minimum 6 characters long"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      // check if username is taken
      const existingUser = await ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
      });

      if (existingUser)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Username already exist",
        });

      const salt = generateSessionToken();

      const user = await ctx.db.user.create({
        data: {
          username: input.username,
          password: hashPasswordWithSalt(input.password, salt),
          salt: salt,
        },
      });

      const token = generateSessionToken();
      const session = await createSession(token, user.id);
      await setSessionTokenCookie(token, session.expiresAt);
    }),
  login: publicProcedure
    .input(
      z.object({
        username: z.string().min(1, "Username is required"),
        password: z.string().min(1, "Password is required"),
      }),
    )
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findFirst({
        where: {
          username: input.username,
        },
        include: {
          sessions: true,
        },
      });

      if (!user)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });

      if (hashPasswordWithSalt(input.password, user.salt) !== user.password)
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid username or password",
        });

      // invalidate all sessions and create a new session
      await ctx.db.session.deleteMany({
        where: {
          userId: user.id,
        },
      });

      const token = generateSessionToken();
      const session = await createSession(token, user.id);
      await setSessionTokenCookie(token, session.expiresAt);
    }),
});
