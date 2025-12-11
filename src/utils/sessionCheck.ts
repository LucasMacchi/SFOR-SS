import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import decodeJWT from './decodeJWT'
import { IUserData } from './interfaces'
import { jwtDecode } from 'jwt-decode'

const secret = process.env.TOKEN_SECRET ?? "sistemsdesoluciones"

export default async function (min:number) {
    try {
        const tokn = (await cookies()).get('JWTKN')?.value
        if(tokn) {
            const usr : IUserData = jwtDecode(tokn)
            const check = jwt.verify(tokn,secret)
            if(!check) {
                redirect("/login")
            }
            if(usr.rol > min) redirect("/inicio")
        }
        else {
            redirect("/login")
        }
    } catch (error) {
        console.log(error)
        redirect("/login")
    }

}