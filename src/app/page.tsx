import { getGifts } from "@/actions/gift";
import WishlistClient from "./WishlistClient";

export default async function WishlistPage() {
  const result = await getGifts();
  const raw = result.success ? result.gifts! : [];
  const gifts = raw.map((g) => ({
    ...g,
    url: g.url ?? undefined,
    notes: g.notes ?? undefined,
    status: g.status as "wishing" | "bought",
    priority: g.priority as "normal" | "high" | "must-have",
  }));
  return <WishlistClient gifts={gifts} />;
}
