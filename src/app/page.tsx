import { api, HydrateClient } from "~/trpc/server";

export default async function Home() {
  const greeting = await api.greeting();
  return (
    <HydrateClient>
      <main>{greeting}</main>
    </HydrateClient>
  );
}
