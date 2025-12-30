import AddUser from "@/Componets/AddUser"
import DisplayUsers from "@/Componets/DisplayUsers"
import DBCreateUser from "@/db/DBCreateUser"
import DBEditUsuario from "@/db/DBEditUsuario"
import DBUsuarios from "@/db/DBUsuarios"
import { IUsuario } from "@/utils/interfaces"
import { hr_style, text_2_t_style } from "@/utils/styles"



export default async function Page() {
    
    const usuarios = await DBUsuarios()

    const changeUserFn = async (id:number,column:string,newV:string):Promise<boolean> => {
        "use server"
        return await DBEditUsuario(id,newV,column)
    }

    const addUserFn = async (u: IUsuario):Promise<boolean> => {
        "use server"
        try {
            const res = await DBCreateUser(u)
            return res            
        } catch (error) {
            console.log(error)
            return false
        }
    }

    return (
        <div style={{marginLeft: 25, marginBottom: 100}}>
            <div>
                <h2 style={text_2_t_style}>USUARIOS</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <DisplayUsers changeUserFn={changeUserFn} usuarios={usuarios ? usuarios : []}/>
            </div>
            <div>
                <h2 style={text_2_t_style}>CREAR USUARIO</h2>
                <hr color="#4A6EE8" style={hr_style}/>
            </div>
            <div>
                <AddUser addUserFn={addUserFn}/>
            </div>
        </div>
    )
}