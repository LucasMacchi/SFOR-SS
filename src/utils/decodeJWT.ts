import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";


export default async function (): Promise<IUserData | null> {
    try {
        const tokn = (await cookies()).get('JWTKN')?.value
        if(tokn) {
            const data : IUserData = jwtDecode(tokn)
            return data
        }
        else return null
    } catch (error) {
        console.log(error)
        return null
    }
}