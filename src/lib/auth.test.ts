import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createSession,
  hashPasswordWithSalt,
  validateSessionToken,
} from "./auth";
import { sha256 } from "@oslojs/crypto/sha2";
import { encodeHexLowerCase } from "@oslojs/encoding";
import { db } from "@/lib/__mocks__/db";
import { appRouter } from "@/server/api/root";
import { createCallerFactory } from "@/server/api/trpc";

vi.mock("@/server/db", async () => {
  const actual = await vi.importActual("@/lib/__mocks__/db");
  return {
    ...actual,
  };
});

vi.mock("./auth", async () => {
  const auth = await vi.importActual("./auth");

  return {
    ...auth,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setSessionTokenCookie: () => {},
  };
});

describe("auth", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("should return correct password + hash combination for SHA256", () => {
    // SHA256 hash for 123123
    const correctHash =
      "96cae35ce8a9b0244178bf28e4966c2ce1b8385723a96a6b838858cdd6ca0a1e";

    const hashed = hashPasswordWithSalt("123", "123");

    expect(hashed).toBe(correctHash);
  });

  it("should create session with the correct token", async () => {
    const token = "123";
    const userId = "123";
    const correctSessionId = encodeHexLowerCase(
      sha256(new TextEncoder().encode(token)),
    );

    const session = await createSession(token, userId);

    expect(session.id).toBe(correctSessionId);
    expect(session.userId).toBe(userId);
  });

  it("should return user and session object if session is found and not expired", async () => {
    const sessionId = "123";
    const session = await createSession(sessionId, "123");

    db.session.findUnique.mockResolvedValueOnce({
      ...session,
    });

    const result = await validateSessionToken(sessionId);

    expect(result.session).not.toBeNull();
    expect(result.user).not.toBeNull();
  });

  it("should return null if session is not found", async () => {
    const result = await validateSessionToken("non_existing_token");

    expect(result.user).toBeNull();
    expect(result.session).toBeNull();
  });

  it("should return null if session has expired", async () => {
    const sessionId = "123";

    const session = await createSession(sessionId, "123");

    // set session to expire on yesterday
    db.session.findUnique.mockResolvedValueOnce({
      ...session,
      expiresAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
    });

    const result = await validateSessionToken(sessionId);

    expect(result.user).toBeNull();
    expect(result.session).toBeNull();
  });

  const caller = createCallerFactory(appRouter)({
    headers: new Headers(),
    auth: {
      user: null,
      session: null,
    },
    db,
  });

  it("should fail when registering user with same username", async () => {
    db.user.findFirst.mockResolvedValueOnce({
      id: "123",
      username: "123",
      salt: "salt",
      password: "hashed_pw",
    });

    await expect(
      async () =>
        await caller.user.register({
          username: "123",
          password: "123456",
        }),
    ).rejects.toThrowError(/Username already exist/);
  });

  it("should fail when trying to login with user that does not exist", async () => {
    await expect(
      async () =>
        await caller.user.login({
          username: "123",
          password: "random password hash",
        }),
    ).rejects.toThrowError(/Invalid username or password/);
  });

  it("should fail when password is incorrect", async () => {
    const salt = "123";
    const username = "username";
    const correctPassword = "123";
    const correctHash = hashPasswordWithSalt(correctPassword, salt);

    db.user.findFirst.mockResolvedValue({
      id: "123",
      username,
      salt,
      password: correctHash,
    });

    await expect(async () => {
      await caller.user.login({
        username,
        password: correctPassword + "4",
      });
    }).rejects.toThrowError(/Invalid username or password/);
  });

  it("should succeed when username and password + salt hash matches", async () => {
    const salt = "123";
    const username = "username";
    const correctPassword = "123";
    const correctHash = hashPasswordWithSalt(correctPassword, salt);

    db.user.findFirst.mockResolvedValue({
      id: "123",
      username,
      salt,
      password: correctHash,
    });

    await expect(
      caller.user.login({
        username,
        password: correctPassword,
      }),
    ).resolves.not.toThrow();
  });
});
