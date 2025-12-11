import CreateFacturaDisplay from "@/Componets/CreateFactura"
import EditFactura from "@/Componets/EditFactura"
import FacturasDisplay from "@/Componets/FacturasDisplay"
import DBAddFactura from "@/db/DBAddFactura"
import DBEditFacturaClose from "@/db/DBEditFacturaClose"
import DBEditFacturaEliminar from "@/db/DBEditFacturaEliminar"
import DBFacturacion from "@/db/DBFacturacion"
import DBPlanActual from "@/db/DBPlanActual"
import DBPvFacturacion from "@/db/DBPvFacturacion"
import DBRemitosNoFacturados from "@/db/DBRemitosNoFacturados"
import DBValorRacion from "@/db/DBValorRacion"
import { IAddFactura, IRemitosNoF } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"


export default async function () {
    await sessionCheck(2)
    const facturas = await DBFacturacion()
    const pvF = await DBPvFacturacion()
    const planesActuales = await DBPlanActual()
    const valRac = await DBValorRacion()
    
    const remitosReturner = async (plan:number): Promise<IRemitosNoF[] | null> => {
        "use server"
        return await DBRemitosNoFacturados(plan)
    }
    const createNewFactura = async (data: IAddFactura[]): Promise<boolean> => {
        "use server"
        try {
            await DBAddFactura(data)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const deleteFactura = async (remitos: number[]): Promise<boolean> => {
        "use server"
        try {
            await DBEditFacturaEliminar(remitos)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const closeFactura = async (pv:number,nro:number): Promise<boolean> => {
        "use server"
        try {
            await DBEditFacturaClose(pv,nro)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }
    return (
        <div style={{marginBottom: 200,marginLeft:10}}>
            <div>
                <h1 style={text_2_t_style}>FACTURAS</h1>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>
                <FacturasDisplay facturas={facturas ? facturas : []} valor={valRac}/>
            </div>
            <div>
                <h1 style={text_2_t_style}>MODIFICAR FACTURAS</h1>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>
                <EditFactura facturas={facturas ? facturas : []}
                deleteFn={deleteFactura}
                closeFn={closeFactura}
                remitoReturner={remitosReturner}
                repartos={planesActuales}
                createFactura={createNewFactura}/>
            </div>
            <div>
                <h1 style={text_2_t_style}>CREAR NUEVA FACTURA</h1>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>
                <CreateFacturaDisplay nextF={facturas ? facturas[0].numero+1 : 0} 
                remitoReturner={remitosReturner} pv={pvF} repartos={planesActuales}
                createFactura={createNewFactura} valor={valRac}/>
            </div>
        </div>
    )
}