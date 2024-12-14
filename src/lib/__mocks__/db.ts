import type { PrismaClient } from "@prisma/client";
import { beforeEach } from "vitest";
import { mockReset, mockDeep } from "vitest-mock-extended";

beforeEach(() => {
  mockReset(db);
});

export const db = mockDeep<PrismaClient>();
