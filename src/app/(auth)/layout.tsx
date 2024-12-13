import React from "react";

export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex h-screen w-screen items-center justify-center">
      <div className="w-96 max-w-[90vw] rounded-md border border-foreground p-8">
        {children}
      </div>
    </div>
  );
}
