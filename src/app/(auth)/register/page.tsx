"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const { mutate: register, isPending } = api.user.register.useMutation({
    onSuccess: () => {
      toast({
        description: "Account registered successfully",
      });
      router.replace("/");
    },
    onError: () => {
      toast({
        description:
          "Something went wrong while trying to register an account. Please try again later.",
        variant: "destructive",
      });
    },
  });

  return (
    <>
      <h1 className="text-center text-2xl font-bold">Register</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (password.length !== 6) {
            toast({
              description: "Password must be at least 6 characters long.",
              variant: "destructive",
            });
            return;
          }

          if (password !== confirmPassword) {
            toast({
              description: "Passwords do not match",
              variant: "destructive",
            });
            return;
          }

          register({
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
        <div className="h-2" />
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <Input
          id="confirmPassword"
          placeholder="••••••••"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Button className="mt-4 w-full" isLoading={isPending}>
          Register
        </Button>
      </form>
      <div className="mt-4 text-center">
        <span>Already have an account</span>{" "}
        <Link href="/login" className="font-bold hover:underline">
          Login here
        </Link>
      </div>
    </>
  );
}
