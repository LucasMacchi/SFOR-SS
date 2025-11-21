"use client"

import Link from "next/link"
import { CSSProperties, useEffect } from "react"
import { usePathname } from "next/navigation"

export default function LinkMenu ({where,titulo} : {where: string,titulo: string}) {
    const currentPage = usePathname()
    const linkStyle: CSSProperties = {
        fontSize: 30,
        color: "white",
        textDecoration: "none",
        marginBottom: 8
    }

    const linkSelectedStyle: CSSProperties = {
      color: "black",
      textDecoration: "none",
      fontSize: 30,
      backgroundColor: "white",
      marginBottom: 8,
      borderRadius: 3,
      padding: 1
    }

    const changeToSelected = (): CSSProperties => {
        if(currentPage === where) {
            return linkSelectedStyle
        }
        else return linkStyle
    }


    return <Link href={where} style={changeToSelected()}>{titulo.toUpperCase()}</Link>
}