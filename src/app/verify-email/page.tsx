import { Button } from "~/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "~/components/ui/input-otp";

export default function VerifyEmail() {
  return (
    <main className="flex min-h-screen items-center justify-center">
      <form className="w-full max-w-md space-y-4 rounded-lg border p-4">
        <div className="text-center">
          <div className="font-semibold">Verify Your Email</div>
          <div className="text-sm text-muted-foreground">
            Enter the one-time code sent to your email
          </div>
        </div>

        <div className="mb-2 flex flex-col items-center gap-2">
          <InputOTP name="code" maxLength={8}>
            <InputOTPGroup>
              <InputOTPSlot index={0} />
              <InputOTPSlot index={1} />
              <InputOTPSlot index={2} />
              <InputOTPSlot index={3} />
              <InputOTPSlot index={4} />
              <InputOTPSlot index={5} />
              <InputOTPSlot index={6} />
              <InputOTPSlot index={7} />
            </InputOTPGroup>
          </InputOTP>
        </div>

        <Button size="sm" className="w-full">
          Sign In
        </Button>

        <div className="mt-2 text-center text-sm text-muted-foreground">
          Didn&apos;t receive a code?
          <span aria-label="button" tabIndex={0} className="text-foreground">
            {" "}
            Resend
          </span>
        </div>
      </form>
    </main>
  );
}
