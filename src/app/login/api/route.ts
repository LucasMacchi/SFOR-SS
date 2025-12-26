import DBLogin from "@/db/DBLogin";
import { IRqLogin } from "@/utils/interfaces";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken'

const secret = process.env.TOKEN_SECRET ?? "sistemsdesoluciones"

export async function POST(req: Request) {
    const b:IRqLogin = await req.json();
    try {
        if(b.username && b.password) {
            const res = await DBLogin(b.username,b.password)
            if(!res) return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
            const token = jwt.sign(res,secret,{expiresIn: '72h'});
            const response = NextResponse.json({ success: true, check: res });
            response.cookies.set('JWTKN',token,{httpOnly: true,secure:true,path:'/',sameSite:'lax'})
            console.log(response)
            return response
        }
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: error })   
    }
}