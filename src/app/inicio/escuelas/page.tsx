import EscuelaAdd from "@/Componets/EscuelaAdd"
import EscuelasDisplay from "@/Componets/EscuelasDisplay"
import DBAddDesglose from "@/db/DBAddDesglose"
import DBDepartamentos from "@/db/DBDepartamentos"
import DBDesgloseEdit from "@/db/DBDesgloseEdit"
import DBEscuelas from "@/db/DBEscuelas"
import { IAddDesglose } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"

export default async function Page () {
    await sessionCheck()
    const lugares = await DBEscuelas()
    const departamentos = await DBDepartamentos()

    const editDesglose = async (id: number,newVal: string | boolean,column:string,text:boolean): Promise<boolean> => {
        "use server"
        try {
            const res = await DBDesgloseEdit(id,newVal,column,text)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const addDesgloseFn = async (data: IAddDesglose): Promise<boolean> => {
        "use server"
        try {
            const res = await DBAddDesglose(data)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return(
        <div>
            <div>
                <h2 style={text_2_t_style}>LUGARES DE ENTREGA</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <EscuelasDisplay lugares={lugares} departamentos={departamentos} editFn={editDesglose}/>
            </div>
            <div style={{marginTop: 30}}>
                <h2 style={text_2_t_style}>CREAR DESGLOSE</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <EscuelaAdd lugares={lugares} departamentos={departamentos} addDesgloseFn={addDesgloseFn}/>
            </div>
        </div>
    )
}