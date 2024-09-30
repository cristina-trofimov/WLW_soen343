import { useState } from "react";
import axiosClient from "../axiosClient"
import { useNavigate } from 'react-router-dom';


function LogIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const logInCustomer = async () => {
        console.log(email)
        console.log(password)

        const response = await axiosClient.post('/login', { email, password })

        if (response.status === 200) {
            navigate("/home")
        }
    }

    return (
        <div>
            <form>
                <div>
                    <label>Email:</label>
                    <input
                        type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div>
                    <label>Password:</label>
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="button" onClick={() => logInCustomer()}>Continue</button>
            </form>

        </div>
    )
}

export default LogIn