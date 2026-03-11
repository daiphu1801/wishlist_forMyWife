import { getGifts } from "@/actions/gift";
import AdminGiftsClient from "./AdminGiftsClient";

export default async function AdminGiftsPage() {
    const result = await getGifts();
    const gifts = result.success
        ? result.gifts!.map((g) => ({
              ...g,
              url: g.url ?? undefined,
              notes: g.notes ?? undefined,
              createdAt: new Date(g.createdAt).toISOString(),
              updatedAt: new Date(g.updatedAt).toISOString(),
          }))
        : [];

    return <AdminGiftsClient gifts={gifts} />;
}
