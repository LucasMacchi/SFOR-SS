import Login from "@/Componets/Login";
import axios from "axios";

export default function Page() {
    
    const loginFn = async (username:string,password:string): Promise<boolean> => {
        "use server"
        try {
            const res = await axios.post('/login/api',{username,password})
            if(res) return true
            return false
        } catch (error) {
            console.error(error)
            return false
        }
    }

    return (
        <div style={{display: "flex",justifyContent: "center", marginTop: 150}}>
            <Login loginFun={loginFn}/>
        </div>
    )
}