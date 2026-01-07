
import { Page, Text, View, Document, StyleSheet, Image } from '@react-pdf/renderer';
import { IDesgloseDisplay, IEnvioT, IInsumo, IRemitosDetalles, IRemitoT } from '../../utils/interfaces';
import parseRemitoString from '@/utils/parseRemitoString';
import remitoEnviosInsumosReturner from '@/utils/remitoEnviosInsumosReturner';

const stylePedido = StyleSheet.create({
    logo: {
        width: 120,
        alignItems: "center"
    },
    page: {
        fontFamily: 'Helvetica',
        padding: 14
    },
    title: {
        fontSize: 16,
    },
    subtitle: {
        fontSize: 10,
    },
    body: {
        fontSize: 9
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
        borderBottomWidth: 1,
        borderTopWidth: 1,
      },
      tableRow: {
        flexDirection: 'row',
      },
      tableRow_header: {
        flexDirection: 'row',
      },
      tableColIns: {
        width: '100%',
      },
      tableColIns2: {
        width: '100%',
        borderStyle: "solid",
        borderRightWidth: 1,
        borderColor: "black"
      },
      tableColcod: {
        width: '18%',
      },
      tableColcod2: {
        width: '18%',
        borderStyle: "solid",
        borderRightWidth: 1,
        borderColor: "black"
      },
      tableColCant2: {
        width: '7%',
        borderStyle: "solid",
        borderRightWidth: 1,
        borderColor: "black"
      },
      tableColCant: {
        width: '7%',
      },
      tableCell: {
        margin: 2,
        fontSize: 10,
        textAlign: 'center',
      },
      tableCell2: {
        margin: 2,
        fontSize: 10,
        textAlign: 'left',
      },
        tableCellH: {
        margin: 2,
        fontSize: 10,
        textAlign: 'left',
        fontWeight: 900
      },
      viewdata: {
        flexDirection: 'column',
        borderBottomWidth: 1,
        padding: 4,
        paddingLeft: 5
      },
      viewdataFooter: {
        flexDirection: 'row',
        padding: 10,
        justifyContent: "space-between",
        paddingLeft: 5,
        marginTop: 58
      },
      viewdataHeader: {
        flexDirection: 'row',
        borderBottomWidth: 1,
        padding: 4,
        justifyContent: 'space-between',
      },
      viewLastData: {
        padding: 2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
      },
      viewdataReq: {
        marginLeft: 20
      },
    titleActa: {
        fontSize: 30,
        fontWeight: 800,
        marginBottom: 30
    },
    subtitleActa: {
        fontSize: 16,
    },
    subtitleActaData: {
        fontSize: 18,
        fontWeight: 800,
        textDecoration: "underline"
    },
    viewData: {
        paddingLeft: 50,
        paddingRight: 50,
        paddingTop: 15,
        textAlign: "justify"
    },
})

const dateReturner = () => {
    const current = new Date()
    const date = current.getDate()
    const mes = current.getMonth() + 1
    const year = current.getFullYear()
    return date + "/"+mes+"/"+year
}

const especialReturner = (opt: number) => {
    if(opt === 1) return "UNA CAJA POR BENEFICIARIO DIETA ESPECIAL DIABETES."
    if(opt === 2) return "UNA CAJA POR BENEFICIARIO DIETA ESPECIAL CELIAQUIA."
    if(opt === 3) return "UNA CAJA POR BENEFICIARIO DIETA ESPECIAL MIXTO."
    return ""
}

const checkIfEspecial = (e: IRemitoT) => {
    const regCeliaco = /\CEALIQUIA\b/
    const regCeliaco2 = /\CELIAQUIA\b/
    const regDiabetes = /\DIABETES\b/
    const regMixto = /\MIXTO\b/
    let check = false
    e.envios.forEach(e => {
        if(regDiabetes.test(e.des)) check =  true
        if(regCeliaco.test(e.des) || regCeliaco2.test(e.des)) check = true
        if(regMixto.test(e.des)) check = true
    });
    return check
}

