"use client"
import { IUsuario } from "@/utils/interfaces";

//@ts-ignore
import "./css/hoverTableCell.css"
import { text_2_t_style } from "@/utils/styles";

export default function DisplayUsers ({usuarios,changeUserFn}:{usuarios:IUsuario[],
    changeUserFn: (id:number,column:string,newV:string) => Promise<boolean>}) {
    
    const editData = async (id: number,prev:string,column: string) => {
        const newData = prompt("Ingrese el nuevo valor: ",prev)
        if(confirm(`¿Quieres cambiar de ${prev} a ${newData} en la columna "${column}"?`)) {
            if(newData) {
                const res = await changeUserFn(id,column,newData)
                if(res) {
                    alert("Usuario modificado")
                    window.location.reload()
                } else alert("Error al modificar usuario.")
            }
            else alert("Nuevo valor invalido")
        }
    }
    
    return(
        <div>
            <div>
            <h2 style={text_2_t_style}>MODIFICAR USUARIOS</h2>
            <div style={{maxHeight: 350,height:350, overflow: "scroll"}}>
                <table style={{width: "90%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "25%"}}>USERNAME</th>
                            <th style={{border: "1px solid", width: "25%"}}>EMAIL</th>
                            <th style={{border: "1px solid", width: "25%"}}>PASSWORD</th>
                            <th style={{border: "1px solid", width: "25%"}}>ROL</th>
                        </tr>
                        {usuarios.map((d,i) => (
                        <tr key={i} >
                            <th onClick={() => editData(d.userId,d.username,"username")} id="cnt" style={{border: "1px solid", width: "25%",textAlign: "center"}}>{d.username}</th>
                            <th onClick={() => editData(d.userId,d.email,"email")} id="cnt" style={{border: "1px solid", width: "25%",textAlign: "center"}}>{d.email}</th>
                            <th onClick={() => editData(d.userId,d.password,"password")} id="cnt" style={{border: "1px solid", width: "25%",textAlign: "center"}}>{d.password}</th>
                            <th onClick={() => editData(d.userId,d.rol.toString(),"rol")} id="cnt" style={{border: "1px solid", width: "25%",textAlign: "center"}}>{d.rol}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            </div>
        </div>
    )
}