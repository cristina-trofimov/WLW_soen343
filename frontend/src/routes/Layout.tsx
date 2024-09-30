import { Outlet } from 'react-router-dom';
import classes from './Layout.module.css';
import { useNavigate } from 'react-router-dom';

const Layout = () => {

    const navigate = useNavigate();

    return (
        <div className={classes.layoutContainer}>
            <header className={classes.header}>
                <div className={classes.logo}>MyApp</div>
                <button className={classes.loginButton} onClick={() => navigate("/login")} >Log In</button>
            </header>
            <main className={classes.mainContent}><Outlet /></main>
        </div>
    )
};

export default Layout;