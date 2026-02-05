import fillEmptyTxt from "../fillEmptyTxt"
import { IRemitoNoExportedRQ } from "../interfaces"
import dateParser from "./dateParser"

    
    
    export default function createItemTxt (remito: IRemitoNoExportedRQ[]) {
        let cabeceraLines: string[] = []
        const blank1 = [16,16,16,4,16]
        const blank2 = [3,4,25,4,25,6,40,15,15,15,20,8]
        const blank3 = [1,5,1]
        const lines = remito.length
        const fecha = dateParser(new Date())
        const aux = remito[0].remito_id
        

        let itemLin = 0
            remito.forEach((d) => {
                let cod1P = fillEmptyTxt(d.cod1.toString(),4,false,false,true)
                let cod2P = ""
                let cod3P = ""
                if(d.cod2) {
                    cod2P = "-"+fillEmptyTxt((d.cod2 ? d.cod2:"").toString(),6,false,false,true)
                }
                if(d.cod3) {
                    cod3P = "-"+fillEmptyTxt((d.cod3 ? d.cod3:"").toString(),6,false,false,true)
                }
                const finalCod = cod1P+cod2P+cod3P
                if(d.remito_id !== aux) itemLin = 0
                itemLin++
                let line = ""
                // ARTICULO ------------------------------------
                // - Comprobante
                line += fillEmptyTxt("NP",3,false,true,false)
                //Letra
                line += fillEmptyTxt("R",1,false,false,false)
                //Punto de venta
                line += fillEmptyTxt(d.pv.toString(),5,false,false,true)
                //Nro comprobante
                line += fillEmptyTxt(d.numero.toString(),8,false,false,true)
                //nro hasta
                line += fillEmptyTxt("",8,true,false,false)
                //fecha comprobante
                line += fillEmptyTxt(fecha,8,false,true,false)
                //cod cliente
                line += fillEmptyTxt("1",6,false,false,true)
                //tip item
                line += fillEmptyTxt("A",1,false,false,true)
                //tip item
                line += fillEmptyTxt(finalCod,23,false,true,false)
                //cant unidad 1
                line += fillEmptyTxt(d.unidades.toString(),16,false,false,false)
                //cant unidad 2
                line += fillEmptyTxt("0.00",16,false,false,false)
                //tip item
                line += fillEmptyTxt(d.des,50,false,true,false)
                //prec unitario
                line += fillEmptyTxt("0.00",16,false,false,false)
                //tasa iva ins
                line += fillEmptyTxt("21.00",8,false,false,false)
                //tasa iva no ins
                line += fillEmptyTxt("",8,true,false,false)
                //imp iva ins
                line += fillEmptyTxt("0.00",16,false,false,false)
                //imp iva no ins
                line += fillEmptyTxt("",16,true,false,false)
                //imp total
                line += fillEmptyTxt("0.00",16,false,false,false)
                //19 - 23
                blank1.forEach((s) => {
                    line += fillEmptyTxt("",s,true,true,false)    
                });
                //tip iva
                line += fillEmptyTxt("1",1,false,true,false)
                //cod desc
                line += fillEmptyTxt("",2,true,false,false)
                //imp desc
                line += fillEmptyTxt("",16,true,false,false)
                //deposito
                line += fillEmptyTxt("RIA",3,false,true,false)
                //partida
                line += fillEmptyTxt("",26,true,false,false)
                //tasa desc
                line += fillEmptyTxt("",8,true,false,false)
                //imp renglon
                line += fillEmptyTxt("0.00",16,false,false,false)
                //31 - 46
                blank2.forEach((s) => {
                    line += fillEmptyTxt("",s,true,true,false)    
                });
                // nro renglon
                line += fillEmptyTxt(itemLin.toString(),3,false,false,false)
                blank3.forEach((s) => {
                    line += fillEmptyTxt("",s,true,true,false)    
                });

                cabeceraLines.push(line)
            });
        return cabeceraLines
    }