import { useState } from "react";
import axiosClient from "../axiosClient"
import { useNavigate } from 'react-router-dom';
import { Axios, AxiosError } from "axios";


function LogIn() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();


    const logInCustomer = async () => {
        console.log(email)
        console.log(password)

        try {
            await axiosClient.post('/login', { email, password })

            navigate("/home")
        } catch (error) {
            if ((error as AxiosError).response?.status === 401) {
                alert("Invalid email or password")
            }
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