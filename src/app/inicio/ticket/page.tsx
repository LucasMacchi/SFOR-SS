import TicketAdd from "@/Componets/TicketAdd"
import TicketsDisplay from "@/Componets/TicketsDisplay"
import DBAddTicket from "@/db/DBAddTicket"
import DBDepartamentos from "@/db/DBDepartamentos"
import DBDesglosesVisitar from "@/db/DBDesglosesVisitar"
import DBEscuelas from "@/db/DBEscuelas"
import DBGetTickets from "@/db/DBGetTickets"
import DBSafeUsuarios from "@/db/DBSafeUsuarios"
import decodeJWT from "@/utils/decodeJWT"
import { IAddTicket, IDesglose } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"



export default async function Ticket() {
    await sessionCheck(4)
    const user = await decodeJWT()
    const usuarios = await DBSafeUsuarios()
    const tickets = await DBGetTickets()
    const departamentos = await DBDepartamentos()
    const desgloses = await DBEscuelas(true,true)
    const desglosesP: IDesglose[] = []
    if(desgloses) {
        desgloses.forEach(l => {
            if(l.desgloses) {
                l.desgloses.forEach(d => {
                    d.direccion = l.direccion
                    desglosesP.push(d)
                });
            }
        });
    }
    const addTicketFn = async (ticket: IAddTicket,escuela:string): Promise<boolean> => {
        "use server"
        try {            
            if(!user) return false
            ticket.user_id = user.userId
            const res = await DBAddTicket(ticket,escuela)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return(
        <div>
            <div>
                <h2 style={text_2_t_style}>TICKETS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <TicketAdd desgloses={desglosesP} origenH={""} usuarios={usuarios} 
                addTicketFn={addTicketFn} desgloseH={0}/>
            </div>
            <div>
                <TicketsDisplay tickets={tickets} departamentos={departamentos} usuarios={usuarios} user_id={user ? user.userId : 1}/>
            </div>
        </div>
    )
}