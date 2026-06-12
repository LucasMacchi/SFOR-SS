"use client"
import { btn_s_style, text_2_t_style } from "@/utils/styles"
import { useEffect, useState } from "react"
import categorias from "@/db/categoriasTickets.json"
import origenes from "@/db/origenTickets.json"
import { IAddTicket, IDesglose, IUsuariosSafe } from "@/utils/interfaces"
import ticketNroGen from "@/utils/ticketNroGen"



export default function TicketAdd ({desgloses,origenH,usuarios,desgloseH,addTicketFn}:
    {desgloses: IDesglose[],origenH:string,desgloseH:number,usuarios: IUsuariosSafe[],addTicketFn:(ticket: IAddTicket,escuela:string) => Promise<boolean> }) {
    const [categoria, setCategoria] = useState("")
    const [searchC, setSearchC] = useState("")
    const [origen, setOrigen] = useState(origenH)
    const [prioridad, setPrioridad] = useState(0)
    const [comentario, setComentario] = useState("")
    const [asignado, setAsignado] = useState(0)
    const [observador, setObservador] = useState(0)
    const [allwPrioridad, setAllwPrioridad] = useState(false)
    const [selectedDesglose, setSelectedDesglose] = useState(desgloseH)
    const [filteredDesgloses, setFilteredDesgloses] = useState<IDesglose[]>(desgloses)
    useEffect(() => {
        const prioridad = categorias.categorias.find((cat) => cat.c === categoria)?.p
        if(prioridad) {
            setPrioridad(prioridad)
            setAllwPrioridad(true)
        }
        else {
            setAllwPrioridad(false)
            setPrioridad(0)
        }
    },[categoria])
    useEffect(() => {
        let arr = desgloses
        if(searchC.length > 2) {
            arr = arr.filter(l => l.des.toLowerCase().includes(searchC.toLowerCase()))
        }
        setFilteredDesgloses(arr)
    },[searchC])


    const handleAddTicket = async () => {
        const desgloseSelected = desgloseReturner()
        if(origen.length > 0 && categoria.length > 0 && selectedDesglose && desgloseSelected && prioridad && 
            confirm("¿Quieres crear el ticket?")) {
            const data: IAddTicket = {
                user_id: 0,
                categoria,
                estado: "ABIERTO",
                desglose_id: selectedDesglose,
                lentrega_id: desgloseSelected.lentrega_id,
                origen: origen,
                raciones: desgloseSelected.raciones,
                user_asignado: asignado && asignado,
                comentarios: comentario,
                numero: ticketNroGen(desgloseSelected.desglose_id),
                prioridad,
                user_observador: observador
            }
            const res = await addTicketFn(data,desgloseSelected.des)
            if(res) {
                alert("Ticket creado correctamente")
                setCategoria("")
                setSearchC("")
                setOrigen("")
                setPrioridad(0)
                setComentario("")
                setObservador(0)
                setAsignado(0)
                setSelectedDesglose(0)
                setAllwPrioridad(false)
            }
            else alert("Error al crear.")
        }
        else alert("Faltan datos.")
    }


    const desgloseReturner = ():IDesglose | null => {
        return desgloses.find(d => d.desglose_id === selectedDesglose) || null
    }

    return(
        <div style={{margin: 20}}> 
            <div>
                <table style={{width: "45%", marginTop: 25, marginBottom: 25}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 20}}>CREAR TICKET</th>
                        </tr>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 14}}>CATEGORIA *</th>
                            <th style={{border: "1px solid", fontSize: 14}}>
                           <div>
                                <select name="categoria-sel" value={categoria} style={{width: 250,fontSize:16,margin: 10}}
                                onChange={(e) => setCategoria(e.target.value)}>
                                    <option key={0} value={""}>---</option>
                                    {categorias.categorias.map((c,i) => (
                                        <option key={i} value={c.c}>{c.c}</option>
                                    ))}
                                </select>
                            </div>
                            </th>
                        </tr>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 14}}>ORIGEN *</th>
                            <th style={{border: "1px solid", fontSize: 14}}>
                           <div>
                                <select name="categoria-sel" value={origen} style={{width: 250,fontSize:16,margin: 10}}
                                onChange={(e) => setOrigen(e.target.value)} disabled={origenH.length > 0 ? true : false}>
                                    <option key={0} value={""}>---</option>
                                    {origenes.origenes.map((c,i) => (
                                        <option key={i} value={c}>{c}</option>
                                    ))}
                                </select>
                            </div>
                            </th>
                        </tr>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 14}}>PRIORIDAD *</th>
                            <th style={{border: "1px solid", fontSize: 14}}>
                           <div>
                                <select name="categoria-sel" value={prioridad} style={{width: 150,fontSize:14, margin: 10}}
                                onChange={(e) => setPrioridad(parseInt(e.target.value))} disabled={allwPrioridad}>
                                    <option value={0}>---</option>
                                    <option value={1}>ALTA</option>
                                    <option value={2}>MEDIA</option>
                                    <option value={3}>BAJA</option>
                                </select>
                                <input name="plan-inpt" value={searchC} type="checkbox" checked={allwPrioridad}
                                onChange={(e) => setAllwPrioridad(e.target.checked)}/>
                                BLOQUEAR PRIORIDAD
                            </div>
                            </th>
                        </tr>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 14}}>ASIGNAR TICKET</th>
                            <th style={{border: "1px solid", fontSize: 14}}>
                           <div>
                                <select name="categoria-sel" value={asignado} style={{width: 250,fontSize:16,margin: 20}}
                                onChange={(e) => setAsignado(parseInt(e.target.value))}>
                                    <option key={0} value={""}>---</option>
                                    {usuarios.map((c,i) => (
                                        <option key={i} value={c.userId}>{c.username}</option>
                                    ))}

                                </select>
                            </div>
                            </th>
                        </tr>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 14}}>ASIGNAR OBSERVADOR</th>
                            <th style={{border: "1px solid", fontSize: 14}}>
                           <div>
                                <select name="categoria-sel" value={observador} style={{width: 250,fontSize:16,margin: 20}}
                                onChange={(e) => setObservador(parseInt(e.target.value))}>
                                    <option key={0} value={""}>---</option>
                                    {usuarios.map((c,i) => (
                                        <option key={i} value={c.userId}>{c.username}</option>
                                    ))}

                                </select>
                            </div>
                            </th>
                        </tr>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 14}}>SELECCIONA LA DEPENDENCIA *: </th>
                            <th style={{border: "1px solid", fontSize: 14}}>
                                BUSCAR                             
                                <div>
                                    <input name="plan-inpt" value={searchC} style={{width: 150,fontSize:14, margin: 10}}
                                    onChange={(e) => setSearchC(e.target.value)}/>
                                </div>
                            <div>
                                <select name="categoria-sel" value={selectedDesglose} style={{fontSize:14,width: 350}}
                                    onChange={(e) => setSelectedDesglose(parseInt(e.target.value))}>
                                        <option key={0} value={0}>---</option>
                                        {filteredDesgloses.map((c,i) => (
                                            <option key={i} value={c.desglose_id}>{c.des + " - " + (c.fortificado ? "AL" : "CL")}</option>
                                        ))}
                                    </select>
                                </div>
                                RACIONES {desgloseReturner() ? desgloseReturner()?.raciones : 0} 
                            </th>

                        </tr>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 14}}>COMENTARIOS *:</th>
                            <th style={{border: "1px solid", fontSize: 14}}>
                                <textarea
                                    placeholder="Ingrese un comentario..."
                                    value={comentario}
                                    onChange={(e) => setComentario(e.target.value)}
                                    style={{height: 65,width: "80%",resize: "none"}}
                                />
                            </th>
                        </tr>
                    </tbody>
                </table>
                <button style={{...btn_s_style,marginTop: 8}} onClick={() => handleAddTicket()}>REGISTRAR TICKET</button>
            </div>
        </div>
    )
}