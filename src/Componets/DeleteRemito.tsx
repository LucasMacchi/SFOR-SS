"use client"
import { btn_d_style } from "@/utils/styles";


export default function DeleteRemito ({deleteFn}:{deleteFn: () => Promise<boolean>}) {

    const deleteRet = async () => {
        if(confirm("¿Quieres eliminar el remito? Es una accion irreversible.")) {
            const res = await deleteFn()
            if(res) alert("Remito eliminado exitosamente.")
            else alert("Error al eliminar remito.")
        }
    }
    return(
        <button style={{...btn_d_style, fontSize: 20}} onClick={() => deleteRet()}>ELIMINAR REMITO</button>
    )
}