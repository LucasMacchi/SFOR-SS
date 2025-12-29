

import { IEnvioDetallesParsed, IInsumo, IInsumoStock } from "@/utils/interfaces";
import { text_2_t_style } from "@/utils/styles";

export default function DisplayStock ({insumos,viajesStock}:{insumos:IInsumoStock[],viajesStock: IEnvioDetallesParsed[]}) {


    return (
        <div>
            <h2 style={{...text_2_t_style}}>INSUMOS</h2>
            <div style={{display:"flex",justifyContent:"start",marginBottom: 35,marginRight: 10,fontSize: 14}}>
                <table style={{width: "100%"}}>
                    <tbody>
                        <tr style={{backgroundColor: "#4A6EE8"}}>
                            <th style={{border: "1px solid", width: "8%"}}>COD 1</th>
                            <th style={{border: "1px solid", width: "8%"}}>COD 2</th>
                            <th style={{border: "1px solid", width: "8%"}}>COD 3</th>
                            <th style={{border: "1px solid", width: "40%"}}>DESCRIPCION</th>
                            <th style={{border: "1px solid", width: "20%"}}>STOCK FISICO</th>
                            <th style={{border: "1px solid", width: "20%"}}>STOCK PEND</th>
                            <th style={{border: "1px solid", width: "20%"}}>STOCK PLANIFICADO</th>
                        </tr>
                        {insumos.map((i) => (
                        <tr key={i.ins_id}>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod1}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod2}</th>
                            <th style={{border: "1px solid", width: "8%"}}>{i.cod3}</th>
                            <th style={{border: "1px solid", width: "40%"}}>{i.des}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{i.stock}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{i.stockNoD}</th>
                            <th style={{border: "1px solid", width: "20%"}}>{i.stockPlan}</th>
                        </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}