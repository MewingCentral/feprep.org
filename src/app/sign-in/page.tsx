import Link from "next/link";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default function SignIn() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-md space-y-4 rounded-lg border p-4">
        <div className="text-center">
          <div className="font-semibold">Sign In to FEPrep</div>
          <div className="text-sm text-muted-foreground">
            Sign in using your UCF NID and password
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
          Sign In
        </Button>

        <div className="flex justify-between text-sm text-muted-foreground">
          <Link href="/reset-password">Forgot password?</Link>
          <Link href="/sign-up">Sign Up</Link>
        </div>
      </form>
    </main>
  );
}
