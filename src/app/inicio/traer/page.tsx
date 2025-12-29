import TraerRemitosDisplay from "@/Componets/TraerRemitosDisplay";
import DBGeneralData from "@/db/DBGeneralData";
import DBInsumos from "@/db/DBInsumos";
import DBPlanReparto from "@/db/DBPlanReparto";
import DBTRemitos from "@/db/DBTRemitos";
import DBViajes from "@/db/DBViajes";
import { IRemitoT } from "@/utils/interfaces";
import { hr_style, text_2_t_style } from "@/utils/styles";



export default async function Page () {
    const viajes = await DBViajes()
    const insumos = await DBInsumos()
    const configTable = await DBGeneralData()

    const venc = configTable ? configTable.configVariables[1].payload: "NAN"
    const cai = configTable ? configTable.configVariables[0].payload: "NAN"
    const getRemitosViaje = async (viaje:number):Promise<IRemitoT[]> => {
        "use server"
        try {
            const res = await DBTRemitos(viaje,0,0)
            return res
        } catch (error) {
            console.log(error)
            return []
        }
    }
    const getRemitosRange = async (start:number,end:number):Promise<IRemitoT[]> => {
        "use server"
        try {
            const res = DBTRemitos(0,start,end)
            return res
        } catch (error) {
            console.log(error)
            return []
        }
    }

    return (
        <div style={{marginLeft: 25, marginBottom: 100}}>
            <div>
                <h2 style={text_2_t_style}>CONSULTAR REMITOS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <TraerRemitosDisplay viajes={viajes} getRtViaje={getRemitosViaje} getRtRango={getRemitosRange} 
                insumos={insumos} cai={cai} venc={venc}/>
            </div>
        </div>
    )

}