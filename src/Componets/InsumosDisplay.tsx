"use client"
import { IInsumo } from "@/utils/interfaces";
// @ts-ignore
import "./css/hoverTableCell.css";
import { useState } from "react";


export default function InsumosDisplay ({insumos,modInsumo}:{insumos:IInsumo[],modInsumo:(id:number,column:string,newV:string) => Promise<boolean>}) {

    const [insumoArr, setInsumoArr] = useState<IInsumo[]>(insumos)
    const [up,setUpd] = useState(0)
    const changeValue = async (id:number,column:string) => {
        const newV = prompt("Ingrese el nuevo valor numerico")
        if(newV && parseFloat(newV)) {
            if(confirm("¿Quieres cambiar el valor'")){
                const res = await modInsumo(id,column,newV)
                if(res) alert("Insumo modificado")
                else alert("Error al modificar el insumo")
                insumos.forEach(i => {
                    if(i.ins_id === id) {
                        i[column] = parseFloat(newV)
                    }
                });
                setInsumoArr(insumos)
                setUpd(up+1)
            }
            
        }
        else if(newV && !parseFloat(newV)) alert("Ingrese un valor numerico valido.")
    }

    return (
        <div>
            <div style={{display:"flex",justifyContent:"center",marginBottom: 35}}>
                <table style={{width: "85%"}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "8%"}}>COD 1</th>
                            <th style={{border: "1px solid", width: "8%"}}>COD 2</th>
                            <th style={{border: "1px solid", width: "8%"}}>COD 3</th>
                            <th style={{border: "1px solid", width: "20%"}}>DESCRIPCION</th>
                            <th style={{border: "1px solid", width: "8%"}}>CAJAS X PALET</th>
                            <th style={{border: "1px solid", width: "8%"}}>UNIDADES X CAJA</th>
                            <th style={{border: "1px solid", width: "8%"}}>RAC. X UNIDAD</th>
                            <th style={{border: "1px solid", width: "8%"}}>RAC. X CAJA</th>
                            <th style={{border: "1px solid", width: "8%"}}>GR. X UNIDAD</th>
                            <th style={{border: "1px solid", width: "8%"}}>GR. X RACION</th>
                            <th style={{border: "1px solid", width: "8%"}}>CALCULABLE</th>
                        </tr>
                        {insumoArr.map((i) => (
                        <tr key={i.ins_id}>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod1}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod2}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod3}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{i.des}</th>
                            <th onClick={() => changeValue(i.ins_id,"caja_palet")} id="cnt" style={{border: "1px solid", width: "8%"}}>{i.caja_palet}</th>
                            <th onClick={() => changeValue(i.ins_id,"unidades_caja")} id="cnt" style={{border: "1px solid", width: "8%"}}>{i.unidades_caja}</th>
                            <th onClick={() => changeValue(i.ins_id,"racunidad")} id="cnt" style={{border: "1px solid", width: "8%"}}>{i.racunidad}</th>
                            <th onClick={() => changeValue(i.ins_id,"raccajas")} id="cnt" style={{border: "1px solid", width: "8%"}}>{i.raccaja}</th>
                            <th onClick={() => changeValue(i.ins_id,"gr_unidad")} id="cnt" style={{border: "1px solid", width: "8%"}}>{i.gr_unidad}</th>
                            <th onClick={() => changeValue(i.ins_id,"gr_racion")} id="cnt" style={{border: "1px solid", width: "8%"}}>{i.gr_racion}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.calculable ? "SI":"NO"}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}