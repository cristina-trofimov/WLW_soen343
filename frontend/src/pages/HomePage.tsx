import { Button } from "@mantine/core"
import axiosClient from "../axiosClient";

const HomePage = () => {

    const logOut = async () => {
        await axiosClient.post("/logout");
        alert("Logged Out")
    };

    return (
        <div>
            Welcome to HomePage
            <Button variant="outline" onClick={() => logOut()}>
                LogOut
            </Button>
        </div>

    )
}

export default HomePage