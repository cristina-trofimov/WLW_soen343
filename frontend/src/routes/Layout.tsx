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
                    <div className={classes.logo}><Image src={"/WLW_logo.png"} h={"80px"}/></div>
                </a>
                <button className={classes.headerButton} onClick={() => navigate("/quote")}>QUOTATION</button>
                <button className={classes.headerButton} onClick={() => navigate("/")}>TRACKING</button>
                <button className={classes.headerButton} onClick={() => navigate("/contact-us")}>CONTACT US</button>
                {sessionStorage.getItem("isLogged") === "false" ? ( <LoginRegister /> ) : 
                    (<>
                        <button className={classes.headerButton} onClick={() => navigate("/order")}>SHIPPING</button>
                        <UserDropdown />
                    </>)}
            </div>
            <main className={classes.mainContent}><Outlet/></main>
        </div>
    )
};

export default Layout;