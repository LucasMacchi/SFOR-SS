"use client"
import { IInsumo, IStockExcel, IStockLog, IStockLogExcel } from "@/utils/interfaces";
import Image from "next/image"
import * as XLSX from 'xlsx';


export default function StockExcel ({insumos,logs}:{insumos:IInsumo[],logs:IStockLog[]}) {

    const color = "#32CD32"

    const downLoadExcel = () => {
        const stock: IStockExcel[] = []
        const date = new Date().toISOString().split("T")[0]
        insumos.forEach(i => {
            stock.push({
                COD1: i.cod1,
                COD2: i.cod2,
                COD3: i.cod3 ? i.cod3 : 0,
                INSUMO: i.des,
                STOCK: i.stock
            })
        });
        const worksheet = XLSX.utils.json_to_sheet(stock)
        const workbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(workbook,worksheet,"STOCK")    
        insumos.forEach(i => {
            const insStock:IStockLogExcel[] = []
            logs.forEach(l => {
                if(i.ins_id === l.ins_id) {
                    insStock.push({
                        FECHA: l.fecha.toISOString().split("T")[0],
                        DESCRIPCION: l.descripcion,
                        PREVIO: l.unidades_prev,
                        POSTERIOR: l.unidades_new
                    })
                }
            });
            const name = i.cod1+"_"+i.cod2+"_"+(i.cod3 ? i.cod3 : 0)
            const worksheetI = XLSX.utils.json_to_sheet(insStock)
            XLSX.utils.book_append_sheet(workbook,worksheetI,name)
        });

        XLSX.writeFile(workbook,'STOCK-'+date+'.xlsx')
    }

    return (
        <button style={{fontSize: 20,backgroundColor: color, borderColor: color, color: "white"}}
        onClick={() => downLoadExcel()}>
            <Image src={"/excelLogo-2.png"} alt="logo de excel" width={25} height={25} style={{alignSelf:"baseline"}}/>
            EXCEL
        </button>
    )
}