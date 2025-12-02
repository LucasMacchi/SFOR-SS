import FacturasDisplay from "@/Componets/FacturasDisplay"
import DBFacturacion from "@/db/DBFacturacion"
import DBRemitosNoFacturados from "@/db/DBRemitosNoFacturados"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"


export default async function () {
    await sessionCheck()
    const facturas = await DBFacturacion()
    const remitos = await DBRemitosNoFacturados()
    return (
        <div style={{marginBottom: 200,marginLeft:10}}>
            <div>
                <h1 style={text_2_t_style}>FACTURAS</h1>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>
                <FacturasDisplay facturas={facturas ? facturas : []}/>
            </div>
            <div>
                <h1 style={text_2_t_style}>CREAR NUEVA FACTURA</h1>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>

            </div>
            <div>
                <h1 style={text_2_t_style}>MODIFICAR FACTURAS</h1>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
        </div>
    )
}