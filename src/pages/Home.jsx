import { Link } from "react-router-dom"

// import assets from "../assets/";
import banner from "../assets/hero-banner-2026.jpg";
import whiteLogo2026 from "../assets/2026-white-logo.svg";
import blackLogo2026 from "../assets/ofw-summit-15th.svg";
import qr2026 from "../assets/qr-2026.svg";
import eventbg2026 from "../assets/event-bg-2026.png";
import vicinity_map from "../assets/vicinity-map-2026.svg";
import camella_logo from "../assets/camella.png";
import all_day from "../assets/all-day.png";
import all_home from "../assets/all-home.png";
import petron_logo from "../assets/petron.png";


const heroStyle = {
  backgroundImage: `url(${banner})`,
  backgroundSize: "cover",
  backgroundPosition: "center",
};


const Home = () => {
    return <>
        <div className="hero-section" style={heroStyle}>
            <div className="hero-content">
                <img src={whiteLogo2026} alt="OFW Summit 2026" />
                <a  className="text-center" href=""><span></span> Register Here</a>
            </div>
            
            
            {/* <div className="prompt-note">
                <h4>Online Registration will end on November 9, 2023 12pm.</h4>
            </div> */}
        </div>
        <div className="event-section">
            <div className="event-wrapper">	
                <div className="event-img">
                    <img src={eventbg2026} alt="Event 2026"/>
                </div>
                <div className="event-content">	
                    <img src={blackLogo2026} alt="OFW Summit 2026"/>
                    <h3><strong>Registration is a must and entitles the OFW or Family</strong> to a raffle for the Summit</h3>
                    <h4>Mag-register sa alinmang sumusunod na mga paraan:</h4>
                    <ul>
                        <li>Mag-register online sa <a href="http://ofwsummit2023.villarsipag.org/">http://ofwsummit2023.villarsipag.org/</a>;</li>
                        <li><strong>I-scan ang QR code</strong> na makikita sa harap ng flyer/poster na ito at sundan ang instructions;</li>
                        <li><strong>Magpunta sa OFW & Family Summit Desk</strong> na makikita sa Vista Mail and Starmall branches nationwide; o kaya</li>
                        <li>On-site registration sa November 18, Friday</li>
                    </ul>
                    <div className="join-via-qrcode">
                        <h3>SALI NA!<br/>Scan QR Code to <strong>Register!</strong></h3>
                        <img src={qr2026} alt="QR Code 2026" />
                    </div>
                    
                </div>	
            </div>			
        </div>

        <div className="instruction-on-how-to-join">
            <div className="custom-container">
                <div className="wrapper">
                    <div className="left-column-content">
                        <img className="ofw-logo" src={blackLogo2026} alt="OFW Summit 2026"/>
                        <p><strong>Kung ikaw ay isang OFW o asawa, anak, magulang o kapatid ng isang OFW, mag register na para <br />
    maka-attend sa 15th OFW & Family Summit</strong> nang matuto mag invest, malaman ang mga napapanahong negosyo at magkaroon ng pagkakataong manalo ng house & lot, pangkabuhayan showcase, home appliances at marami pang iba! Para makasali sa raffle draw, maaari kayong mag-register sa alinmang sumusunod na mga paraan:</p>
                        <div className="join-via-qrcode">
                            <h3>SALI NA!<br/>Scan QR Code to <strong>Register!</strong></h3>
                            <img src={qr2026} alt="QR Code 2026" />
                        </div>
                    </div>

                    <div className="right-column-content">
                        <h3>Kung kayo ay magreregister, <strong>huwag nyo pong kalimutan magdala ng alinman sa mga sumusunod na mga dokumento</strong></h3>
                        <ul>
                            <li>Kopya ng passport ng OFW o kapamilya na OFW kasama ang working visa;</li>
                            <li>Proof of remittances;</li>
                            <li>Seaman's book:</li>
                            <li>Job contract;</li>
                            <li>Kopya ng mga dokumento a magpapatunay na ikaw ay kamag-anak ng OFW (Marriage Certificate, Birth Certificate, etc.);</li>
                            <li>Katunayan na ikaw ay bakunado laban sa COVID- 19 gaya ng vaccination card, vaccination certificate (Vax Cert) o international certificate of vaccination (IC) with 1st dose and 2nd dose;</li>
                            <li>Kung ang kamag-anak ang attend upang kumatawan sa OFW, magdala ng karagdagang dokumento batay sa mga sumusunod:</li>
                        </ul>
                    </div>
                </div>
                    
                <table>
                    <thead>
                        <tr>
                            <th>Para sa mga:</th>
                            <th>Kailangan ng OFW:</th>
                            <th>Kailangan ng Kakatawan (Representative)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Asawa ng OFW</td>
                            <td>Marriage Certificate</td>
                            <td>Valid ID</td>
                        </tr>
                        <tr>
                            <td>Anak ng OFW</td>
                            <td>&nbsp;</td>
                            <td>Valid ID and Birth Certificate</td>
                        </tr>
                        <tr>
                            <td>Magulang ng OFW (Walang Asawa)</td>
                            <td>Birth Certificate</td>
                            <td>Valid ID</td>
                        </tr>
                        <tr>
                            <td>Kapatid ng OFW (Walang Asawa)</td>
                            <td>Birth Certificate</td>
                            <td>Valid ID and Birth Certificate</td>
                        </tr>
                    </tbody>
                </table>

                <p>Hintayin ang ipapadalang verification sa inyong email o mobile para maka-attend sa summit at makasali sa raffle.</p>
            </div>
        </div>

        <div className="vicinity-map">	
            <div className="custom-container">	
                <img src={vicinity_map} alt=""/>
                <p>For more details, please call us at: <a href="tel:09750616566">0975-0616-566</a> | Visit us at: <a href="https://www.facebook.com/Senator.Cynthia.Villar" target="_blank">www.facebook.com/Senator.Cynthia.Villar</a><br/><a href="https://www.facebook.com/VillarFoundation" target="_blank">www.facebook.com/VillarFoundation</a> | <a href="https://www.villarfoundation.com.ph" target="_blank">www.villarfoundation.com.ph</a><br/>Email us on: <a href="mailto:ofwsummit.villarfoundation@gmail.com">ofwsummit.villarfoundation@gmail.com</a></p>
            </div>			
        </div>			

        <div className="sponsors-section">
            <div className="custom-container">
                <h3>Corporate Sponsors</h3>
                <ul>
                    <li><img src={camella_logo} alt=""/></li>
                    
                    <li><img src={all_day} alt=""/></li>
                    
                    <li><img src={all_home} alt=""/></li>
                    
                    <li><img src={petron_logo} alt=""/></li>
                </ul>
            </div>
        </div>
    </>
}

export default Home;