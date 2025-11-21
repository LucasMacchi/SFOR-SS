import DBLogin from "@/db/DBLogin";
import { NextResponse } from "next/server";
import { redirect } from 'next/navigation'


export async function POST(req: Request) {
    const b:IRqLogin = await req.json();
    try {
        if(b && b.username.length > 0 && b.password.length > 0) {
            const res = await DBLogin(b.username,b.password)
            if(!res) {
                console.log("NO")
                return NextResponse.json({ error: "Login inválido" }, { status: 401 });
            }
            else {
                return NextResponse.json({ success: true, user: res });
            }
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}