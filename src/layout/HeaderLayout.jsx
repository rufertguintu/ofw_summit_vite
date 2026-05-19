import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom";

import logo from "../assets/2024-logo.svg";

const HeaderLayout = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");

    
    const logout = () => {
        localStorage.removeItem("token");
        navigate("/login");
    };

    return <>
        
        <header>
            <div className="custom-container">
                <div className="main-header">
                <div className="header-logo">
                    <Link to="/"><img src={logo} alt="" width="200"/></Link>
                </div>
                <div className="header-nav">
                    <ul>
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/about-us">About Us</Link></li>
                    <li className="has-child">
                        <Link to="/">Join Event</Link>
                        <ul className="child-nav">
                        <li><Link to="/">Online Register</Link></li>
                        <li><Link to="/">Mall Register</Link></li>
                        <li><Link to="/">On-site Register</Link></li>
                        <li><Link to="/">Networker</Link></li>
                        </ul>
                    </li>
                    <li><Link to="/">Profile</Link></li>
                    <li>{token ? <button onClick={logout}>Logout</button> : <Link to="/login">Login</Link>}</li>
                    </ul>
                </div>
                </div>
            </div>
            </header>

            <nav role="navigation">
            <div id="menuToggle">
                <input type="checkbox" />
                <span className="first-span"></span>
                <span className="second-span"></span>
                <span className="third-span"></span>
                <Link to="/"><img src={logo} alt=""/></Link>
            <ul id="menu">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/">About Us</Link></li>
                <li><Link to="/">Join Event</Link></li>
                <li><Link to="/">Profile</Link></li>
                <li><Link to="/">Logout</Link></li>
            </ul>
            </div>
            </nav>
    </>
}

export default HeaderLayout;