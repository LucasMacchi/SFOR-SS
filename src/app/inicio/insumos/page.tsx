import InsumoAdd from "@/Componets/InsumoAdd"
import InsumosDisplay from "@/Componets/InsumosDisplay"
import DBAddInsumo from "@/db/DBAddInsumo"
import DBEditInsumo from "@/db/DBEditInsumo"
import DBInsumos from "@/db/DBInsumos"
import { ICreateInsumo } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"



export default async function Page () {
    await sessionCheck(2)
    const insumos = await DBInsumos()
    const changeInsumo = async (id:number,column:string,newV:string) => {
        "use server"
        return await DBEditInsumo(id,newV,column)
    }
    const addInsumo = async (data: ICreateInsumo): Promise<boolean> => {
        "use server"
        try {
            return await DBAddInsumo(data)
        } catch (error) {
            return false
        }
    }
    return (
        <div>
            <div>
                <h2 style={text_2_t_style}>INSUMOS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <InsumosDisplay insumos={insumos} modInsumo={changeInsumo}/>
            </div>
            <div>
                <h2 style={text_2_t_style}>CREAR INSUMO</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <InsumoAdd addFn={addInsumo}/>
            </div>
        </div>
    )
}