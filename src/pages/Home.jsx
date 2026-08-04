import { Link } from "react-router-dom"

// import assets from "../assets/";
import banner from "../assets/2025-assets/ofwsummit-2025-banner.jpg";
import vicinity_map from "../assets/2024-vicinity-map.jpg";
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
            <a  className="text-center" href="">Register Here</a>
            
            {/* <div className="prompt-note">
                <h4>Online Registration will end on November 9, 2023 12pm.</h4>
            </div> */}
        </div>
        <div className="event-section">
            <div className="event-wrapper">	
                <div className="event-img">
                    <img src="https://ofwsummit.villarfoundation.com.ph/wp-content/uploads/2025/10/imgv2-prizes-scaled.jpg" alt=""/>
                </div>
                <div className="event-content">	
                    <img src="2025-assets/section1-logo.png" alt=""/>
                    <h4>November 14, 2025 (Friday), 8:00 AM to 4:00 PM <br/>The Tent at Vista Global South, C5 Extension Road, Las Piñas City</h4>
                    <h3>SALI NA! Scan QR Code to Register <br/>LIBRE ANG REGISTRATION AT ENTRANCE!</h3>
                    <img src="qrcode-2024.jpg" alt="" width="450"/>
                </div>	
            </div>			
        </div>

        <div className="other-section">
            <div className="custom-container">
                <div className="section-logo">
                    <img src="2024-logo.svg" alt=""/>
                </div>
                <div className="section-main-content">
                    <div className="section-list pd40">
                        <div className="text-center">
                            
                            <img src="2025-assets/section1-logo.png" alt=""/>
                            <h4>November 14, 2025 (Friday), 8:00 AM to 4:00 PM <br/>The Tent at Vista Global South, C5 Extension Road, Las Piñas City</h4>
                        </div>

                        <h3>Registration is a must and entitles the OFW or Family to a raffle for the Summit</h3>
                        <h5>Mag-register sa alinmang sumusunod na mga paraan:</h5>
                        <br/>
                        <h3>For Attendees at The Tent:</h3>
                        <h5>Maaari kayong <strong>Manalo ng House and Lot, Motor, Pangkabuhayan Showcase, at Appliances</strong>, gawin lamang ang sumusunod:</h5>
                        <ul>
                            <li>Mag-register online sa https://ofwsummit.villarfoundation.com.ph/;</li>
                            <li>I-scan ang QR code na makikita sa harap ng flyer/poster na ito at sundan ang instructions;</li>
                            {/* <li>On-site registration sa November 14, 2025, Friday</li> */}
                        </ul>

                        <div className="section-qr">
                            <h2>SALI NA! LIBRE ANG REGISTRATION AT ENTRANCE!</h2>
                            <img src="/src/assets/qrcode-2024.jpg" alt="" width="350"/>
                        </div>
                    </div>
                    <div className="section-list">
                        {/* <p>Kung ikaw ay isang OFW o asawa, anak, magulang o kapatid ng isang OFW, mag-register na para maka-attend sa 14th OFW & Family Summit nang matuto mag-invest, malaman ang mga napapanahong negosyo, at magkaroon ng pagkakataong manalo ng house & lot, pangkabuhayan showcase, home appliances, at marami pang iba!</p>
                        <h3>Para makasali sa raffle draw, maaari kayong mag-register sa alinmang sumusunod na mga paraan:</h3>
                        <ul>
                            <li>Mag-register online sa https://ofwsummit.villarfoundation.com.ph/</li>
                            <li>I-scan ang QR code na makikita sa harap ng flyer/poster na ito at sundan ang instructions</li>
                        </ul> */}
                        <h3>For Online Viewers:</h3>
                        <h5>Maaari kayong <strong>Manalo ng Negosenso Package</strong>. 10 ang mapipili para sa Virtual Raffle Prize na ito, gawin lamang ang mga sumusunod:</h5>
                        <ul>
                            <li>Mag-register online sa http://ofwsummit.villarfoundation.com.ph/;</li>
                            <li>I-scan ang QR Code na makikita sa harap ng flyer/poster na ito at sundan ang instructions;</li>
                            <li>Makakatanggap ng email kung successful ang inyong registration. Ito ang magsisilbing proof of entry sa Virtual Raffle.</li>
                        </ul>

                        <table>
                            <thead>
                                <tr>
                                    <th>Para sa mga:</th>
                                    <th>Kailangan ng OFW:</th>
                                    <th>Kailangan ng Kakatawan (representative)</th>
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
                                    <td> </td>
                                    <td>Valid ID at Birth Certificate</td>
                                </tr>
                                <tr>
                                    <td>Magulang ng OFW <br/><strong>(Walang Asawa)</strong></td>
                                    <td><strong>Birth Certificate</strong></td>
                                    <td>Valid ID</td>
                                </tr>
                                <tr>
                                    <td>Kapatid ng OFW <br/><strong>(Walang Asawa)</strong></td>
                                    <td>Birth Certificate</td>
                                    <td>Valid ID at Birth Certificate</td>
                                </tr>
                            </tbody>
                        </table>
                        <h4>Hintayin ang ipapadalang verification sa inyong email o mobile para maka-attend sa summit at makasali sa raffle.</h4>
                    </div>
                </div>
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