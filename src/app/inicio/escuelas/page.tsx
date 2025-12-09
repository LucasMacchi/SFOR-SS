import EscuelasDisplay from "@/Componets/EscuelasDisplay"
import DBDepartamentos from "@/db/DBDepartamentos"
import DBEscuelas from "@/db/DBEscuelas"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"

export default async function Page () {
    await sessionCheck()
    const lugares = await DBEscuelas()
    const departamentos = await DBDepartamentos()
    return(
        <div>
            <div>
                <h2 style={text_2_t_style}>LUGARES DE ENTREGA</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <EscuelasDisplay lugares={lugares} departamentos={departamentos}/>
            </div>
        </div>
    )
}