import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import {
  createSession,
  generateSessionToken,
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

      const salt = encodeHexLowerCase(
        crypto.getRandomValues(new Uint8Array(20)),
      );

      const user = await ctx.db.user.create({
        data: {
          username: input.username,
          password: encodeHexLowerCase(
            sha256(new TextEncoder().encode(input.password + salt)),
          ),
          salt: salt,
        },
      });

      const token = generateSessionToken();
      const session = await createSession(token, user.id);
      await setSessionTokenCookie(token, session.expiresAt);
    }),
});
