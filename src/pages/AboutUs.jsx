import { Link } from "react-router-dom"
import { useEffect, useState } from "react";

import gal1 from "../assets/gal-1.png";
import gal2 from "../assets/gal-2.png";
import gal3 from "../assets/gal-3.png";
import gal4 from "../assets/gal-4.png";
import gal5 from "../assets/gal-5.png";
import gal6 from "../assets/gal-6.png";
import gal7 from "../assets/gal-7.png";
import gal8 from "../assets/gal-8.png";
import gal9 from "../assets/gal-9.png";
import gal10 from "../assets/gal-10.png";
import gal11 from "../assets/gal-11.png";
import gal12 from "../assets/gal-12.png";
import gal13 from "../assets/gal-13.png";



const AboutUs = () => {

    
    const [acf, setAcf] = useState(null);
    const [ImageUrl, setImageUrl] = useState(null);

   
    
    useEffect(() => {
        fetch("http://localhost:8005/wp-json/wp/v2/pages/55")
        .then(res => res.json())
        .then(data => {
            setAcf(data.acf);

            // second fetch for image ID
            if (data.acf?.other_hero_image) {
            fetch('http://localhost:8005/wp-json/wp/v2/media/${data.acf.other_hero_image}')
                .then(res => res.json())
                .then(img => setImageUrl(img.source_url));
            }
        });
    }, []);




        // console.log(data.acf.other_hero_image);

    return <>
    <div className="other-page-banner">
		{ImageUrl && <img src={ImageUrl} alt="Hero Banner" />}
	</div>

	<div className="other-page-main-content">
		<div className="custom-container">
			<div className="about-wrapper">
				{/* <h1><?php the_title(); ?></h1> */}
				{/* <?php the_content(); ?> */}
			</div>

			<div className="event-gallery-section">
				<h2>Event Gallery</h2>
				
				<div className="event-masonry-wrapper-three">
					<div className="event-grid"><img className="zz_image" src={gal1} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal2} alt="" style={{marginBottom: "10px"}}/><img className="zz_image" src={gal3} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal4} alt="" style={{marginBottom: "10px"}}/><img className="zz_image" src={gal5} alt=""/></div>
				</div>
				<div className="event-masonry-wrapper">
					<div className="event-grid"><img className="zz_image" src={gal6} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal7} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal8} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal9} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal10} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal11} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal12} alt=""/></div>
					<div className="event-grid"><img className="zz_image" src={gal13} alt=""/></div>
				</div>
			</div>
		</div>
	</div>	

	<div className="about-more-details">
		<div className="custom-container">
			<p>For more details, please call us at: <a href="tel:09750616566">0975-0616-566</a> | Visit us at: <a href="https://www.facebook.com/Senator.Cynthia.Villar" target="_blank">www.facebook.com/Senator.Cynthia.Villar</a><br/><a href="https://www.facebook.com/VillarFoundation" target="_blank">www.facebook.com/VillarFoundation</a> | <a href="https://www.villarfoundation.com.ph" target="_blank">www.villarfoundation.com.ph</a><br/>Email us on: <a href="mailto:ofwsummit.villarfoundation@gmail.com">ofwsummit.villarfoundation@gmail.com</a></p>
		</div>
	</div>

	<div className="sponsors-section">
		<div className="custom-container">
			<h3>Corporate Sponsors</h3>
			<ul>
				<li><img src="<?php echo IMAGES; ?>camella.png" alt=""/></li>
				
				
				<li><img src="<?php echo IMAGES; ?>all-home.png" alt=""/></li>
				<li><img src="<?php echo IMAGES; ?>all-day.png" alt=""/></li>
				
				<li><img src="<?php echo IMAGES; ?>petron.png" alt=""/></li>
				
			</ul>
		</div>
	</div>
	<div id="myModal" className="modal">
	  <img className="modal-content" id="img01"/>
	</div>
    </>
}

export default AboutUs;