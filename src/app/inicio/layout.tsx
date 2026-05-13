import DBPlanActual from "@/db/DBPlanActual";
import DBUserPlan from "@/db/DBUserPlan";
import decodeJWT from "@/utils/decodeJWT";
import { CSSProperties } from "react";
import logout from "@/utils/logout";
import DBAddReparto from "@/db/DBAddReparto";
import MenuLateral from "@/Componets/MenuLateral";



export default async function Layout({children}: Readonly<{children: React.ReactNode}>) {

  const linkListStyle: CSSProperties = {
    display: "flex",
    flexDirection: "column"
  }
  let userData = await decodeJWT()
  const planActual = await DBPlanActual()
  const userplan = await DBUserPlan()

  const logoutFn = async (): Promise<boolean> => {
    "use server"
    await logout()
    return true
  }

  const createRepartoFn = async (plan:number,year:number): Promise<boolean>  => {
    "use server"
    try {
        const res = await DBAddReparto(plan,year)
        return res
    } catch (error) {
        console.log(error)
        return false
    }
  }

  if(!userData) userData = {username:"NaN",userId:0,email:"NaN",rol:10}

  return (
        <div style={{display: "flex", justifyContent: "start",margin: 0}}>
          <MenuLateral rol={userData.rol} username={userData.username} planActual={planActual} userplan={userplan} createRepartoFn={createRepartoFn} logoutFn={logoutFn} />
          <div style={{flex: 1,marginTop: 30}}>
            {children}
          </div>
        </div>        
  );
}