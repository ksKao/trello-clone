"use client";
import { type UserSafe } from "@/lib/auth";
import React from "react";
import { Button } from "./ui/button";
import { api } from "@/trpc/react";
import { toast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

export default function Navbar({ user }: { user: UserSafe }) {
  const router = useRouter();
  const { mutate: logout, isPending } = api.user.logout.useMutation({
    onSuccess: () => {
      toast({
        description: "Log out success",
      });
      router.replace("/login");
    },
    onError: () => {
      toast({
        description: "Something went wrong while trying to log out.",
        variant: "destructive",
      });
    },
  });

  return (
    <nav className="flex h-20 w-screen items-center justify-between px-6">
      <h2 className="text-lg font-bold">Hi, {user.username}!</h2>
      <Button onClick={() => logout()} isLoading={isPending}>
        Log Out
      </Button>
    </nav>
  );
}
