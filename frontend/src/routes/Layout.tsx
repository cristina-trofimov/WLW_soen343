import { Outlet } from 'react-router-dom';
import classes from './Layout.module.css';
import { useNavigate } from 'react-router-dom';
import { Image } from '@mantine/core';

const Layout = () => {

    const navigate = useNavigate();

    return (
        <div className={classes.layoutContainer}>
            <div className={classes.header}>
                <a onClick={() => navigate("/home")}>
                    <div className={classes.logo}><Image src={"./public/WLW_logo.png"} h={"80px"}/></div>
                </a>
                <button className={classes.headerButton} onClick={() => navigate("/")}>SHIPPING</button>
                <button className={classes.headerButton} onClick={() => navigate("/quote")}>BUSINESS SERVICE</button>
                <button className={classes.headerButton} onClick={() => navigate("/")}>TRACKING</button>
                <button className={classes.loginButton} onClick={() => navigate("/login")}>Log In</button>
            </div>
            <main className={classes.mainContent}><Outlet/></main>
        </div>
    )
};

export default Layout;