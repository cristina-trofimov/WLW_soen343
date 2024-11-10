import { Outlet } from 'react-router-dom';
import classes from './Layout.module.css';
import { useNavigate } from 'react-router-dom';
import { Image } from '@mantine/core';
import LoginRegister from '../components/LoginRegister';
import UserDropdown from '../components/UserDropdown';

const Layout = () => {

    const navigate = useNavigate();

    return (
        <div className={classes.layoutContainer}>
            <div className={classes.header}>
                <a onClick={() => navigate("/home")}>
                    <div className={classes.logo}><Image src={"./WLW_logo.png"} h={"80px"}/></div>
                </a>
                <button className={classes.headerButton} onClick={() => navigate("/")}>SHIPPING</button>
                <button className={classes.headerButton} onClick={() => navigate("/quote")}>BUSINESS SERVICE</button>
                <button className={classes.headerButton} onClick={() => navigate("/")}>TRACKING</button>
                {sessionStorage.getItem("isLogged") === "true" ? <UserDropdown /> : (<LoginRegister />) }
            </div>
            <main className={classes.mainContent}><Outlet/></main>
        </div>
    )
};

export default Layout;