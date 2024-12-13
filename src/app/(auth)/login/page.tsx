"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const { mutate: login, isPending } = api.user.login.useMutation({
    onSuccess: () => {
      toast({
        description: "Login success",
      });
      router.replace("/");
    },
    onError: (e) => {
      toast({
        description: e.message,
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Login</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (!username) {
            toast({
              description: "Username is required",
              variant: "destructive",
            });
            return;
          }

          if (!password) {
            toast({
              description: "Password is required",
              variant: "destructive",
            });
            return;
          }

          login({
            username,
            password,
          });
        }}
      >
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
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button className="mt-4 w-full" isLoading={isPending}>
          Login
        </Button>
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
