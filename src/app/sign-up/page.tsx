import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SignUp() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-md space-y-4 rounded-lg border p-4">
        <div className="text-center">
          <div className="font-semibold">Sign Up to FEPrep</div>
          <div className="text-sm text-muted-foreground">
            Create an account using your UCF NID
          </div>
        </div>

        <div className="space-y-2">
          <div>
            <Label>NID</Label>
            <Input placeholder="jd123456" type="email" />
          </div>
          <div>
            <Label>Password</Label>
            <Input type="password" />
          </div>
        </div>

        <Button size="sm" className="w-full">
          Sign Up
        </Button>

        <div className="mt-2 text-center text-sm text-muted-foreground">
          Already have an account?
          <Link href="/sign-in" className="text-foreground">
            {" "}
            Sign In
          </Link>
        </div>
      </form>
    </main>
  );
}
