import { NextRequest, NextResponse } from "next/server";
import { createHmac } from "crypto";

function verifySession(cookieValue: string): string | null {
    const secret = process.env.SESSION_SECRET;
    if (!secret) return null;

    const dotIndex = cookieValue.lastIndexOf(".");
    if (dotIndex === -1) return null;

    const role = cookieValue.slice(0, dotIndex);
    const sig = cookieValue.slice(dotIndex + 1);
    if (!role || !sig) return null;

    const expected = createHmac("sha256", secret).update(role).digest("hex");

    // Constant-time comparison để tránh timing attack
    if (expected.length !== sig.length) return null;
    let mismatch = 0;
    for (let i = 0; i < expected.length; i++) {
        mismatch |= expected.charCodeAt(i) ^ sig.charCodeAt(i);
    }
    return mismatch === 0 ? role : null;
}

// Routes chỉ dành riêng cho prince
const PRINCE_ONLY = ["/admin", "/add", "/edit"];

export function proxy(req: NextRequest) {
    const session = req.cookies.get("session")?.value;
    const role = session ? verifySession(session) : null;
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
