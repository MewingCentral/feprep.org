import { Label } from "~/components/ui/label";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";

export default function ForgotPassword() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-md space-y-4 rounded-lg border p-4">
        <div className="text-center">
          <div className="font-semibold">Forgot your password?</div>
          <div className="text-sm text-muted-foreground">
            A password reset link will be sent to your email
          </div>
        </div>

        <div>
          <Label>NID</Label>
          <Input placeholder="jd123456" type="email" />
        </div>

        <Button size="sm" className="w-full">
          Reset My Password
        </Button>
      </form>
    </main>
  );
}