const insumosDisplayer = (envios: IEnvioT[],insumosArr: IInsumo[],desgloses: number, dias: number) => {
    const elements = []
    const insumos: IRemitosDetalles[] = remitoEnviosInsumosReturner(insumosArr,envios)
    let opt = 0
    const regCeliaco = /\CEALIQUIA\b/
    const regCeliaco2 = /\CELIAQUIA\b/
    const regDiabetes = /\DIABETES\b/
    const regMixto = /\MIXTO\b/
    envios.forEach(e => {
        if(regDiabetes.test(e.des)) opt = 1
        if(regCeliaco.test(e.des) || regCeliaco2.test(e.des)) opt = 2
        if(regMixto.test(e.des)) opt = 3
    });
    const amount = insumos.length > 18 ? insumos.length : 18
    let undT = 0
    let kgT = 0
    let cajasT = 0
    let bolsT = 0
    let racT = 0
    for (let j = 0; j < amount; j++) {
        const i = insumos[j]
        if(i) {
            undT += i.unidades
            kgT += i.kilos
            cajasT += i.cajas
            bolsT += i.bolsas
            racT += i.raciones
        }
        elements.push(
            <View style={stylePedido.tableRow} key={j}>
                <View style={stylePedido.tableColIns2}>
                    <Text style={stylePedido.tableCell2}>{i ? i.des.toUpperCase() : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{i ? i.unidades : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{i ? i.kilos.toFixed(2) : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{i ? i.cajas : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{i ? i.bolsas : " "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{i ? i.raciones : " "}</Text>
                </View>
            </View>
        )
    }
        elements.push(
            <View style={stylePedido.tableRow} key={99}>
                <View style={stylePedido.tableColIns2}>
                    <Text style={stylePedido.tableCell}>Total</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{undT}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{kgT.toFixed(2)}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{cajasT}</Text>
                </View>
                <View style={stylePedido.tableColcod2}>
                    <Text style={stylePedido.tableCell}>{bolsT}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{racT}</Text>
                </View>
            </View>
        )
        if(opt > 0) {
            elements.push(
                <View style={stylePedido.tableRow} key={100}>
                    <View style={stylePedido.tableColIns}>
                        <Text style={{...stylePedido.tableCell2,fontWeight: 900}}>{especialReturner(opt)}</Text>
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
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>{" "}</Text>
                    </View>
                    <View style={stylePedido.tableColcod}>
                        <Text style={stylePedido.tableCell}>{" "}</Text>
                    </View>
                </View>
            )
        }
        elements.push(
            <View style={stylePedido.tableRow} key={100}>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell2}>Total de Desgloses: {desgloses}</Text>
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
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
                <View style={stylePedido.tableColcod}>
                    <Text style={stylePedido.tableCell}>{" "}</Text>
                </View>
            </View>
        )
        elements.push(
            <View style={stylePedido.tableRow} key={101}>
                <View style={stylePedido.tableColIns}>
                    <Text style={stylePedido.tableCell2}>Raciones por {dias} dias habiles</Text>
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

const pageContruct = (e: IRemitoT, copia: boolean,venc:string,cai:string,insumos:IInsumo[]) => {
        return (
            <Page size={'A4'} style={stylePedido.page}>
                <View style={{flexDirection: 'row', justifyContent: "center"}}>
                    <Image src={"/logo_big.png"} style={stylePedido.logo}/>
                </View>
                <View style={{flexDirection: 'row', justifyContent: "center"}}>
                    <Text style={stylePedido.subtitle}>[ R ]</Text>
                </View>
                <View style={{flexDirection: 'row', justifyContent: "center"}}>
                    <Text style={stylePedido.subtitle}>DOCUMENTO NO VALIDO COMO FACTURA</Text>
                </View>
                <View style={stylePedido.viewdataHeader}>
                    <View >
                        <Text style={stylePedido.title}>Soluciones & Servicios</Text>
                    </View>
                    <View >
                        <Text style={stylePedido.subtitle}>Junin 766 Piso 2 Oficina 4</Text>
                        <Text style={stylePedido.subtitle}>Corrientes, Corrientes, Argentina</Text>
                        <Text style={stylePedido.subtitle}>Codigo Postal 3400</Text>
                    </View>
                </View>
                <View style={stylePedido.viewdata}>
                    <View >
                        <Text style={{...stylePedido.body,fontWeight: 900}}>Telefono: 3795-586633</Text>
                        <Text style={{...stylePedido.body,fontWeight: 900}}>Correo: info@solucionesyservicios.com.ar</Text>
                        <Text style={stylePedido.body}>IVA: Responsable Inscripto</Text>
                        <Text style={stylePedido.body}>Ing. Brutos: 905-302000-1</Text>
                    </View>
                    <View >
                        <Text style={stylePedido.body}>Fecha: {dateReturner()}</Text>
                        <Text style={{...stylePedido.body,fontWeight: 900}}>Remito {parseRemitoString(e.pv,e.numero)}</Text>
                        <Text style={stylePedido.body}>CUIT: 30-71609306-5</Text>
                        <Text style={stylePedido.body}>Inicio Actividades: 01/07/2018</Text>
                    </View>
                </View>
                <View style={stylePedido.viewdata}>
                    <View >
                        <Text style={stylePedido.body}>MINISTERIO DE EDUCACION DE CORRIENTES</Text>
                        <Text style={stylePedido.body}>LA RIOJA 663</Text>
                        <Text style={stylePedido.body}>3400 - CORRIENTES</Text>
                        <Text style={stylePedido.body}>IVA: Exento</Text>
                    </View>
                    <View >
                        <Text style={stylePedido.body}>CUIT: 30-70731824-0</Text>
                    </View>
                    <View style={stylePedido.viewdata}>
                        <Text style={{...stylePedido.body,fontWeight: 900}}>PLAN: {e.numerop+" - "+e.periodo}</Text>
                        <Text style={{...stylePedido.body,fontWeight: 900}}>Lugar de Entrega: {e.completo}</Text>
                        <Text style={{...stylePedido.body,fontWeight: 900}}>Localidad: {e.localidad}</Text>
                        <Text style={{...stylePedido.body,fontWeight: 900}}>Direccion: {e.direccion}</Text>
                    </View>
                </View>
                <View style={stylePedido.view}>
                    <View style={stylePedido.table}>
                    <View style={stylePedido.tableRow_header}>
                        <View style={stylePedido.tableColIns}>
                            <Text style={stylePedido.tableCellH}>Insumo</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCellH}>Unid. Totales</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCellH}>Kg / lts</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCellH}>Pack</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCellH}>Unid.</Text>
                        </View>
                        <View style={stylePedido.tableColcod}>
                            <Text style={stylePedido.tableCellH}>Raciones</Text>
                        </View>
                    </View>
                    </View>
                    {insumosDisplayer(e.envios,insumos,e.envios.length,e.dias)}
                </View>
                <View style={stylePedido.viewdataFooter}>
                    <Text style={stylePedido.body}>Sello institucion</Text>
                    <Text style={stylePedido.body}>Conformidad (firma)</Text>
                    <Text style={stylePedido.body}>Aclaracion Cargo Dni</Text>
                    <Text style={stylePedido.body}>Fecha Recepcion</Text>
                </View>
                <View style={stylePedido.viewLastData}>
                    <View><Text style={stylePedido.body}>Fecha Vto.: {venc}</Text></View>
                </View>
                <View style={stylePedido.viewLastData}>
                    <View><Text style={stylePedido.body}>C.A.I N°: {cai}</Text></View>
                </View>
                <View style={stylePedido.viewLastData}>
                    <View><Text style={stylePedido.body}>{copia ? "Copia" : "Original"}</Text></View>
                </View>
            </Page>
        )
}

const especialPageContruct = (e:IRemitoT) => {
    if(checkIfEspecial(e)) {
        return (
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
            <View style={{...stylePedido.view,textAlign:"center"}}>
                <Text style={stylePedido.titleActa}>REGIMEN DE DIETAS ESPECIALES</Text>  
                <Text style={stylePedido.titleActa}>ARMADOS DE CAJAS</Text>  
            </View>
            <View style={stylePedido.view}>
                <Text style={{...stylePedido.subtitleActa,fontWeight:900}}>DIABETES</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Yerba de 1/2 kg.</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Leche descremada.</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Caja de edulcorante.</Text>
                <Text style={stylePedido.subtitleActa}>- 3 Paquetes de galletitas de avena INTEGRALIA.</Text>
                <Text style={stylePedido.subtitleActa}>- 2 Cereales sin azucar LASFOR.</Text>  
            </View>
            <View style={stylePedido.view}>
                <Text style={{...stylePedido.subtitleActa,fontWeight:900}}>CELIAQUIA</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Yerba de 1/2 kg.</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Leche.</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Chocolatada sin tacc LA VIRGINIA.</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Azucar.</Text>
                <Text style={stylePedido.subtitleActa}>- 3 Paquetes de galletitas sin tacc NATUZEN.</Text>
                <Text style={stylePedido.subtitleActa}>- 3 Cereales sin tacc SMAMS.</Text>  
            </View>
            <View style={stylePedido.view}>
                <Text style={{...stylePedido.subtitleActa,fontWeight:900}}>MIXTO</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Yerba de 1/2 kg.</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Leche descremada.</Text>  
                <Text style={stylePedido.subtitleActa}>- 1 Caja de edulcorante.</Text>
                <Text style={stylePedido.subtitleActa}>- 3 Paquetes de galletitas sin tacc NATUZEN.</Text>
                <Text style={stylePedido.subtitleActa}>- 3 Cereales sin tacc SMAMS.</Text>  
            </View>
            <View style={stylePedido.viewData}>
                <Text style={stylePedido.subtitleActa}>Observaciones:</Text> 
            </View>
            <View style={stylePedido.viewData}>
                <Text style={stylePedido.subtitleActa}>.............................................................................................................</Text> 
                <Text style={stylePedido.subtitleActa}>.............................................................................................................</Text> 
                <Text style={stylePedido.subtitleActa}>.............................................................................................................</Text> 
                <Text style={stylePedido.subtitleActa}>.............................................................................................................</Text> 
                <Text style={stylePedido.subtitleActa}>.............................................................................................................</Text> 
            </View>
        </Page>
        )
    }
    else return 0
}


const PDFRemitos = ({remito,venc,cai,insumos}:{remito: IRemitoT[],venc:string,cai:string,insumos: IInsumo[]}) => (
    <Document>
        {remito.flatMap((e) => [
            pageContruct(e,false,venc,cai,insumos),
            pageContruct(e,true,venc,cai,insumos),
            especialPageContruct(e)
        ])}
    </Document>
)

export default PDFRemitos

