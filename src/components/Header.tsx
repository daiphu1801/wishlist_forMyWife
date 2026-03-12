import { getSessionRole } from "@/lib/session";
import HeaderClient from "./HeaderClient";

export default async function Header() {
    const role = await getSessionRole();
    return <HeaderClient role={role} />;
}
