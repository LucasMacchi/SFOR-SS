import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'
import decodeJWT from './decodeJWT'
import { ROLES } from './enums'

const secret = process.env.TOKEN_SECRET ?? "sistemsdesoluciones"

export default async function (access:ROLES): Promise<boolean> {
    try {
        const tokn = (await cookies()).get('JWTKN')?.value
        const usr = await decodeJWT()
        if(tokn && usr && usr.rol <= access) {
            jwt.verify(tokn,secret)
            return true
        }
        else {
            return false
        }
    } catch (error) {
        console.log(error)
        return false
    }

}