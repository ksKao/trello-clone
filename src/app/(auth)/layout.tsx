import { getCurrentSession } from "@/lib/auth";
import { redirect } from "next/navigation";
import React from "react";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getCurrentSession();

  if (user) redirect("/");

  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-96 max-w-[90vw] rounded-md border border-foreground p-8">
        {children}
      </div>
    </div>
  );
}
