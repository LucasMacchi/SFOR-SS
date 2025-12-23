import DisplayStock from "@/Componets/DisplayStock";
import StockActions from "@/Componets/StockActions";
import StockExcel from "@/Componets/StockExcel";
import DBAddMovStock from "@/db/DBAddMovStock";
import DBInsumos from "@/db/DBInsumos";
import DBStockLogs from "@/db/DBStockLogs";
import { IStockAdd } from "@/utils/interfaces";
import { hr_style, text_2_t_style } from "@/utils/styles";



export default async function Page() {
    const insumos = await DBInsumos()
    const stockLog = await DBStockLogs()

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
                <div style={{width: "50%"}}>
                    <DisplayStock insumos={insumos} />
                </div>
                <div style={{width:"40%"}}>
                    <StockActions stock={stockLog} insumos={insumos} changeStock={updateStock}/>
                </div>
            </div>

        </div>
    )
}