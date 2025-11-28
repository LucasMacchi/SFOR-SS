import { NextResponse } from "next/server";
import { IRqUniq } from "@/utils/interfaces";
import DBCheckExist from "@/db/DBCheckExist";


export async function GET(req: Request) {
    const b:IRqUniq = await req.json();
    try {
        if(b.numero && b.pv) {
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    const b:IRqUniq = await req.json();
    try {
        if(b.numero && b.pv) {
            const res = await DBCheckExist(b.pv,b.numero)
            return NextResponse.json({ success: true, check: res });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
}