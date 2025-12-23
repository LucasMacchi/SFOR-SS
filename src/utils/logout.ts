"use server"
import { cookies } from "next/headers";


export default async function () {
    try {
        (await cookies()).delete("JWTKN")
    } catch (error) {
        console.error(error)
    }
}