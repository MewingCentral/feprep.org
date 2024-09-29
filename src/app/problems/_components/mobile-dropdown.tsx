"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { MenuIcon } from "lucide-react";
import { Button } from "~/components/ui/button";
import { DropdownMenuSeparator } from "~/components/ui/dropdown-menu";
import { useAuthStore } from "~/providers/auth-store-provider";

export function MobileDropdown() {
  const session = useAuthStore((state) => state.session);
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="h-9 w-9 sm:hidden" size="icon">
          <MenuIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Multiplayer</DropdownMenuItem>
        {session && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Sign Out</DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
