import DBChangeUserPlan from "@/db/DBChangeUserPlan";
import { IRqRepUserChange } from "@/utils/interfaces";
import { NextResponse } from "next/server";


export async function PATCH(req: Request) {
    const b:IRqRepUserChange = await req.json();
    try {
        if(b.repartoId) {
            await DBChangeUserPlan(b.repartoId)
            return NextResponse.json({ success: true });
        }
        else return NextResponse.json({ error: "ID ERRONEO" }, { status: 401 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Error interno" }, { status: 500 });
    }
} 