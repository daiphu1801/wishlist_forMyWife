"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { sign } from "@/lib/session";

export async function login(role: string, passcode: string) {
    const princePass = process.env.PRINCE_PASSCODE;
    const myfiancePass = process.env.MYFIANCE_PASSCODE;

    if (!princePass || !myfiancePass) {
        return { success: false, error: "Server chưa được cấu hình passcode" };
    }

    const valid =
        (role === "prince" && passcode === princePass) ||
        (role === "myfiance" && passcode === myfiancePass);

    if (!valid) {
        return { success: false, error: "Mật mã không đúng rồi! Thử lại nhé 🥺" };
    }

    const cookieStore = await cookies();
    cookieStore.set("session", `${role}.${sign(role)}`, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 60 * 24 * 30, // 30 ngày
        path: "/",
    });

    return { success: true, role };
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete("session");
    redirect("/login");
}
