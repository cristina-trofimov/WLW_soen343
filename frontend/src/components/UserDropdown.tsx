import { Menu, Avatar } from '@mantine/core';
import { useNavigate } from 'react-router-dom';
import axiosClient from '../axiosClient';

const UserDropdown = () => {
    const navigate =  useNavigate()

    const logout = async() => {
      try {
        await axiosClient.post('/logout')
        console.log(sessionStorage.getItem("isLogged"));
        sessionStorage.setItem("isLogged", "false");
        navigate("/home");
      } catch (error) {
        console.error("Logout failed:", error);
      }
    };

    const goToMyOrders = () => {
      navigate('/my-orders')
    };
    
    return (
        <Menu trigger="click-hover" openDelay={100} closeDelay={500} shadow="md" width={200} zIndex={1600} withArrow >
          <Menu.Target>
            <Avatar src={null} radius="xl" ml="lg" color="#d4a373" />
          </Menu.Target>
          <Menu.Dropdown >
            <Menu.Item>Settings</Menu.Item>
            <Menu.Item onClick={goToMyOrders}>My Orders</Menu.Item>
            <Menu.Divider />
            <Menu.Item onClick={logout} >Logout</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      );
    }

export default UserDropdown