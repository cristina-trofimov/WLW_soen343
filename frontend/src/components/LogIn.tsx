import { useState } from "react";
import axiosClient from "../axiosClient"
import { useNavigate } from 'react-router-dom';
import { AxiosError } from "axios";
import { Button, Fieldset, Input, PasswordInput, TextInput } from "@mantine/core";


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
                <Fieldset legend="Login">
                    <TextInput label="Email" placeholder="example@domain.com" value={email} onChange={(e) => setEmail(e.target.value)} />
                    <PasswordInput label="Password" placeholder="password123!" mt="md" value={password} onChange={(e) => setPassword(e.target.value)} />
                </Fieldset>
                
                <Button type="button" onClick={() => logInCustomer()} variant="light">Continue</Button>
            </form>

        </div>
    )
}

export default LogIn