import { Outlet } from 'react-router-dom';
import './Layout.css';
import { useNavigate } from 'react-router-dom';

const Layout = () => {

    const navigate = useNavigate();

    return (
        <div className="layout-container">
            <header className="header">
                <div className="logo">MyApp</div>
                <button className="login-button" onClick={() => navigate("/login")} >Log In</button>
            </header>
            <main className="main-content"><Outlet /></main>
        </div>
    )
};

export default Layout;