"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import React, { useState } from "react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Login</h1>
      <form>
        <Label htmlFor="username">Username</Label>
        <Input
          id="username"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
        <div className="h-2" />
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="mt-4 w-full">Login</Button>
      </form>
      <div className="mt-4 text-center">
        <span>Don&apos;t have an account?</span>{" "}
        <Link href="/register" className="font-bold hover:underline">
          Register here
        </Link>
      </div>
    </>
  );
}
