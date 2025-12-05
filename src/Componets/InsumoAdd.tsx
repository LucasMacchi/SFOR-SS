"use client"

import { ICreateInsumo } from "@/utils/interfaces"
import { btn_s_style } from "@/utils/styles"
import { useState } from "react"


export default function InsumoAdd ({addFn}:{addFn: (data: ICreateInsumo) => Promise<boolean>})  {

    const [insumo, setInsumo] = useState<ICreateInsumo>({
        cod1:0,
        cod2:0,
        cod3:0,
        des:"",
        caja_palet: 0,
        gr_racion: 0,
        gr_total: 0,
        unitades_caja: 0,
        rac_caja: 0,
        rac_unidad: 0,
        calculable: false
    })

    const createInsumos = async() => {
        if(insumo.cod1 && insumo.cod2 && insumo.cod3 && insumo.gr_racion && insumo.gr_total && insumo.rac_caja && insumo.rac_unidad && insumo.des.length > 0) {
            const res = await addFn(insumo)
            if(res) {
                alert("Insumo creado exitosamente")
                window.location.reload()
            }
            else alert("Erro al crear el insumo")   
        }
        else alert(" Faltan datos.")
    }

    return (
        <div>
            <div style={{display:"flex",justifyContent:"center",marginBottom: 20}}>
                <table style={{width: "70%", fontSize: 16}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "5%"}}>COD 1</th>
                            <th style={{border: "1px solid", width: "5%"}}>COD 2</th>
                            <th style={{border: "1px solid", width: "5%"}}>COD 3</th>
                            <th style={{border: "1px solid", width: "20%"}}>DESCRIPCION</th>
                            <th style={{border: "1px solid", width: "5%"}}>CAJAS X PALET</th>
                            <th style={{border: "1px solid", width: "5%"}}>UNIDADES X CAJA</th>
                            <th style={{border: "1px solid", width: "5%"}}>RAC. X UNIDAD</th>
                            <th style={{border: "1px solid", width: "5%"}}>RAC. X CAJA</th>
                            <th style={{border: "1px solid", width: "5%"}}>GR. X RACION</th>
                            <th style={{border: "1px solid", width: "5%"}}>CALCULABLE</th>
                        </tr>
                        <tr >
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="number" min={0} value={insumo.cod1} 
                                onChange={(e) => setInsumo({...insumo,cod1: parseInt(e.target.value)})}/>
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="number" min={0} value={insumo.cod2} 
                                onChange={(e) => setInsumo({...insumo,cod2: parseInt(e.target.value)})}/>
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="number" min={0} value={insumo.cod3} 
                                onChange={(e) => setInsumo({...insumo,cod3: parseInt(e.target.value)})}/>
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 350}} type="text" value={insumo.des} 
                                onChange={(e) => setInsumo({...insumo,des: e.target.value})}/>
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="number" min={0} value={insumo.caja_palet} 
                                onChange={(e) => setInsumo({...insumo,caja_palet: parseInt(e.target.value)})}/>
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="number" min={0} value={insumo.unitades_caja} 
                                onChange={(e) => setInsumo({...insumo,unitades_caja: parseInt(e.target.value)})}/>
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="number" value={insumo.rac_unidad} 
                                onChange={(e) => setInsumo({...insumo,rac_unidad: parseFloat(e.target.value)})}/>
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="number" value={insumo.rac_caja} 
                                onChange={(e) => setInsumo({...insumo,rac_caja: parseFloat(e.target.value)})}/>   
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="number" value={insumo.gr_racion} 
                                onChange={(e) => setInsumo({...insumo,gr_racion: parseFloat(e.target.value)})}/>     
                            </th>
                            <th style={{border: "1px solid", width: "5%"}}>
                                <input style={{width: 50}} type="checkbox" checked={insumo.calculable}
                                onChange={(e) => setInsumo({...insumo,calculable: e.target.checked})}/>
                            </th>
                        </tr>
                    </tbody>
                </table>
            </div>
            <div style={{display: "flex" , justifyContent: "center", marginBottom: 200}}>
                <button style={{...btn_s_style, marginLeft: 10}} onClick={() => createInsumos()}>CREAR NUEVO INSUMO</button>
            </div>
        </div>
    )
}