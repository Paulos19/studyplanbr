"use client";

import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LogoutButton() {
  return (
    <Button 
      variant="ghost" 
      size="icon" 
      onClick={() => signOut({ callbackUrl: "/login" })}
      className="text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
    >
      <LogOut size={20} />
      <span className="sr-only">Sair</span>
    </Button>
  );
}