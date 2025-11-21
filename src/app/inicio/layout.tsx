import LinkMenu from "@/Componets/LinkMenu";
import DBPlanActual from "@/db/DBPlanActual";
import decodeJWT from "@/utils/decodeJWT";
import { text_2_s_style } from "@/utils/styles";
import { CSSProperties } from "react";



export default async function Layout({children}: Readonly<{children: React.ReactNode}>) {

  const linkListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column"
  }

  const userData = await decodeJWT()
  const planActual = await DBPlanActual()

  return (
        <div style={{display: "flex", justifyContent: "start",margin: 0}}>
          <div style={{paddingLeft:10 ,marginRight: 25, width: 250, height: "100vh",backgroundColor: "#4A6EE8", position: "fixed"}}>
            <div style={{marginBottom: 150}}>
                <h4 style={text_2_s_style}>usuario: {userData ? userData.username : "NaN"}</h4>
                <h2 style={text_2_s_style}>PLAN: {planActual}</h2>
            </div>
            <div style={linkListStyle}>
                <LinkMenu where="/inicio" titulo="inicio"/>
                <LinkMenu where="/inicio/generar" titulo="generar"/>
                <LinkMenu where="/inicio/eliminar" titulo="eliminar"/>
                <LinkMenu where="/inicio/traer" titulo="traer"/>
                <LinkMenu where="/inicio/planes" titulo="planes"/>
                <LinkMenu where="/inicio/informes" titulo="informes"/>
                <LinkMenu where="/inicio/facturacion" titulo="facturacion"/>
                <LinkMenu where="/inicio/datos" titulo="datos"/>
            </div>
          </div>
          <div style={{flex: 1,marginTop: 60,marginLeft: 250}}>
            {children}
          </div>
        </div>        
  );
}