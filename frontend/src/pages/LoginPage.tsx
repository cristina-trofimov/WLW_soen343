import { useState } from "react"
import LogIn from "../components/LogIn"
import Register from "../components/Register"


const LoginPage = () => {
    const [choice, setChoice] = useState('login')
    return (
        <div>
            <div>Welcome to WLW</div>
            <button onClick={() => setChoice("login")}>Log In</button>
            <button onClick={() => setChoice("register")}>Register</button>

            {(choice === "login") ? <LogIn /> : <Register />}
        </div>
    )
}

export default LoginPage