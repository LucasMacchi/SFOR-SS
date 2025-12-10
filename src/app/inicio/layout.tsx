import LinkMenu from "@/Componets/LinkMenu";
import PlanSelector from "@/Componets/PlanSelector";
import DBPlanActual from "@/db/DBPlanActual";
import DBUserPlan from "@/db/DBUserPlan";
import decodeJWT from "@/utils/decodeJWT";
import { text_2_s_style } from "@/utils/styles";
import { CSSProperties } from "react";
import Image from "next/image";
import { headers } from "next/headers";
import logout from "@/utils/logout";
import LogoutBtn from "@/Componets/LogoutBtn";



export default async function Layout({children}: Readonly<{children: React.ReactNode}>) {

  const linkListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column"
  }
  const h = headers()
  const userData = await decodeJWT()
  const planActual = await DBPlanActual()
  const userplan = await DBUserPlan()

  const logoutFn = async (): Promise<boolean> => {
    "use server"
    await logout()
    return true
  }

  return (
        <div style={{display: "flex", justifyContent: "start",margin: 0}}>
          <div style={{paddingLeft:10 ,marginRight: 25, width: 250, height: "100vh",backgroundColor: "#4A6EE8", position: "fixed"}}>
            <div style={{marginBottom: 150}}>
                <h4 style={text_2_s_style}>USER: {userData ? userData.username : "NaN"}</h4>
                <PlanSelector planes={planActual} userPlan={userplan}/>
            </div>
            <div style={linkListStyle}>
                <LinkMenu where="/inicio" titulo="inicio" />
                <LinkMenu where="/inicio/generar" titulo="generar" />
                <LinkMenu where="/inicio/eliminar" titulo="eliminar" />
                <LinkMenu where="/inicio/traer" titulo="traer" />
                <LinkMenu where="/inicio/planes" titulo="planes" />
                <LinkMenu where="/inicio/insumos" titulo="insumos"/>
                <LinkMenu where="/inicio/escuelas" titulo="escuelas" />             
                <LinkMenu where="/inicio/stock" titulo="stock"/>
                <LinkMenu where="/inicio/informes" titulo="informes" />
                <LinkMenu where="/inicio/facturacion" titulo="facturacion" />
                <LinkMenu where="/inicio/datos" titulo="datos" />
            </div>
            <div >
                <LogoutBtn logoutFn={logoutFn}/>
            </div>
          </div>
          <div style={{flex: 1,marginTop: 30,marginLeft: 260}}>
            <div style={{display: "flex",justifyContent: "center"}}>
                <Image src={"/logo_big.png"} alt="logo soluciones y servicios" width={400} height={130}/>
            </div>
            {children}
          </div>
        </div>        
  );
}