

import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { IEnvioDetalles, IEnvioT, IInsumo, IRemitoT } from '../../utils/interfaces';
import logoBig from "../../assets/logo_big.png"
import remitoEnviosInsumosReturner from '@/utils/remitoEnviosInsumosReturner';
import parseRemitoString from '@/utils/parseRemitoString';

const stylePedido = StyleSheet.create({
    logo: {
        width: 90
    },
    page: {
        padding: 6,
        fontFamily: 'Helvetica',
    },
    title: {
        fontSize: 16,
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 10
    },
    view: {
        padding: 2,
        paddingLeft: 5
    },
    view_title: {
        display: 'flex',
        paddingLeft: 40
    },
    table: {
        width: 'auto',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderRightWidth: 0,
        borderBottomWidth: 0,
      },
      tableRow: {
        flexDirection: 'row',
      },
      tableRow_header: {
        flexDirection: 'row',
        backgroundColor: '#65b1fc'
      },
      tableColIns: {
        width: '90%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderTopWidth: 0,
      },
      tableColcod: {
        width: '18%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderTopWidth: 0,
      },
      tableColCant: {
        width: '7%',
        borderStyle: 'solid',
        borderWidth: 1,
        borderColor: '#bfbfbf',
        borderLeftWidth: 0,
        borderTopWidth: 0,
      },
      tableCell: {
        margin: 5,
        fontSize: 10,
        textAlign: 'left',
        fontWeight: 900
      },
      viewdata: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'flex-start',
        paddingLeft: 5
      },
      viewdataHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'space-between',
        
      },
      viewdataReq: {
        marginLeft: 20
      }
})


const insumosDisplayer = (envio: IEnvioT,insumosArr:IInsumo[],dias:number) => {
    const elements = []
    const insumos = remitoEnviosInsumosReturner(insumosArr,[envio])
    const amount = insumos.length > 8 ? insumos.length : 8
    let racTotales = 0
    insumos.forEach(i => {
        if(i.calculable && i.calculable) racTotales += i.raciones
    });
    for (let i = 0; i < amount; i++) {
        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].des : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].cajas : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].bolsas : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i] ? insumos[i].unidades : " "}</Text>
                </View>
            </View>
        )
    
    }
    elements.push(
        <View style={stylePedido.tableRow}>
            <View style={stylePedido.tableColIns}>
                <Text style={stylePedido.tableCell}>{"RACIONES TOTALES POR "+dias+" DIAS: "+racTotales}</Text>
            </View>
            <View style={stylePedido.tableColcod}>
                <Text style={stylePedido.tableCell}>{" "}</Text>
            </View>
            <View style={stylePedido.tableColcod}>
                <Text style={stylePedido.tableCell}>{" "}</Text>
            </View>
            <View style={stylePedido.tableColcod}>
                <Text style={stylePedido.tableCell}>{" "}</Text>
            </View>
        </View>
    )
    return elements
}

const pageContruct = (e: IEnvioT, copia: boolean,page: number,completo:string,localidad: string,direccion:string,insumos:IInsumo[],dias:number,rnro:number,rpv:number) => (
        <Page size={'A4'} style={stylePedido.page}>
            <Image src={"/logo_big.png"} style={stylePedido.logo}/>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                </View>
                <View >
                    <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                    <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                    <Text style={stylePedido.subtitle}>Hoja {page}</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata}>
                <View >
                    <Text style={stylePedido.title}>Desglose de Entrega - {copia ? "Copia" : "Original"}</Text>
                    <Text style={stylePedido.body}>Cabecera: {completo}</Text>
                    <Text style={stylePedido.body}>Dependencia: {e.des}</Text>
                    <Text style={stylePedido.body}>Fecha: {new Date().toISOString()}</Text>
                    <Text style={{...stylePedido.body,fontWeight: 900}}>Remito: {parseRemitoString(rpv,rnro)}</Text>
                    <Text style={stylePedido.body}>Localidad: {localidad}</Text>
                    <Text style={stylePedido.body}>Direccion: {direccion}</Text>
                    <Text style={stylePedido.title}>SOPORTE OPERATIVO:</Text>
                    <Text style={stylePedido.title}>Telefono: 3794-586633</Text>
                    <Text style={stylePedido.title}>Correo: info@solucionesyservicios.com.ar</Text>
                </View>
            </View>
            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={{...stylePedido.tableCell,color:"white"}}>INSUMO</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={{...stylePedido.tableCell,color:"white"}}>CAJAS</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={{...stylePedido.tableCell,color:"white"}}>UNIDADES</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={{...stylePedido.tableCell,color:"white"}}>UNIDADES TOTALES</Text>
                    </View>
                </View>
                </View>
                {insumosDisplayer(e,insumos,dias)}
            </View>
        </Page>

)


const DesglosePdf = ({remitos,insumos}:{remitos:IRemitoT[],insumos:IInsumo[]}) => (
    <Document>
        {remitos.map(rts => {
            const chld = rts.envios.flatMap((e,i) => {
                const hojC = i + 1
                return[
                    pageContruct(e,false,hojC,rts.completo,rts.localidad,rts.direccion,insumos,rts.dias,rts.pv,rts.numero),
                    pageContruct(e,true,hojC,rts.completo,rts.localidad,rts.direccion,insumos,rts.dias,rts.pv,rts.numero)
                ]
            })
            return(chld)
        })}
    </Document>
)

export default DesglosePdf
