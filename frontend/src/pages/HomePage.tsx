import { Button } from "@mantine/core"
import axiosClient from "../axiosClient"

const HomePage = () => {


    const getUser = async () => {
        try {
            const response = await axiosClient.get("/me");
            console.log(response.data);
        } catch (err) {

            console.error("Error fetching user data:", err);
        }
    };

    const handleClick = () => {
        getUser();
    };

    return (
        <div>
            Welcome to HomePage

            <Button onClick={handleClick}>Current User</Button>
        </div>
    )
}

export default HomePage