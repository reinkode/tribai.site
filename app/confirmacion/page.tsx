import type { Metadata } from "next";
import { ConfirmationView } from "@/components/ConfirmationView";

export const metadata: Metadata = {
  title: "Confirmación — TribAI",
  robots: { index: false, follow: false },
};

export default async function ConfirmacionPage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;
  return <ConfirmationView status={status} />;
}
