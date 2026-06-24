"use client"
import { ITicket, IUsuariosSafe } from "@/utils/interfaces";
import { text_2_t_style } from "@/utils/styles";
import { useEffect, useState } from "react";
import categorias from "@/db/categoriasTickets.json"
import { useRouter } from "next/dist/client/components/navigation";

export default function TicketsDisplay({tickets, departamentos,usuarios,user_id}:{tickets:ITicket[], departamentos: string[],usuarios:IUsuariosSafe[],user_id:number}) {
    const router = useRouter()
    const [filteredTickets, setFilteredTickets] = useState<ITicket[]>(tickets)
    const [searchC, setSearchC] = useState("")
    const [searchE, setSearchE] = useState("")
    const [searchDep, setSearchDep] = useState("")
    const [categoriaF, setCategoriaF] = useState("")
    const [prioridadF , setPrioridadF] = useState(0)
    const [cerradoF , setCerradoF] = useState(2)
    const [solucionF, setSolucionF] = useState(2)
    const [selectedAsignado, setSelectedAsignado] = useState(user_id)

    useEffect(() => {
        let arr = tickets
        if(searchC.length > 2) {
            arr = arr.filter(l => l.numero.toLowerCase().includes(searchC.toLowerCase()))
        }
        if(searchE.length > 2) {
            arr = arr.filter(l => l.des.toLowerCase().includes(searchE.toLowerCase()))
        }
        if(searchDep.length > 0) {
            arr = arr.filter(l => l.departamento === searchDep)
        }
        if(categoriaF.length > 0) {
            arr = arr.filter(l => l.categoria === categoriaF)
        }
        if(selectedAsignado) {
            arr = arr.filter(l => l.user_asignado === selectedAsignado)
        }
        if(prioridadF > 0) {
            arr = arr.filter(l => l.prioridad === prioridadF )
        }
        if(solucionF === 1) {
            arr = arr.filter(l => l.solucion && l.solucion.length > 0)
        }
        if(solucionF === 2) {
            arr = arr.filter(l => !l.solucion || l.solucion.length === 0)
        }
        if(cerradoF === 2) {
            arr = arr.filter(l => l.estado !== "CERRADO")
        }
        if(cerradoF === 1) {
            arr = arr.filter(l => l.estado === "CERRADO")
        }
        setFilteredTickets(arr)

    },[searchC,searchE,categoriaF,prioridadF,solucionF,searchDep,selectedAsignado,cerradoF])

    const colorization = (prioridad:number) => {
        if(prioridad === 1) return "#a84049"
        if(prioridad === 2) return "#e6c351"
        if(prioridad === 3) return "#83d1ae"
        return "transparent"
    }

    return(
        <div style={{marginBottom: 200}}>
            <div style={{margin:20}}>
                <div>
                    <h2 style={text_2_t_style}>TICKETS CREADOS</h2>
                </div>
                <div>
                    <div style={{display:"flex"}}>
                        <div>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>BUSCAR ID</h2>
                                <input name="plan-inpt" value={searchC} style={{width: 150,fontSize:16,marginBottom: 20}}
                                onChange={(e) => setSearchC(e.target.value)}/>
                            </div>
                        </div>
                        <div style={{marginLeft: 30}}>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>BUSCAR ESCUELA</h2>
                                <input name="plan-inpt" value={searchE} style={{width: 250,fontSize:16,marginBottom: 20}}
                                onChange={(e) => setSearchE(e.target.value)}/>
                            </div>
                        </div>
                        <div style={{marginLeft: 30}}>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>CATEGORIA</h2>
                                <select name="categoria-sel" value={categoriaF} style={{width: 250,fontSize:16,marginBottom: 20}}
                                onChange={(e) => setCategoriaF(e.target.value)}>
                                    <option value="">TODAS</option>
                                    {categorias.categorias.map((c,i) => (
                                        <option key={i} value={c.c}>{c.c}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div style={{marginLeft: 30}}>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>DEPARTAMENTO</h2>
                                <select name="departamento-sel" value={searchDep} style={{width: 250,fontSize:16,marginBottom: 20}}
                                onChange={(e) => setSearchDep(e.target.value)}>
                                    <option value="">TODOS</option>
                                    {departamentos.map((d,i) => (
                                        <option key={i} value={d}>{d}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div style={{display:"flex"}}>
                        <div style={{marginLeft: 30}}>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>PRIORIDAD</h2>
                                <select name="categoria-sel" value={prioridadF} style={{width: 150,fontSize:16,marginBottom: 8}}
                                onChange={(e) => setPrioridadF(parseInt(e.target.value))}>
                                    <option value={0}>---</option>
                                    <option value={1}>ALTA</option>
                                    <option value={2}>MEDIA</option>
                                    <option value={3}>BAJA</option>
                                </select>
                            </div>
                        </div>
                        <div style={{marginLeft: 30}}>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>SOLUCIONADO</h2>
                                <select name="categoria-sel" value={solucionF} style={{width: 150,fontSize:16,marginBottom: 20}}
                                onChange={(e) => setSolucionF(parseInt(e.target.value))}>
                                    <option value={0}>---</option>
                                    <option value={1}>SÍ</option>
                                    <option value={2}>NO</option>
                                </select>
                            </div>
                        </div>
                        <div style={{marginLeft: 30}}>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>CERRADO</h2>
                                <select name="categoria-sel" value={cerradoF} style={{width: 150,fontSize:16,marginBottom: 20}}
                                onChange={(e) => setCerradoF(parseInt(e.target.value))}>
                                    <option value={0}>---</option>
                                    <option value={1}>SÍ</option>
                                    <option value={2}>NO</option>
                                </select>
                            </div>
                        </div>
                        <div style={{marginLeft: 30}}>
                            <div>
                                <h2 style={{...text_2_t_style, marginTop: 40}}>ASIGNADO</h2>
                                <select name="categoria-sel" value={selectedAsignado} style={{width: 150,fontSize:16,marginBottom: 20}}
                                onChange={(e) => setSelectedAsignado(parseInt(e.target.value))}>
                                    <option value={0}>---</option>
                                    {usuarios.map((u,i) => (
                                        <option key={i} value={u.userId}>{u.username}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    {filteredTickets.length > 0 ? (
                        <table style={{width: "80%",height: 180,maxHeight: 180}}>
                            <tbody>
                                <tr>
                                    <th style={{border: "1px solid", fontSize: 14,width:"5%"}}>ID</th>
                                    <th style={{border: "1px solid", fontSize: 14,width:"10%"}}>ESCUELA</th>
                                    <th style={{border: "1px solid", fontSize: 14,width:"10%"}}>DEP.</th>
                                    <th style={{border: "1px solid", fontSize: 14,width:"10%"}}>CATEGORIA</th>
                                    <th style={{border: "1px solid", fontSize: 14,width:"10%"}}>FECHA</th>
                                    <th style={{border: "1px solid", fontSize: 14}}>DESCRIPCION</th>
                                    <th style={{border: "1px solid", fontSize: 14,width:"10%"}}>ESTADO</th>
                                    <th style={{border: "1px solid", fontSize: 14,width:"5%"}}>PRIORIDAD</th>
                                </tr>
                                {filteredTickets.map((t,i) => (
                                    <tr key={i} style={{cursor:"pointer", backgroundColor: t.solucion ? "#2da348" : colorization(t.prioridad)}}
                                    onClick={() => router.push("/inicio/ticket/"+t.ticket_id)}>
                                        <th style={{border: "1px solid", fontSize: 14}}>{t.numero}</th>
                                        <th style={{border: "1px solid", fontSize: 14}}>{t.des}</th>
                                        <th style={{border: "1px solid", fontSize: 14}}>{t.departamento}</th>
                                        <th style={{border: "1px solid", fontSize: 14}}>{t.categoria}</th>
                                        <th style={{border: "1px solid", fontSize: 14}}>{t.fecha_creado?.toISOString().split('T')[0] || "N/A"}</th>
                                        <th style={{border: "1px solid", fontSize: 14}}>{t.comentario}</th>
                                        <th style={{border: "1px solid", fontSize: 14}}>{t.estado}</th>
                                        <th style={{border: "1px solid", fontSize: 14}}>{t.prioridad === 1 ? "ALTA" : t.prioridad === 2 ? "MEDIA" : "BAJA"}</th>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    ) : (
                        <h3 style={text_2_t_style}>NO SE ENCONTRARON TICKETS</h3>
                    )}
                </div>
            </div>
        </div>
    )
}