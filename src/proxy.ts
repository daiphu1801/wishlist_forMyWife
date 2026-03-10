import { NextRequest, NextResponse } from "next/server";

// Dùng Web Crypto API (tương thích Edge Runtime — không dùng Node.js crypto)
async function verifySession(cookieValue: string): Promise<string | null> {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return null;

    const dotIndex = cookieValue.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const role = cookieValue.slice(0, dotIndex);
    const sig = cookieValue.slice(dotIndex + 1);
    if (!role || !sig) return null;

    const encoder = new TextEncoder();
    const keyData = encoder.encode(secret);

    const key = await crypto.subtle.importKey(
        "raw",
        keyData,
        { name: "HMAC", hash: "SHA-256" },
        false,
        ["sign"]
    );

    const signatureBuffer = await crypto.subtle.sign("HMAC", key, encoder.encode(role));

    // Convert ArrayBuffer → hex string
    const expected = Array.from(new Uint8Array(signatureBuffer))
        .map((b) => b.toString(16).padStart(2, "0"))
        .join("");

    if (expected.length !== sig.length) return null;

    // Constant-time comparison để tránh timing attack
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
        mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    }
    return mismatch === 0 ? role : null;
}

// Routes chỉ dành riêng cho prince (admin)
const PRINCE_ONLY = ["/admin"];

export async function proxy(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    const role = session ? await verifySession(session) : null;
    const { pathname } = req.nextUrl;

    // Chưa đăng nhập → về trang login
    if (!role) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    // Chỉ prince mới được vào khu vực quản trị
    const isPrinceOnly = PRINCE_ONLY.some((p) => pathname.startsWith(p));
    if (isPrinceOnly && role !== "prince") {
        return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: ["/", "/gift/:path*", "/admin/:path*", "/add", "/edit/:path*"],
};
