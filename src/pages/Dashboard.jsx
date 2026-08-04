import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import DashboardTitle from "../components/DashboardTitle";
import { fetchApi } from "../store/api";
import OFWtypeChart from "../components/OFWtypeChart";
import LocationChart from "../components/LocationChart";


const Dashboard = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const [data, setData] = useState(0);
    useEffect(() => {
        fetchApi("/wp-json/custom/v1/user-data")
            .then(res => res.json())
            .then(json => setData(json))
            .catch(err => console.error(err));
    }, []);

    const getUser = async (token) => {
        try {
            const res = await fetchApi("/wp-json/wp/v2/users/me");

            const user = await res.json();

            console.log("USER:", user.roles[0]);
        } catch (error) {
            console.error("ERROR:", error);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");

        if (token) {
            getUser(token);
        }
    }, []);

    const verified = data?.verified;
    const incomplete = data?.incomplete;
    const returned = data?.returned;
    const reject = data?.reject;
    
    const attendance = data?.attendance;
    const attendee_yes = data?.attendee_yes;
    const attendee_no = data?.attendee_no;
    const onsite_attendee = data?.onsite_attendee;
    const online_attendee = data?.online_attendee;
    const companion = data?.companion;

    const online_registrant = data?.online_registrant;
    const onsite_registrant = data?.onsite_registrant;
    const mall_registrant = data?.mall_registrant;
    const networker_registrant = data?.networker_registrant;
    const owwa_registrant = data?.owwa_registrant;

    const ofw = data?.ofw;
    const relative_ofw = data?.relative_ofw;

    const total = data?.subscriber_count;
    const verified_percentage = (verified / total) * 100;
    const incomplete_percentage = (incomplete / total) * 100;
    const returned_percentage = (returned / total) * 100;
    const reject_percentage = (reject / total) * 100;

    const metro_manila = data?.metro_manila;
    
    const [filter, setFilter] = useState("Metro Manila");


    return <>
        <div className="p-[40px]">
            <DashboardTitle />

            <h3 className="text-2xl text-primary font-medium block mt-10">Validation Type</h3>
            <div className="flex flex-row gap-10 mt-10">

                <div className="w-4/12 relative size-60">
                    <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" stroke-width="1.5" stroke-dasharray={`${verified_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                    </svg>

                    <div className="absolute top-1/2 inset-s-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-2xl text-primary block">{verified_percentage?.toFixed(2)}%</span>
                        <span className="text-2xl text-primary font-bold block">Verified</span>
                        <span className="text-primary block">{verified?.toLocaleString()}</span>
                    </div>
                </div>

                <div className="w-4/12 relative size-60">
                    <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" stroke-width="1.5" stroke-dasharray={`${incomplete_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                    </svg>

                    <div className="absolute top-1/2 inset-s-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-2xl text-primary block">{incomplete_percentage?.toFixed(2)}%</span>
                        <span className="text-2xl text-primary font-bold block">Incomplete</span>
                        <span className="text-primary block">{incomplete?.toLocaleString()}</span>
                    </div>
                </div>

                <div className="w-4/12 relative size-60">
                    <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" stroke-width="1.5" stroke-dasharray={`${returned_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                    </svg>

                    <div className="absolute top-1/2 inset-s-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-2xl text-primary block">{returned_percentage?.toFixed(2)}%</span>
                        <span className="text-2xl text-primary font-bold block">Returned</span>
                        <span className="text-primary block">{returned?.toLocaleString()}</span>
                    </div>
                </div>

                <div className="w-4/12 relative size-60">
                    <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                        
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" stroke-width="1.5" stroke-dasharray={`${reject_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                    </svg>

                    <div className="absolute top-1/2 inset-s-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                        <span className="text-2xl text-primary block">{reject_percentage?.toFixed(2)}%</span>
                        <span className="text-2xl text-primary font-bold block">Rejected</span>
                        <span className="text-primary block">{reject?.toLocaleString()}</span>
                    </div>
                </div>

            </div>

            <div className="grid grid-cols-6 gap-4 mt-10">
                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{total?.toLocaleString()}</h2>
                    <h4 className="text-white font-medium block">Total Registered</h4>
                </div>

                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{attendance?.toLocaleString()}</h2>
                    <h4 className="text-white font-medium block">Total Attendance</h4>
                </div>

                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-lg text-white font-medium block">Yes - {attendee_yes?.toLocaleString()}</h2>
                    <h2 className="text-lg text-white font-medium block">No - {attendee_no?.toLocaleString()}</h2>
                    <h4 className="text-white font-medium block">Total Attendee</h4>
                </div>

                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{onsite_attendee?.toLocaleString()}</h2>
                    <h5 className="text-base text-white font-medium block">Total Onsite Attendee</h5>
                </div>

                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{online_attendee?.toLocaleString()}</h2>
                    <h5 className="text-base text-white font-medium block">Total Online Attendee</h5>
                </div>

                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{companion?.toLocaleString()}</h2>
                    <h5 className="text-white font-medium block">Total Companion</h5>
                </div>
                
            </div>

            <h3 className="text-2xl text-primary font-medium block mt-10">Registrant Type</h3>
            <div className="grid grid-cols-5 gap-4 mt-10">
                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{online_registrant?.toLocaleString()}</h2>
                    <h5 className="text-white font-medium block">Online Registrant</h5>
                </div>
                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{onsite_registrant?.toLocaleString()}</h2>
                    <h5 className="text-white font-medium block">Onsite Registrant</h5>
                </div>
                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{mall_registrant?.toLocaleString()}</h2>
                    <h5 className="text-white font-medium block">Mall Registrant</h5>
                </div>
                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{networker_registrant?.toLocaleString()}</h2>
                    <h5 className="text-white font-medium block">Networker</h5>
                </div>
                <div className="p-8 bg-[#ff902b] rounded">
                    <h2 className="text-4xl text-white font-medium block">{owwa_registrant?.toLocaleString()}</h2>
                    <h5 className="text-white font-medium block">OWWA Member</h5>
                </div>
            </div>

            <h3 className="text-2xl text-primary font-medium block mt-10">OFW Type</h3>
                
                {ofw && relative_ofw ? (
                <OFWtypeChart ofw={ofw} relativeOfw={relative_ofw} />
                ) : (

                <div class="animate-pulse w-96 h-96 block !bg-[#e3e3e3] rounded-full m-auto"></div>
                )}

            <h3 className="text-2xl text-primary font-medium block mt-10">Location</h3>
            {/* <h4 className="text-lg text-primary font-medium block mb-5">Metro Manila: {metro_manila?.toLocaleString()}</h4> */}

            <div className="flex justify-center gap-4 mb-5">
                
                {["Country", "Region", "Province", "City"].map((item) => (
                    <button
                    key={item}
                    onClick={() => setFilter(item)} style={{ pointerEvents: "auto" }}
                    className={`text-white font-medium py-2 px-4 rounded pointer-events-auto 
                        ${filter === item 
                        ? "!bg-blue-600"   // ✅ active
                        : "!bg-[#ff902b]"} // ✅ default
                    `}
                    >
                    {item}
                    </button>
                ))}

                <button
                    onClick={() => setFilter("Metro Manila")} style={{ pointerEvents: "auto" }}
                    className={`text-white font-medium py-2 px-4 rounded pointer-events-auto
                    ${filter === "Metro Manila"
                        ? "!bg-blue-600"
                        : "!bg-[#ff902b]"}
                    `}
                >
                    Metro Manila: {metro_manila?.toLocaleString()}
                </button>

            </div>
            <LocationChart filter={filter}/>
        </div>
    </>
}

export default Dashboard;