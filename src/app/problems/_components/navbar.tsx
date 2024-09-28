import Link from "next/link";
import { MobileDropdown } from "./mobile-dropdown";

export function Navbar() {
  return (
    <nav className="mb-2 flex h-14 items-center justify-between border-b px-8">
      <Link href="/" className="flex items-center gap-2 text-xl font-bold">
        FEPrep
      </Link>
      <MobileDropdown />
    </nav>
  );
}
