import { AuthStoreProvider } from "~/providers/auth-store-provider";
import { Navbar } from "./_components/navbar";
import { validateRequest } from "~/lib/auth/validate-request";

export default async function Problems() {
  const auth = await validateRequest();
  return (
    <AuthStoreProvider auth={auth}>
      <Navbar />
      <main className="px-8">Problems</main>
    </AuthStoreProvider>
  );
}
