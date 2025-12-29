import DisplayStock from "@/Componets/DisplayStock";
import StockActions from "@/Componets/StockActions";
import StockExcel from "@/Componets/StockExcel";
import DBAddMovStock from "@/db/DBAddMovStock";
import DBInsumos from "@/db/DBInsumos";
import DBInsumosNoDespachados from "@/db/DBInsumosNoDespachados";
import DBPlanReparto from "@/db/DBPlanReparto";
import DBStockLogs from "@/db/DBStockLogs";
import DBViajes from "@/db/DBViajes";
import DBViajesDespachados from "@/db/DBViajesDespachados";
import { IInsumoStock, IStockAdd, IViaje, IViajeRQ } from "@/utils/interfaces";
import { hr_style, text_2_t_style } from "@/utils/styles";
import viajesParseDisplayAll from "@/utils/viajesParseDisplayAll";



export default async function Page() {
    const insumos = await DBInsumos()
    const stockLog = await DBStockLogs()
    const viajes = await DBViajes()
    const planes = await DBPlanReparto()
    const despachados = await DBViajesDespachados()
    const noDespachado = await DBInsumosNoDespachados()
    const updateStock = async (stockAdd: IStockAdd) => {
        "use server"
        try {
            const res = await DBAddMovStock(stockAdd)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const viajesParsed:IViajeRQ[] = []
    viajes.forEach(v => {
        let status = false
        if(despachados.length > 0) {
            despachados.forEach(d => {
                if(v.viaje_id === d) status = true
            });
        }
        if(!v.procesado) viajesParsed.push(v)
    });
    const stockViajes = viajesParseDisplayAll(insumos,planes ? planes : [],viajesParsed)

    const parseStockAll = () => {
        const newStock: IInsumoStock[] = []
        insumos.forEach(i => {
            let planificado = 0
            let noDes = 0
            noDespachado.forEach(n => {
                if(n.ins_id === i.ins_id) {
                    noDes = i.stock - n.sum
                }
            });
            stockViajes.forEach(s => {
                if(s.ins_id === i.ins_id) planificado = noDes - s.unidades
            });
            newStock.push({...i,stockNoD: noDes,stockPlan:planificado})
        });
        return newStock
    }

    return (
        <div style={{marginLeft: 15, marginBottom: 100}}> 
            <div >
                <div style={{display:"flex"}}>
                    <h2 style={{...text_2_t_style,marginRight: 10}}>STOCK</h2>
                    <StockExcel insumos={insumos} logs={stockLog} />
                </div>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div style={{display:"flex"}}>
                <div style={{width: "60%"}}>
                    <DisplayStock insumos={parseStockAll()} viajesStock={stockViajes}/>
                </div>
                <div style={{width:"40%"}}>
                    <StockActions stock={stockLog} insumos={insumos} changeStock={updateStock}/>
                </div>
            </div>

        </div>
    )
}