import jwt from 'jsonwebtoken'
import { cookies } from 'next/headers'

const secret = process.env.TOKEN_SECRET ?? "sistemsdesoluciones"

export default async function (): Promise<boolean> {
    try {
        const tokn = (await cookies()).get('JWTKN')?.value
        if(tokn) {
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