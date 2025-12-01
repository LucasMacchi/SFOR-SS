import { NextResponse } from "next/server";
import { IRqStChange, IRqUniq } from "@/utils/interfaces";
import DBCheckExist from "@/db/DBCheckExist";
import DBChangeRemitoState from "@/db/DBChangeRemitoState";


export async function GET(req: Request) {
    const b:IRqUniq = await req.json();
    try {
        if(b.numero && b.pv) {
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
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
        return NextResponse.json({ error: error }, { status: 500 });
    }
}

export async function PATCH(req: Request) {
    const b:IRqStChange = await req.json();
    try {
        if(b.estado_id && b.estado.length > 0 && b.remito) {
            const res = await DBChangeRemitoState(b.estado_id,b.estado,b.remito)
            return NextResponse.json({ success: true });
        }
        return NextResponse.json({ error: 'ERROR' }, { status: 401 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}