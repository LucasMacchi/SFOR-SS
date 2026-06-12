"use client"

import { IUsuariosSafe } from "@/utils/interfaces"
import { btn_s_style, text_2_t_style } from "@/utils/styles"
import { CldUploadButton, CloudinaryUploadWidgetResults } from "next-cloudinary"
import { useEffect, useState } from "react"
const options = [
    {id: 1, label: "SOLUCIONAR"},
    {id: 2, label: "CAMBIAR PRIORIDAD"},
    {id: 3, label: "ASIGNAR TICKET"},
    {id: 4, label: "SEGUIMIENTO"},
    {id: 5, label: "ASIGNAR OBSERVADOR"}
]

export default function TicketsActions({ticket_id,solucionarTicket,cambiarPrioridadTicket,usuarios,asignarTicket,addSeguimiento,observadorTicketFn}:
    {ticket_id:number,solucionarTicket: (ticket_id:number, solucion:string,imagen?:string) => Promise<boolean>, 
        cambiarPrioridadTicket: (ticket_id:number, prioridad:number) => Promise<boolean>, 
        usuarios: IUsuariosSafe[],asignarTicket: (asignado: number,asignado_des:string,ticket_id:number) => Promise<boolean>,
        addSeguimiento: (ticket_id: number, comentario: string,imagen?:string) => Promise<boolean>,
        observadorTicketFn: (obervador: number, observador_des: string, ticket_id: number) => Promise<boolean>}) {

    const [selectedOption, setSelectedOption] = useState(0)
    const [solucion, setSolucion] = useState("")
    const [selectedPrioridad, setSelectedPrioridad] = useState(1)
    const [selectedUsuarios, setSelectedUsuarios] = useState(0)
    const [imagen, setImagen] = useState<string>("")

    useEffect(() => {
        setSolucion("")
        setImagen("")
    }, [selectedOption])

    const solucionarFn = async () => {
        if(solucion.length > 0) {
            const res = imagen.length > 0 ? await solucionarTicket(ticket_id, solucion, imagen) : await solucionarTicket(ticket_id, solucion)
            if(res) {
                alert("Ticket solucionado exitosamente.")
                window.location.reload()
            } else alert("Error al solucionar el ticket.")
        }
    }

    const seguimientoFN = async () => {
        if(solucion.length > 0) {
            const res = imagen.length > 0 ? await addSeguimiento(ticket_id, solucion, imagen) : await addSeguimiento(ticket_id, solucion)
            if(res) {
                alert("Ticket solucionado exitosamente.")
                window.location.reload()
            } else alert("Error al solucionar el ticket.")
        }
    }

    const cambiarPrioridadFn = async () => {
        const res = await cambiarPrioridadTicket(ticket_id, selectedPrioridad)
        if(res) {
            alert("Prioridad del ticket cambiada exitosamente.")
            window.location.reload()
        } else alert("Error al cambiar la prioridad del ticket.")
    }
    
    const asignarTicketFn = async () => {
        if(selectedUsuarios !== 0) {
            const res = await asignarTicket(selectedUsuarios, usuarios.find(u => u.userId === selectedUsuarios)?.username || "N/A", ticket_id)
            if(res) {
                alert("Ticket asignado exitosamente.")
                window.location.reload()
            } else alert("Error al asignar el ticket.")
        }
    }

    const observadorAsignarTicketFn = async () => {
        if(selectedUsuarios !== 0) {
            const res = await observadorTicketFn(selectedUsuarios, usuarios.find(u => u.userId === selectedUsuarios)?.username || "N/A", ticket_id)
            if(res) {
                alert("Ticket asignado exitosamente.")
                window.location.reload()
            } else alert("Error al asignar el ticket.")
        }
    }

    const handleImages = (r: CloudinaryUploadWidgetResults) => {
        console.log(r)
        const url = r && r.info && typeof r.info !== "string" && r.info.secure_url.length > 0 ? r.info.secure_url : "";
        if(url) {
            setImagen(url)
        }
    }

    const actionReturner = () => {
        if(selectedOption === 1) {
            return(
                <div>
                    <h2 style={text_2_t_style}>SOLUCIONAR TICKET</h2>
                    <textarea
                        placeholder="Ingrese la solucion..."
                        value={solucion}
                        onChange={(e) => setSolucion(e.target.value)}
                        style={{height: 100,width: "30%",resize: "none"}}
                    />
                    <div>
                        <CldUploadButton uploadPreset="visita_preset" onSuccess={(r) => handleImages(r)} options={{maxFiles: 1,maxFileSize: 2*1024*1024,clientAllowedFormats:["jpg","png"]}}
                            onOpen={() => alert("Solo se permiten subir una imagen por visita, con un tamaño máximo de 2MB.")}>
                            SUBIR IMAGEN
                        </CldUploadButton>
                    </div>
                    <div style={{marginTop: 15}}>
                        <button style={btn_s_style} onClick={() => solucionarFn()}>SOLUCIONAR</button>
                    </div>
                </div>
            )
        }
        else if(selectedOption === 2) {
            return(
                <div>
                    <h2 style={text_2_t_style}>CAMBIAR PRIORIDAD</h2>
                    <div>
                        <h3 style={{...text_2_t_style}}>SELECCIONE LA PRIORIDAD</h3>
                        <select name="categoria-sel" value={selectedPrioridad} style={{width: 150,fontSize:16,marginBottom: 20}}
                        onChange={(e) => setSelectedPrioridad(parseInt(e.target.value))}>
                            <option value={1}>ALTA</option>
                            <option value={2}>MEDIA</option>
                            <option value={3}>BAJA</option>
                        </select>
                    </div>
                    <div style={{marginTop: 15}}>
                        <button style={btn_s_style} onClick={() => cambiarPrioridadFn()}>CAMBIAR</button>
                    </div>
                </div>
            )
        }
        else if(selectedOption === 3) {
            return(
                <div>
                    <h2 style={text_2_t_style}>ASIGNAR TICKET</h2>
                    <div>
                        <h3 style={{...text_2_t_style}}>SELECCIONE EL USUARIO</h3>
                        <select name="categoria-sel" value={selectedUsuarios} style={{width: 150,fontSize:16,marginBottom: 20}}
                        onChange={(e) => setSelectedUsuarios(parseInt(e.target.value))}>
                            <option value={0}>SELECCIONAR</option>
                            {usuarios.map((u) => (
                                <option key={u.userId} value={u.userId}>
                                    {u.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{marginTop: 15}}>
                        <button style={btn_s_style} onClick={() => asignarTicketFn()}>ASIGNAR</button>
                    </div>
                </div>
            )
        }
        else if(selectedOption === 4) {
            return(
                <div>
                    <h2 style={text_2_t_style}>SEGUIMIENTO TICKET</h2>
                    <textarea
                        placeholder="Ingrese un comentario..."
                        value={solucion}
                        onChange={(e) => setSolucion(e.target.value)}
                        style={{height: 100,width: "30%",resize: "none"}}
                    />
                    <div>
                        <CldUploadButton uploadPreset="visita_preset" onSuccess={(r) => handleImages(r)} options={{maxFiles: 1,maxFileSize: 2*1024*1024}}
                            onOpen={() => alert("Solo se permiten subir una imagen por visita, con un tamaño máximo de 2MB.")}>
                            SUBIR IMAGEN
                        </CldUploadButton>
                    </div>
                    <div style={{marginTop: 15}}>
                        <button style={btn_s_style} onClick={() => seguimientoFN()}>REALIZAR SEGUIMIENTO</button>
                    </div>
                </div>
            )
        }
        else if(selectedOption === 5) {
            return(
                <div>
                    <h2 style={text_2_t_style}>ASIGNAR OBSERVADOR</h2>
                    <div>
                        <h3 style={{...text_2_t_style}}>SELECCIONE EL USUARIO</h3>
                        <select name="categoria-sel" value={selectedUsuarios} style={{width: 150,fontSize:16,marginBottom: 20}}
                        onChange={(e) => setSelectedUsuarios(parseInt(e.target.value))}>
                            <option value={0}>SELECCIONAR</option>
                            {usuarios.map((u) => (
                                <option key={u.userId} value={u.userId}>
                                    {u.username}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div style={{marginTop: 15}}>
                        <button style={btn_s_style} onClick={() => observadorAsignarTicketFn()}>ASIGNAR</button>
                    </div>
                </div>
            )
        }

    }

    return(
        <div style={{marginBottom: 20}}>
            <div>
                <h2 style={{...text_2_t_style, marginTop: 40}}>ACCION</h2>
                <select name="categoria-sel" value={selectedOption} style={{width: 250,fontSize:16,marginBottom: 20}}
                onChange={(e) => setSelectedOption(parseInt(e.target.value))}>
                    <option value={0}>SELECCIONAR</option>
                    {options.map((o) => (
                        <option key={o.id} value={o.id}>
                            {o.label}
                        </option>
                    ))}
                </select>
            </div>
            <div>
                {actionReturner()}
            </div>
        </div>
    )

}