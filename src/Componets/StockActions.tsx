"use client"

import { IInsumo, IStockAdd, IStockLog } from "@/utils/interfaces"
import { btn_s_style, text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"
import categorias from '../db/categoriasJson.json'

export default function StockActions ({stock,insumos,changeStock}:
    {stock:IStockLog[],insumos:IInsumo[],changeStock: (stockadd:IStockAdd) => Promise<boolean>}) {

    const [selectedI, setSelectedI] = useState(-1)
    
    const [selectedLogs, setSelectedLogs] = useState<IStockLog[]>([])

    const [option, setOption] = useState(-1)

    const [stockMov, setStockMov] = useState<IStockAdd>({
        ins_id: 0,
        value: 0,
        sum: false,
        des: "",
        title: "",
    })

    const createMov = async () => {
        if(selectedI > -1) stockMov.ins_id = insumos[selectedI].ins_id
        if(stockMov.des.length >= 50 && stockMov.ins_id && stockMov.value > 0) {
            if(confirm("¿Quieres confirmar el movimiento de stock?")) {
                stockMov.title = categorias.categorias[option].type
                stockMov.sum = categorias.categorias[option].sum
                const res = await changeStock(stockMov)
                if(res) {
                    alert("Stock modificado")
                    window.location.reload()
                }
                else alert("Error al modificar.")
            }
        }
        else alert("Faltan datos.")
    }

    useEffect(() => {
        if(selectedI > -1) {
            setSelectedLogs(stock.filter((st) => st.ins_id === insumos[selectedI].ins_id))
            setStockMov({...stockMov,ins_id:insumos[selectedI].ins_id})
        }
        else setSelectedLogs([])
        
    },[selectedI])

    useEffect(() => {
        if(option > -1) setStockMov({...stockMov, title: categorias.categorias[option].type,sum:categorias.categorias[option].sum})
        setStockMov({
            ins_id: 0,
            value: 0,
            sum: false,
            des: "",
            title: "",
        })
    },[option])

    return(
        <div>
            <div>
                <h2 style={{...text_2_t_style}}>SELECCIONA UN INSUMO A CONSULTAR</h2>
                <select name="estados_sel" id="state_sl"
                onChange={(e) => setSelectedI(parseInt(e.target.value))}
                style={{width: 500,fontSize:24,marginBottom: 20}}>
                    <option value={-1}>---</option>
                    {insumos.map((ins,i) => (
                        <option key={ins.ins_id} value={i}>{ins.des}</option>
                    ))}
                </select>
            </div>
            {selectedI > -1 && 
            <div>
                <h2 style={{...text_2_t_style}}>ACCION</h2>
                <select name="estados_sel" id="state_sl" value={option}
                onChange={(e) => setOption(parseInt(e.target.value))}
                style={{width: 500,fontSize:24,marginBottom: 20}}>
                    <option value={-1}>CONSULTAR MOVIMIENTOS</option>
                    {categorias.categorias.map((c,i) => (
                        <option key={i} value={i}>{c.type}</option>
                    ))}
                </select>
            </div>
            }
            {option > -1 && 
            <div>
                <h3 style={{...text_2_t_style}}>{categorias.categorias[option].type}</h3>
                <div>
                    <h4 style={{...text_2_t_style}}>VALOR DE MOVIMIENTO</h4>
                    <input type="number" name="plan-inpt" value={stockMov.value} min={0}
                    style={{width: 120,fontSize:24,marginBottom: 20}}
                    onChange={(e) => setStockMov({...stockMov, value: parseInt(e.target.value)})}/>
                </div>
                <div>
                    <h4 style={{...text_2_t_style}}>DESCRIPCION - (minimo 50 caracteres - actuales {stockMov.des.length})</h4>
                    <textarea style={{width: "80%", height: 100,resize: "none"}} value={stockMov.des} 
                    onChange={((e) => setStockMov({...stockMov, des: e.target.value}))}/>
                </div>
                <div style={{alignContent: "baseline"}}>
                    <button style={btn_s_style} onClick={() => createMov()}>
                        REALIZAR MOVIMIENTO
                    </button>
                </div>
            </div>
            }
            <div>
                {(selectedLogs.length > 0 && option === -1) && 
                <table style={{width: "70%",maxHeight: 750,overflow:"scroll"}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "10%"}}>FECHA</th>
                            <th style={{border: "1px solid", width: "8%"}}>PREV</th>
                            <th style={{border: "1px solid", width: "8%"}}>POS</th>
                            <th style={{border: "1px solid", width: "60%"}}>DESCIPCION</th>
                        </tr>
                        {selectedLogs.map((i) => (
                        <tr key={i.log_id}>
                            <th style={{border: "1px solid", width: "10%"}}>{i.fecha.toISOString().split("T")[0]}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.unidades_prev}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.unidades_new}</th>
                            <th style={{border: "1px solid", width: "60%"}}>{i.descripcion}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
                }

            </div>
        </div>
    )
}