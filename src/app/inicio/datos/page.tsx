import ChangeDataBtn from "@/Componets/ChangeDataBtn"
import DBChangeData from "@/db/DBChangeData"
import DBGeneralData from "@/db/DBGeneralData"
import { IFactura } from "@/utils/interfaces"
import sessionCheck from "@/utils/sessionCheck"
import { hr_style, text_2_t_style } from "@/utils/styles"


export default async function () {
    await sessionCheck(2)
    const data = await DBGeneralData()
    
    const pvR = data ? data.configVariables[3].payload : 0
    const pvF = data ? data.configVariables[4].payload : 0
    const cai = data ? data.configVariables[0].payload : 0
    const fechVe = data ? data.configVariables[1].payload : 0
    const finT = data ? data.configVariables[2].payload : 0
    const valR = data ? data.configVariables[5].payload : 0
    const facturas: IFactura[] = data ? data.facturas : []
    const lastFact: number = facturas[0].numero
    let racionesF: number = 0
    facturas.forEach(f => {
        racionesF += f.raciones
    });

    async function changeData(id: number,payload:string) : Promise<boolean> {
        "use server"
        try {
            await DBChangeData(id,payload)
            return true
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return(
        <div style={{marginBottom: 200,marginLeft:10}}>
            <div>
                <h1 style={text_2_t_style}>DATOS REMITOS</h1>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>SIGUIENTE REMITO: {data?.nextRemitoNro}</h2>
                    <ChangeDataBtn id={99} changeData={changeData}/> 
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>PUNTO DE VENTA DE REMITOS: {pvR}</h2>
                    <ChangeDataBtn id={4} changeData={changeData}/> 
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>CODIGO CAI DE REMITO: {cai}</h2>
                    <ChangeDataBtn id={1} changeData={changeData}/> 
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>FECHA DE VENCIMIENTO: {fechVe}</h2>
                    <ChangeDataBtn id={2} changeData={changeData}/> 
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>FIN DE TALONARIO: {finT}</h2> 
                    <ChangeDataBtn id={3} changeData={changeData}/> 

                </div>
            </div>
            <div style={{marginTop: 100}}>
                <h1 style={text_2_t_style}>DATOS FACTURACION</h1>
            </div>
            <hr color="#4A6EE8" style={hr_style}/>
            <div>
                <div style={{display: "flex",alignItems: "baseline"}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>PUNTO DE VENTA DE FACTURACION: {pvF}</h2>
                    <ChangeDataBtn id={5} changeData={changeData}/> 
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>ULTIMA FACTURA: {lastFact}</h2> 
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>REMITOS FACTURADO: {facturas.length}</h2> 
                </div>
                <div>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>RACIONES FACTURADO: {racionesF}</h2> 
                </div>
                <div style={{display: "flex",alignItems: "baseline"}}>
                    <h2 style={{...text_2_t_style, marginTop: 40}}>VALOR A FACTURAR POR RACION: {valR}</h2>
                    <ChangeDataBtn id={6} changeData={changeData}/> 
                </div>
            </div>
        </div>
    )
}