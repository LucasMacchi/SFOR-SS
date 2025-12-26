import { IUserData } from "@/utils/interfaces";
import clientReturner from "./clientReturner";

const secret = process.env.TOKEN_SECRET ?? "sistemsdesoluciones"
const expireTime = process.env.TOKEN_EXPIRE ?? '60s'

export default async function (username: string, password: string): Promise<IUserData | null> {
    const conn = clientReturner()
    try {
        const sql = `SELECT * FROM public.user where username = '${username}' and password = '${password}';`
        await conn.connect()
        const data:IUserData = (await conn.query(sql)).rows[0]
        await conn.end()
        console.log("BASE DE DATOS CHECK === ",data)
        if(data.username === username && expireTime && secret) {
            //CAMBIAR EL TIEMPO DE EXPIRACION
            return data
        }
        else {
            console.log("failed")
            return null
        }
    } catch (error) {
        console.log(error)
        await conn.end()
        throw new Error("Error al intentar logearse")
    }
}