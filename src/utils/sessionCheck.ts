import jwt from 'jsonwebtoken'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'

const secret = process.env.TOKEN_SECRET ?? "sistemsdesoluciones"

export default async function () {
    try {
        const tokn = (await cookies()).get('JWTKN')?.value
        if(tokn) {
            const check = jwt.verify(tokn,secret)
            if(!check) {
                redirect("/login")
            }
        }
        else {
            redirect("/login")
        }
    } catch (error) {
        console.log(error)
        redirect("/login")
    }

}