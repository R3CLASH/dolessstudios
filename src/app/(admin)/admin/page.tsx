import { redirect } from "next/navigation";
import { requireAdmin } from "@/lib/adminSession";

/** /admin itself is just the way in: the queue is what you actually want. */

export const dynamic = "force-dynamic";

export default async function AdminIndexPage() {
  await requireAdmin();
  redirect("/admin/orders");
}
