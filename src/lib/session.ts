import { createHmac } from "crypto";
import { cookies } from "next/headers";

function getSecret(): string {
    const secret = process.env.SESSION_SECRET;
    if (!secret) throw new Error("SESSION_SECRET environment variable is not set");
    return secret;
}

export function sign(role: string): string {
    return createHmac("sha256", getSecret()).update(role).digest("hex");
}

export function verifySession(cookieValue: string): string | null {
    const dotIndex = cookieValue.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const role = cookieValue.slice(0, dotIndex);
    const sig = cookieValue.slice(dotIndex + 1);
    if (!role || !sig) return null;

    const expected = createHmac("sha256", getSecret()).update(role).digest("hex");
    if (expected.length !== sig.length) return null;

    // Constant-time comparison để tránh timing attack
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
        mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    }
    return mismatch === 0 ? role : null;
}

export async function getSessionRole(): Promise<string | null> {
    const cookieStore = await cookies();
    const session = cookieStore.get("session")?.value;
    if (!session) return null;
    try {
        return verifySession(session);
    } catch {
        return null;
    }
}

export async function requireAuth(): Promise<void> {
    const role = await getSessionRole();
    if (role !== "prince" && role !== "myfiance") throw new Error("Unauthorized");
}

export async function requirePrince(): Promise<void> {
    const role = await getSessionRole();
    if (role !== "prince") throw new Error("Unauthorized");
}
