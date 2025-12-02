import { IUserData } from "@/utils/interfaces";
import clientReturner from "./clientReturner";
import jwt from 'jsonwebtoken'
import { cookies } from "next/headers";

const secret = process.env.TOKEN_SECRET ?? "sistemsdesoluciones"
const expireTime = process.env.TOKEN_EXPIRE ?? '60s'

export default async function (username: string, password: string): Promise<IUserData | null> {
    const conn = clientReturner()
    try {
        const sql = `SELECT * FROM public.user where username = '${username}' and password = '${password}';`
        await conn.connect()
        const data:IUserData = (await conn.query(sql)).rows[0]
        await conn.end()
        if(data.username === username && expireTime && secret) {
            //CAMBIAR EL TIEMPO DE EXPIRACION
            const token = jwt.sign(data,secret,{expiresIn: '1h'});
            (await cookies()).set('JWTKN',token,{httpOnly: true,secure:true})
            return data
        }
        else {
            console.log("failed")
            return null
        }
    } catch (error) {
        console.log("err")
        await conn.end()
        throw new Error("Error al intentar logearse")
    }
}