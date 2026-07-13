import DisplayStock from "@/Componets/DisplayStock";
import StockActions from "@/Componets/StockActions";
import StockExcel from "@/Componets/StockExcel";
import DBAddMovStock from "@/db/DBAddMovStock";
import DBAddUndLote from "@/db/DBAddUndLote";
import DBBajaLote from "@/db/DBBajaLote";
import DBDescontarLote from "@/db/DBDescontarLote";
import DBInsumos from "@/db/DBInsumos";
import DBInsumosBajaStck from "@/db/DBInsumosBajaStck";
import DBInsumosNoDespachados from "@/db/DBInsumosNoDespachados";
import DBLoteAdd from "@/db/DBLoteAdd";
import DBLoteLog from "@/db/DBLoteLog";
import DBLotes from "@/db/DBLotes";
import DBMarcas from "@/db/DBMarcas";
import DBPlanReparto from "@/db/DBPlanReparto";
import DBSalidaLote from "@/db/DBSalidaLote";
import DBStockLogs from "@/db/DBStockLogs";
import DBViajes from "@/db/DBViajes";
import { IAddLote, IInsumoStock, IStockAdd, IViajeRQ } from "@/utils/interfaces";
import { hr_style, text_2_t_style } from "@/utils/styles";
import viajesParseDisplayAll from "@/utils/viajesParseDisplayAll";



export default async function Page() {
    const insumos = await DBInsumos()
    const insumosBaja = await DBInsumosBajaStck()
    const stockLog = await DBStockLogs()
    const viajes = await DBViajes()
    const planes = await DBPlanReparto()
    const lotes = await DBLotes()
    const marcas = await DBMarcas()
    //const despachados = await DBViajesDespachados()
    const addLote = async (lote: IAddLote) => {
        "use server"
        try {
            const res = await DBLoteAdd(lote)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    
    const addUnidadesLote = async (l:number,lname:string ,newUnidades: number,prev:number,i:number) =>  {
        "use server"
        try {
            const res = await DBAddUndLote(l,lname,newUnidades,prev,i)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const descontarUnidadesLote = async (l:number,lname:string ,newUnidades: number,prev:number,i:number) =>  {
        "use server"
        try {
            const res = await DBDescontarLote(l,lname,newUnidades,prev,i)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const salidaUnidadesLote = async (l:number,lname:string ,newUnidades: number,prev:number,i:number,cat:string) =>  {
        "use server"
        try {
            const res = await DBSalidaLote(l,lname,newUnidades,prev,i,cat)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }

    const bajaLote = async (lote:number,lname:string,state:boolean,i:number) =>  {
        "use server"
        try {
            const res = await DBBajaLote(lote,lname,state,i)
            return res
        } catch (error) {
            console.log(error)
            return false
        }
    }
    const logLote = async (i:number) =>  {
        "use server"
        try {
            const res = await DBLoteLog(i)
            return res
        } catch (error) {
            console.log(error)
            return []
        }
    }    
    const viajesParsed:IViajeRQ[] = []
    viajes.forEach(v => {
        if(!v.procesado) viajesParsed.push(v)
    });
    const stockViajes = viajesParseDisplayAll(insumos,planes ? planes : [],viajesParsed)


    return (
        <div style={{marginLeft: 15, marginBottom: 100}}> 
            <div >
                <div style={{display:"flex"}}>
                    <h2 style={{...text_2_t_style,marginRight: 10}}>STOCK</h2>
                    <StockExcel insumos={insumos} logs={stockLog} />
                </div>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <div style={{width: "80%"}}>
                    <DisplayStock insumosB={insumosBaja} insumos={insumos} 
                    lotes={lotes} marcas={marcas} addLoteFn={addLote} addUnidadesLote={addUnidadesLote} 
                    bajaLoteFn={bajaLote} descontarUnidadesLoteFn={descontarUnidadesLote} logLoteFn={logLote}
                    salidaUnidadesLoteFn={salidaUnidadesLote}
                    />
                </div>
            </div>

        </div>
    )
}