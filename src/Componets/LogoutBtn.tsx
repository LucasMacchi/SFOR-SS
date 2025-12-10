"use client"
import Link from "next/link"
import { CSSProperties } from "react"

export default function LogoutBtn ({logoutFn}:{logoutFn: () => Promise<boolean>}) {

    const linkStyle: CSSProperties = {
        fontSize: 30,
        color: "white",
        textDecoration: "none",
        marginBottom: 8,
        backgroundColor: "red",
        borderRadius: 3,
        padding: 1
    }

    const logout = async () => {
        await logoutFn()
    }

    return <Link href={"/login"} style={linkStyle} onClick={() => logout()}>CERRAR SESION</Link>

}