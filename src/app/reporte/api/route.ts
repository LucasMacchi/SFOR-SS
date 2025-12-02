import DBAddReporte from "@/db/DBAddReporte";
import { IRqReportAdd } from "@/utils/interfaces";
import { NextResponse } from "next/server";



export async function POST(req: Request) {
    const b:IRqReportAdd = await req.json();
    try {
        if(b.categoria_id && b.descripcion && b.remito_id) {
            await DBAddReporte(b)
            return NextResponse.json({ success: true });
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error }, { status: 500 });
    }
}