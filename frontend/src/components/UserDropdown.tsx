import { Menu, Avatar } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const UserDropdown = () => {
    const navigate =  useNavigate()

    const logout = () => {
        sessionStorage.setItem("isLogged", "false");
        console.log("logging out")
        console.log(sessionStorage.getItem("isLogged"))
        navigate("/home")
    }
    
    return (
        <Menu trigger="click-hover" openDelay={100} closeDelay={500} shadow="md" width={200} zIndex={600}
        // classNames={classes.loginButton}
        >
          <Menu.Target>
            <Avatar src={null} radius="xl" ml="lg" color="#d4a373" />
          </Menu.Target>
          <Menu.Dropdown >
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item>My Orders</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={logout} >Logout</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    }

export default UserDropdown