"use client"

import { IUsuario } from "@/utils/interfaces"
import { btn_s_style, text_2_t_style } from "@/utils/styles"
import { useState } from "react"


export default function AddUser ({addUserFn}:{addUserFn: (u:IUsuario) => Promise<boolean>}) {

    const [add, setAdd] = useState<IUsuario>({
        userId: 1,
        rol: 3,
        username: "",
        email: "",
        password: ""
    })

    const createUser = async () => {
        if(add.username.length > 0 && add.email.length > 0 && add.password.length > 4) {
            if(confirm("¿Quieres crear al nuevo usuario "+add.username+"?")) {
                const res = await addUserFn(add)
                if(res) {
                    alert("Usuario creado.")
                    window.location.reload()
                } else alert("Error al crear el usuario.")
            }
        }
        else alert("Faltan datos o contraseña muy corta (minimo 5 caracteres)")
    }

    return (
        <div>
            <div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 20}}>NOMBRE DE USUARIO</h2>
                    <input name="plan-inpt" value={add.username} style={{width: 350,fontSize:20,marginBottom: 20}}
                    onChange={(e) => setAdd({...add,username:e.target.value})}/>
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 20}}>EMAIL</h2>
                    <input name="plan-inpt" value={add.email} style={{width: 350,fontSize:20,marginBottom: 20}}
                    onChange={(e) => setAdd({...add,email:e.target.value})}/>
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 20}}>CONTRASEÑA</h2>
                    <input name="plan-inpt" value={add.password} style={{width: 350,fontSize:20,marginBottom: 20}}
                    onChange={(e) => setAdd({...add,password:e.target.value})}/>
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 20}}>ROL (1 ADMIN - 2 ADMINISTRATIVO - 3 OPERARIO)</h2>
                    <input name="plan-inpt" type="number" value={add.rol} style={{width: 50,fontSize:20,marginBottom: 20}} max={3} min={1}
                    onChange={(e) => setAdd({...add,rol:parseInt(e.target.value)})}/>
                </div>
                <div style={{marginTop: 15}}>
                    <button style={btn_s_style} onClick={() => createUser()}>CREAR USUARIO</button>
                </div>
            </div>
        </div>
    )
}