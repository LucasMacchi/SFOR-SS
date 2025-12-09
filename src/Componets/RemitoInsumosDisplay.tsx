import { IDesgloseDisplay, IInsumo } from "@/utils/interfaces";
import { parsedRemitosDetalles } from "@/utils/parseDesglose";
import { text_2_t_style } from "@/utils/styles";



export default function RemitoInsumosDisplay ({desgloses,insumos} : {desgloses: IDesgloseDisplay[],insumos:IInsumo[]}) {

    const data = parsedRemitosDetalles(desgloses,insumos)
    return(
        <div>
            <h2 style={text_2_t_style}>DETALLES DEL REMITO</h2>
            <div> 
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr>
                            <th style={{border: "1px solid", fontSize: 20}}>INSUMO</th>
                            <th style={{border: "1px solid", fontSize: 20}}>UNIDADES</th>
                            <th style={{border: "1px solid", fontSize: 20}}>RACIONES</th>
                        </tr>
                        {data.map((d,i) => (
                        <tr key={i }>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.des}</th>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.unidades}</th>
                            <th style={{border: "1px solid", fontSize: 20}}>{d.raciones}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}