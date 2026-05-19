import AddVisita from "@/Componets/AddVisita"
import Displayvisitas from "@/Componets/Displayvisitas"
import DBAddVisita from "@/db/DBAddVisita"
import DBDepartamentos from "@/db/DBDepartamentos"
import DBDesglosesVisitar from "@/db/DBDesglosesVisitar"
import DBVisitas from "@/db/DBVisitas"
import decodeJWT from "@/utils/decodeJWT"
import { IAddVisita, IVisitaPreguntaAdd } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"



export default async function Visita() {
    await sessionCheck(4)
    const desgloses = await DBDesglosesVisitar()
    const departamentos = await DBDepartamentos()
    const visitas = await DBVisitas()

    const addVisita = async (v: IAddVisita,preguntas: IVisitaPreguntaAdd[]): Promise<boolean> => {
        "use server"
        try {
            const user = await decodeJWT()
            if(!user) return false
            const res = await DBAddVisita(v, preguntas, user.userId)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return(
        <div>
            <div>
                <h2 style={text_2_t_style}>RECORRIDOS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <Displayvisitas visitas={visitas} departamentos={departamentos} />
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>
                <AddVisita desgloses={desgloses} departamentos={departamentos} addVisita={addVisita} />
            </div>
        </div>
    )
}