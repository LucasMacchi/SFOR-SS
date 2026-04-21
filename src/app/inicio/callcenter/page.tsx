import DesglosesToCall from "@/Componets/DesglosesToCall"
import DBAddLlamada from "@/db/DBAddLlamada"
import DBDepartamentos from "@/db/DBDepartamentos"
import DBDesglosesLlamadas from "@/db/DBDesglosesLlamadas"
import DBEditContactos from "@/db/DBEditContactos"
import DBGetRespuestasByDesglose from "@/db/DBGetRespuestasByDesglose"
import DBLlamadasByDesglose from "@/db/DBLlamadasByDesglose"
import DBResolverLlamada from "@/db/DBResolverLlamada"
import { IAddLlamada, IAddPregunta } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"



export default async function Page () {
    await sessionCheck(4)
    const escuelas = await DBDesglosesLlamadas()
    const departamentos = await DBDepartamentos()
    //console.log(escuelas)

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
            const res = await DBAddLlamada(data, preguntas)
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


    return(
        <div >
            <div>
                <h2 style={text_2_t_style}>ADMINISTRADOR DE LLAMADAS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <DesglosesToCall desgloses={escuelas } editContFn={editDesgloseContacto} 
                addLlamadaFn={addLlamada} 
                departamentos={departamentos} getLlamadasEscuelaFn={getLlamadasEscuela} 
                getRespuestasFn={getRespuestas} resolverLlamadaFn={resolverLlamada}/>
            </div>
        </div>
    )
}