"use client"

import { btn_small_style, text_2_s_style } from "@/utils/styles"
import axios from "axios"
import { CSSProperties, useState } from "react"
import { useRouter } from "next/navigation"

export default function Login ({loginFun}:{loginFun: (username:string,password:string) => Promise<boolean>}) {

    const router = useRouter()
    const loginContainerStyle: CSSProperties = {
        backgroundColor: "#4A6EE8",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "25%",
        height: 250,
        justifyContent: "space-evenly",
        padding: 25,
        borderRadius: 4,
    }

    const inputStyle: CSSProperties = {
        height: 25,
        borderRadius: 4,
        fontSize: 16,
        width: "85%",
        margin: 10
    }
    
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")

    const loginFn = async () => {
        setUsername("")
        setPassword("")
        try {
            const res = await axios.post('/login/api',{username,password})
            if(res.data) router.push("/inicio")
        } catch (error) {
            console.error(error)
            return false
        }
    }

    return (
        <div style={loginContainerStyle}>
            <h2 style={text_2_s_style}>INICIAR SESION</h2>
            <div style={{display: "flex", flexDirection: "column"}}>
                <div style={{marginTop: 10}}>
                    <h4 style={text_2_s_style}>Usuario</h4>
                    <input style={inputStyle} type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
                </div>
                <div style={{marginTop: 10}}>
                    <h4 style={text_2_s_style}>Contraseña</h4>
                    <input style={inputStyle} type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
            </div>
            <button style={btn_small_style} onClick={loginFn}>INGRESAR</button>
        </div>
    )
}