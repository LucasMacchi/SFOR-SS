import DownloadFileTicket from "@/Componets/DownloadFileTicket"
import TicketsActions from "@/Componets/ticketActions"
import DBAsginadoTicket from "@/db/DBAsginadoTicket"
import DBCambiarPrioridad from "@/db/DBCambiarPrioridad"
import DBCatSoluciones from "@/db/DBCatSoluciones"
import DBGetIntervenciones from "@/db/DBGetIntervenciones"
import DBGetTickets from "@/db/DBGetTickets"
import DBObservadorTicket from "@/db/DBObservadorTicket"
import DBSafeUsuarios from "@/db/DBSafeUsuarios"
import DBSeguimientoTicket from "@/db/DBSeguimientoTicket"
import DBSolucionarTicket from "@/db/DBSolucionarTicket"
import DBTicketEstado from "@/db/DBTicketEstado"
import decodeJWT from "@/utils/decodeJWT"
import sessionCheck from "@/utils/sessionCheck"
import { btn_s_style, hr_style, text_2_s_style, text_2_t_style } from "@/utils/styles"



export default async function Page({params}:{params:Promise<{uniqticket:string}>}) {
    await sessionCheck(4)
    const ticketID = (await params).uniqticket
    const ticket = (await DBGetTickets()).find(t => t.ticket_id === parseInt(ticketID))    
    const usuarios = await DBSafeUsuarios()
    const soluciones = await DBCatSoluciones()
    const intervenciones = ticket ? await DBGetIntervenciones(ticket.ticket_id) : []
    const emailObserver = usuarios.find(u => u.userId === ticket?.user_observador)?.email
    
    const solucionarTicketFn = async (ticket_id: number, solucion: string,categoria:number,imagen?:string): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false
            const res = await DBSolucionarTicket(soluciones,ticket_id, solucion,user.userId,ticket ? ticket.categoria : "N/A",
                ticket ? ticket.numero : "N/A",ticket ? ticket.des : "N/A",emailObserver ? emailObserver : null, categoria,imagen)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    

    const userReturner = (userId: number | undefined) => {
        const user = usuarios.find(u => u.userId === userId)
        return user ? user.username : "N/A"
    }
    const cambiarPrioridadTicketFn = async (ticket_id: number, prioridad: number): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false

            const post = prioridad === 1 ? "ALTA" : prioridad === 2 ? "MEDIA" : "BAJA"
            const prev = ticket?.prioridad === 1 ? "ALTA" : ticket?.prioridad === 2 ? "MEDIA" : "BAJA"
            const res = await DBCambiarPrioridad(ticket_id, prioridad, prev, post, user.userId,ticket ? ticket.numero : "N/A",emailObserver ? emailObserver : null)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const asignarTicketFn = async (asignado: number, asignado_des: string, ticket_id: number): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false
            const emailAsignador = usuarios.find(u => u.userId === asignado)?.email
            const res = await DBAsginadoTicket(asignado, asignado_des, ticket_id, user.userId,
                emailAsignador ? emailAsignador : null,ticket ? ticket.des : "N/A",ticket ? ticket.numero : "N/A",ticket ? ticket.categoria : "N/A")
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const observadorTicketFn = async (obervador: number, observador_des: string, ticket_id: number): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false
            const res = await DBObservadorTicket(obervador, observador_des, ticket_id, user.userId,emailObserver ? emailObserver : null,
                ticket ? ticket.numero : "N/A",ticket ? ticket.des : "N/A",ticket ? ticket.categoria : "N/A")
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const addSeguimiento = async (ticket_id: number, comentario: string,imagen?:string): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false
            const res = await DBSeguimientoTicket(ticket_id, comentario, user.userId,ticket ? ticket.categoria : "N/A",
                ticket ? ticket.numero : "N/A",ticket ? ticket.des : "N/A",emailObserver ? emailObserver : null,imagen)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const changeEstado = async (ticket_id: number, comentario: string,estado:string): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false
            const res = await DBTicketEstado(ticket_id, comentario, user.userId,ticket ? ticket.categoria : "N/A",
                ticket ? ticket.numero : "N/A",ticket ? ticket.des : "N/A",emailObserver ? emailObserver : null,estado)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return(
        <div style={{margin:20,marginTop: 60,marginBottom: 250}}>
            <div >
                <h3 style={text_2_t_style}>TICKET {ticket?.numero} - {ticket?.categoria} - PRIORIDAD {ticket?.prioridad === 1 ? "ALTA" : ticket?.prioridad === 2 ? "MEDIA" : "BAJA"}</h3>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <hr color="#4A6EE8" style={{...hr_style,width: '25%'}}/>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>ESTADO: {ticket?.estado}</h3>
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>ORIGEN: {ticket?.origen}</h3>
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>FECHA: {ticket?.fecha_creado.toISOString().split('T')[0]}</h3>
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>CABECERA: {ticket?.completo}</h3>
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>ESCUELA: {ticket?.des}</h3>
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>RACIONES: {ticket?.raciones} {ticket?.fortificado ? "ALMUERZO" : "COPA DE LECHE"}</h3>
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>DEPARTAMENTO: {ticket?.departamento}</h3>
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>LOCALIDAD: {ticket?.localidad}</h3>
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>CREADO POR: {userReturner(ticket?.user_id)}</h3>
                <h3 style={{...text_2_t_style, marginBottom: 20}}>ASIGANDO A: {userReturner(ticket?.user_asignado)}</h3>  
                <h3 style={{...text_2_t_style, marginBottom: 20}}>OBSERVADOR: {userReturner(ticket?.user_observador)}</h3>            
            </div>
            <div>
                <h3 style={{...text_2_t_style, marginBottom: 8}}>COMENTARIOS:</h3>
                <p style={text_2_t_style}>{ticket?.comentario || "No hay comentarios"}</p>
            </div>
            {ticket?.solucion && (
            <div style={{marginTop: 45}}>
                <h3 style={text_2_t_style}>SOLUCION - {ticket.descripcion} - {ticket?.fecha_solucion?.toISOString().split('T')[0]}</h3>
                <hr color="#4A6EE8" style={{...hr_style,width: '25%'}}/>
                <p style={text_2_t_style}>{ticket?.solucion || "No hay solucion"}</p>
            </div>
            )}
            {ticket && <TicketsActions ticket_id={ticket.ticket_id} solucionarTicket={solucionarTicketFn} 
            estado={ticket.estado}
            cambiarPrioridadTicket={cambiarPrioridadTicketFn} usuarios={usuarios} soluciones={soluciones}
            asignarTicket={asignarTicketFn} addSeguimiento={addSeguimiento} observadorTicketFn={observadorTicketFn}
            changeEstado={changeEstado}/>}
            {intervenciones.length > 0 && (
            <div style={{marginTop: 45,height: 600,maxHeight:600,overflow:"scroll"}}>
                <h3 style={text_2_t_style}>INTERVENCIONES - TOTAL: {intervenciones.length}</h3>
                <hr color="#4A6EE8" style={{...hr_style,width: '75%'}}/>
                {intervenciones.map((i) => (
                    <div style={{backgroundColor: "#4A6EE8",borderRadius: 5, margin: 50,marginLeft: 10, width: "30%",padding:20}}>
                        <div style={{display: "flex",justifyContent: "space-between",marginBottom: 10}}>
                            <h4 style={text_2_s_style}>{i.username}</h4>
                            <h4 style={text_2_s_style}>{i.categoria}</h4>
                            <h4 style={text_2_s_style}>{i.fecha?.toISOString().split('T')[0]}</h4>
                        </div>
                        <div style={{display: "flex",justifyContent: "center"}}>
                            <textarea
                                placeholder="Ingrese la solucion..."
                                value={i.payload}
                                disabled={true}
                                style={{height: 100,width: "80%",resize: "none"}}
                            />
                        </div>
                        <div>
                            {i.image && <DownloadFileTicket url={i.image} />}
                        </div>
                    </div>
                ))}
            </div>
            )}
        </div>
    )
}