"use client"

import { btn_s_style } from "@/utils/styles";


export default function ({id,changeData,bool,vbool}:{id:number,changeData: (id:number,payload:string) => Promise<boolean>,bool: boolean,vbool: boolean}) {
    
    const changeDataFromConfig = async () => {
        if(!bool) {
            const newPayload = prompt("INGRESE EL NUEVO VALOR: ")
            if(newPayload) {
                const data = await changeData(id,newPayload)
                if(data) {
                    alert("VALOR CAMBIADO")
                    window.location.reload()
                }
                else alert("ERROR AL CAMBIAR EL VALOR")
            }
        }
        else {
            if(confirm(`¿Quires ${vbool ? "DESHABILITAR" : "HABILITAR"}`)) {
                const data = await changeData(id,vbool ? "0" : "1")
                if(data) {
                    alert("VALOR CAMBIADO")
                    window.location.reload()
                }
                else alert("ERROR AL CAMBIAR EL VALOR")
            }
        }

    }

    return (
        <button style={{...btn_s_style, marginLeft: 10}} onClick={() => changeDataFromConfig()}>MODIFICAR</button>
    )
}