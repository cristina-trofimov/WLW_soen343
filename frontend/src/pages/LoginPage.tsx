import { useState } from "react"
import { Tabs } from "@mantine/core"
import LogIn from "../components/LogIn";
import Register from "../components/Register";


const LoginPage = () => {
    const [activeTab, setActiveTab] = useState<string | null>("login");
    return (
        <div >
            <div>Welcome to WLW</div>

            <Tabs variant="outline" defaultValue={activeTab} onChange={(value) => setActiveTab(value)}>
                <Tabs.List  >
                    <Tabs.Tab value="login" >
                        Login
                    </Tabs.Tab>
                    <Tabs.Tab value="register" >
                        Register
                    </Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="login">
                    <LogIn />
                </Tabs.Panel>
                <Tabs.Panel value="register">
                    <Register />
                </Tabs.Panel>
            </Tabs>
        </div>
    )
}

export default LoginPage