import DesglosesToCall from "@/Componets/DesglosesToCall"
import DBAddLlamada from "@/db/DBAddLlamada"
import DBAddLlamadaNoAtentida from "@/db/DBAddLlamadaNoAtentida"
import DBAddTicket from "@/db/DBAddTicket"
import DBDepartamentos from "@/db/DBDepartamentos"
import DBDesglosesLlamadas from "@/db/DBDesglosesLlamadas"
import DBEditContactos from "@/db/DBEditContactos"
import DBEscuelas from "@/db/DBEscuelas"
import DBGetRespuestasByDesglose from "@/db/DBGetRespuestasByDesglose"
import DBLlamadasByDesglose from "@/db/DBLlamadasByDesglose"
import DBResolverLlamada from "@/db/DBResolverLlamada"
import DBSafeUsuarios from "@/db/DBSafeUsuarios"
import decodeJWT from "@/utils/decodeJWT"
import { IAddLlamada, IAddPregunta, IAddTicket, IDesglose } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"



export default async function Page () {
    await sessionCheck(4)
    const escuelas = await DBDesglosesLlamadas()
    const departamentos = await DBDepartamentos()
    const usuarios = await DBSafeUsuarios()
    const desgloses = await DBEscuelas(true,true)
    //console.log(escuelas)
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
    const editDesgloseContacto = async (columna: string, data: string, id: number): Promise<boolean> => {
        "use server"
        try {
            const res = await DBEditContactos(columna, data, id)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const addLlamada = async (data: IAddLlamada,preguntas: IAddPregunta[]): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false
            const res = await DBAddLlamada(data, preguntas,user.userId)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const addLlamadaNoAtendida = async (data: IAddLlamada): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false
            const res = await DBAddLlamadaNoAtentida(data)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const getLlamadasEscuela = async (id: number) => {
        "use server"
        try {
            const res = await DBLlamadasByDesglose(id)
            return res
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const getRespuestas = async (id: number) => {
        "use server"
        try {
            const res = await DBGetRespuestasByDesglose(id)
            return res
        } catch (error) {
            console.log(error)
            return []
        }
    }

    const resolverLlamada = async (llamada_id: number,solucion:string) => {
        "use server"
        try {
            const res = await DBResolverLlamada(llamada_id,solucion)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const addTicketFn = async (ticket: IAddTicket,escuela:string): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
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
        <div >
            <div>
                <h2 style={text_2_t_style}>ADMINISTRADOR DE LLAMADAS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <DesglosesToCall desgloses={escuelas } editContFn={editDesgloseContacto} 
                addLlamadaFn={addLlamada} desglosesT={desglosesP}
                departamentos={departamentos} getLlamadasEscuelaFn={getLlamadasEscuela} 
                getRespuestasFn={getRespuestas} resolverLlamadaFn={resolverLlamada}
                addLlamadaNoAtendidaFn={addLlamadaNoAtendida} addTicketFn={addTicketFn}
                usuarios={usuarios}
                />
            </div>
        </div>
    )
}