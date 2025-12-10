"use client"
import { IAddDesglose, ILentrega } from "@/utils/interfaces";
import { btn_s_style, select_style, text_2_s_style, text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";


export default function EscuelaAdd ({lugares,departamentos,addDesgloseFn}:{lugares:ILentrega[],departamentos: string[],addDesgloseFn: (data: IAddDesglose) => Promise<boolean>}) {
 
    const [selectedDep, setSelectedDep] = useState("")
    const [selectedLgr, setSelectedLgr] = useState(-1)
    const [searchC, setSearchC] = useState("")
    const [filteredLgrs, setFilteredLgrs] = useState<ILentrega[]>(lugares)
    const [addDesglose, setAddDesglose] = useState<IAddDesglose>({
        lentrega_id: 0,
        cue: 0,
        des: "",
        raciones: 0,
        fortificado: false
    })
    
    useEffect(() => {
        setSelectedLgr(-1)
        let arr = lugares
        if(searchC.length > 0) {
            arr = arr.filter(l => l.completo.toLowerCase().includes(searchC.toLowerCase()))
        }
        if(selectedDep.length > 0) {
            arr = arr.filter(l => l.departamento === selectedDep)
        }
        setFilteredLgrs(arr)

    },[searchC,selectedDep])
    
    useEffect(() => {
        setAddDesglose({
            lentrega_id: 0,
            cue: 0,
            des: "",
            raciones: 0,
            fortificado: false
        })
    },[selectedLgr])

    const createDesglose = async () => {
        if(addDesglose.cue && addDesglose.raciones && selectedLgr > -1 && confirm("¿Quieres crear el nuevo desglose?")) {
            addDesglose.lentrega_id = filteredLgrs[selectedLgr].lentrega_id
            const res = await addDesgloseFn(addDesglose)
            if(res) {
                alert("Nuevo desglose creado.")
                window.location.reload()
            }
            else alert("Error al crear el nuevo desglose.")
        }
        else alert("Error al crear el desglose.")
    }

    return(
        <div style={{marginLeft: 20,marginBottom: 400}}>
            <h2 style={{...text_2_t_style, marginTop: 40}}>SELECCIONA EL LUGAR DE ENTREGA</h2>
            <div style={{ display:"flex"}}>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>BUSCAR</h2>
                    <input name="plan-inpt" value={searchC} style={{width: 250,fontSize:16,marginBottom: 20}}
                    onChange={(e) => setSearchC(e.target.value)}/>
                </div>
                <div style={{marginLeft: 10}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>DEPARTAMENTO</h2>
                    <select name="estados_sel" id="state_sl"
                    onChange={(e) => setSelectedDep(e.target.value)}
                    style={{width: 300,fontSize:16,marginBottom: 20}}>
                        <option value={""}>---</option>
                        {departamentos.map((d,i) => (
                            <option key={i} value={d}>{d}</option>
                        ))}
                    </select>
                </div>
                <div style={{marginLeft: 10}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>LUGARES DE ENTREGA - {filteredLgrs.length}</h2>
                    <select name="estados_sel" id="state_sl"
                    onChange={(e) => setSelectedLgr(parseInt(e.target.value))}
                    style={{width: 800,fontSize:16,marginBottom: 20}}>
                        <option value={-1}>---</option>
                        {filteredLgrs.map((d,i) => (
                            <option key={i} value={i}>{d.lentrega_id+" - "+d.completo}</option>
                        ))}
                    </select>
                </div>
            </div>
            {selectedLgr > -1 && (
                <div>
                    <div>
                        <div>
                            <h2 style={{...text_2_t_style, marginTop: 20}}>DESCRIPCION</h2>
                            <input name="plan-inpt" value={addDesglose.des} style={{width: 600,fontSize:16,marginBottom: 20}}
                            onChange={(e) => setAddDesglose({...addDesglose,des:e.target.value})}/>
                        </div>
                        <div>
                            <h2 style={{...text_2_t_style, marginTop: 20}}>CUE</h2>
                            <input type="number" name="plan-inpt" value={addDesglose.cue} style={{width: 100,fontSize:16,marginBottom: 20}}
                            onChange={(e) => setAddDesglose({...addDesglose,cue:parseInt(e.target.value)})}/>
                        </div>
                        <div>
                            <h2 style={{...text_2_t_style, marginTop: 20}}>RACIONES</h2>
                            <input type="number" name="plan-inpt" value={addDesglose.raciones} style={{width: 100,fontSize:16,marginBottom: 20}}
                            onChange={(e) => setAddDesglose({...addDesglose,raciones:parseInt(e.target.value)})}/>
                        </div>
                        <div    >
                            <h2 style={{...text_2_t_style, marginTop: 20}}>DISTRIBUCION</h2>
                            <select name="fac_sel" id="fc_sl" value={addDesglose.fortificado ? 1:0}
                            onChange={(e) => setAddDesglose({...addDesglose,fortificado: parseInt(e.target.value) ? true : false })}
                            style={{...select_style,width: 250}}>
                                <option value={0}>COPA DE LECHE</option>
                                <option value={1}>ALMUERZO</option>
                            </select>
                        </div>
                        <div style={{marginTop: 15}}>
                            <button style={btn_s_style} onClick={() => createDesglose()}>CREAR DESGLOSE</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}