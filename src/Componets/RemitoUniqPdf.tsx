"use client"

import { IDesgloseDisplay, IInsumo, IUniqRemito } from "@/utils/interfaces";
import { pdf } from "@react-pdf/renderer";
import PdfBtn from "./PdfBtn";
import parseRemitoString from "@/utils/parseRemitoString";
import PDFRemitoUniq from "./pdfs/PDFRemitoUniq";



export default function RemitoUniqPdf ({remito,detalles,insumos,venc,cai}:{remito: IUniqRemito,detalles: IDesgloseDisplay[],insumos:IInsumo[],venc:string,cai:string}) {
    
    const download = async ():Promise<Blob> => {
        const blob = await pdf(<PDFRemitoUniq remito={remito} desgloses={detalles} insumos={insumos}
        venc={venc} cai={cai}/>).toBlob()
        return blob
    }

    return(
        <div>
            <PdfBtn title={parseRemitoString(remito.pv,remito.numero)} disable={false} pdf={download()} />
        </div>
    )
}