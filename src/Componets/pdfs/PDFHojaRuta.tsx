import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import logoBig from "../../assets/logo_big.png"
import { IEnvioDetallesParsed, IEnvioT, IRemitoT } from '@/utils/interfaces';
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
        fontSize: 14,
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 10
    },
    view: {
        padding: 2,
        paddingLeft: 5,
        marginTop: 10
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
        width: '100%',
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
        margin: 2,
        fontSize:7,
        textAlign: 'left',
      },
      viewdata: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'flex-start',
        paddingLeft: 5
      },
        viewdata1: {
        padding: 4,
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

const dateReturner = () => {
    const current = new Date()
    const date = current.getDate()
    const mes = current.getMonth() + 1
    const year = current.getFullYear()
    return date + "/"+mes+"/"+year
}

const remitoDisplayer = (remitos: IRemitoT[]) => {
    const elements = []
    for (let i = 0; i < remitos.length; i++) {
        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>{parseRemitoString(remitos[i].pv,remitos[i].numero)}</Text>
                </View>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>{remitos[i].completo}</Text>
                </View>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>{remitos[i].localidad}</Text>
                </View>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>{remitos[i].direccion}</Text>
                </View>
            </View>
        )
    
    }
    return elements
}
const desgloseDisplayer = (remitos: IRemitoT[]) => {
    const elements = []
    for(const rt of remitos) {
        for(const envio of rt.envios) {
            elements.push(
                <View style={stylePedido.tableRow}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>{parseRemitoString(rt.pv,rt.numero)}</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>{envio.des}</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>{rt.localidad}</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>{rt.direccion}</Text>
                    </View>
                </View>)
        }
    }
    return elements
}
const insumosDisplayer = (insumos: IEnvioDetallesParsed[]) => {
    const elements = []
    let cajasT = 0
    let bolsasT = 0
    let kilosT = 0
    let paletsT = 0
    let unidT = 0
    for (let i = 0; i < insumos.length; i++) {
        cajasT += insumos[i].cajas
        bolsasT += insumos[i].bolsas
        kilosT += insumos[i].kilos
        paletsT += insumos[i].palet
        unidT += insumos[i].unidades

        elements.push(
            <View style={stylePedido.tableRow}>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell}>{insumos[i].des}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i].palet}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i].cajas}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i].bolsas}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i].kilos}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{insumos[i].unidades}</Text>
                </View>
            </View>
        )
    
    }
        elements.push(
        <View style={stylePedido.tableRow}>
            <View style={stylePedido.tableColIns}>
                <Text style={stylePedido.tableCell}>Total</Text>
            </View>
            <View style={stylePedido.tableColcod}>
                <Text style={stylePedido.tableCell}>{paletsT}</Text>
            </View>
            <View style={stylePedido.tableColcod}>
                <Text style={stylePedido.tableCell}>{cajasT}</Text>
            </View>
            <View style={stylePedido.tableColcod}>
                <Text style={stylePedido.tableCell}>{bolsasT}</Text>
            </View>
            <View style={stylePedido.tableColcod}>
                <Text style={stylePedido.tableCell}>{kilosT.toFixed(2)}</Text>
            </View>
            <View style={stylePedido.tableColcod}>
                <Text style={stylePedido.tableCell}>{unidT}</Text>
            </View>
        </View>
        )
    return elements
}

const RutaPdf = ({remitos,detalles}:{remitos: IRemitoT[],detalles: IEnvioDetallesParsed[]}) => (
    <Document>
        <Page size={'A4'} style={stylePedido.page}>
            <Image src={"/logo_big.png"} style={stylePedido.logo}/>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                </View>
                <View >
                    <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                    <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata1}>
                <View >
                    <Text style={stylePedido.title}>Hoja de ruta</Text>
                    <View style={{...stylePedido.viewdataHeader, marginTop: 15,borderBottomWidth:0}}>
                        <View>
                            <Text style={stylePedido.title}>CHOFER:____________________________</Text>
                        </View>
                        <View>
                            <Text style={stylePedido.title}>{dateReturner()}</Text>
                        </View>
                    </View>
                </View>
            </View>
            <View style={stylePedido.view}>
                <Text style={stylePedido.title}>Remitos</Text>
            </View>
            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Numero Remito</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Cabecera</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Localidad</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Direccion</Text>
                    </View>
                </View>
                </View> 
                {remitoDisplayer(remitos)}               
            </View>
        </Page>
        <Page size={'A4'} style={stylePedido.page}>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                </View>
                <View >
                    <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                    <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata1}>
                <View >
                    <Text style={stylePedido.title}>Productos</Text>
                </View>
            </View>
            <View style={stylePedido.view}>
                <Text style={stylePedido.title}>Productos</Text>
            </View>
            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Insumo</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Pallets</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Cajas</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Bolsas/Unid.</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Kilos</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>Unidades Totales</Text>
                    </View>
                </View>
                </View>
                {insumosDisplayer(detalles)}
                <View style={stylePedido.viewdata1}>
                    <View >
                        <View style={{...stylePedido.viewdataHeader, marginTop: 20,borderBottomWidth:0}}>
                            <View>
                                <Text style={stylePedido.title}>Chofer:...........................</Text>
                            </View>
                            <View>
                                <Text style={stylePedido.title}>Res. Carga:...........................</Text>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </Page>
        <Page size={'A4'} style={stylePedido.page}>
            <View style={stylePedido.viewdataHeader}>
                <View >
                    <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                </View>
                <View >
                    <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                    <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                </View>
            </View>
            <View style={stylePedido.viewdata1}>
                <View >
                    <Text style={stylePedido.title}>Hoja de ruta detallado</Text>
                </View>
            </View>
            <View style={stylePedido.view}>
                <View style={stylePedido.table}>
                <View style={stylePedido.tableRow_header}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Numero Remito</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Dependencia</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Localidad</Text>
                    </View>
                    <View style={stylePedido.tableColIns}>
                        <Text style={stylePedido.tableCell}>Direccion</Text>
                    </View>
                </View>
                </View> 
                {desgloseDisplayer(remitos)}               
            </View>
        </Page>
    </Document>
)

export default RutaPdf