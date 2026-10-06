import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import DashboardTitle from "../components/DashboardTitle";
import { fetchApi } from "../store/api";
import OFWtypeChart from "../components/OFWtypeChart";
import LocationChart from "../components/LocationChart";
import Loading from "../assets/loading-reg.gif";


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

    useEffect(() => {
        console.log("DATA:");
        console.table(data);
    }, [data]);
    
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
    const [isLocationLoading, setIsLocationLoading] = useState(false);

    const handleFilterChange = (nextFilter) => {
        if (nextFilter === filter || isLocationLoading) {
            return;
        }

        setIsLocationLoading(true);
        setFilter(nextFilter);
    };


    return <>
        <div>
            
            <div className="admin-dashboard-layout">
                <div className="dashboard-heading">
                    <div className="dashboard-title">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                    </div>
                    <div className="list-attendance">
                        <ul>
                            <li>
                                <h6>Registrants</h6>
                                <h3>{total?.toLocaleString()} Registrants</h3>
                            </li>
                            <li>
                                <h6>Attendance</h6>
                                <h3>{attendance?.toLocaleString()} Attendance</h3>
                            </li>
                            <li>
                                <h6>Companions</h6>
                                <h3>{companion?.toLocaleString()} Companion</h3>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="dashboard-validation-type">
                    <h3>Validation Type</h3>
                    <ul>
                        <li>
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${verified_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{verified_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Verified</h5>
                            <h6>Total Count: <strong>{verified?.toLocaleString()}</strong></h6>

                        </li>
                        <li>
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${incomplete_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{incomplete_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Incomplete</h5>
                            <h6>Total Count: <strong>{incomplete?.toLocaleString()}</strong></h6>
                        </li>
                        <li>
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${returned_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{returned_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Returned</h5>
                            <h6>Total Count: <strong>{returned?.toLocaleString()}</strong></h6>
                        </li>
                        <li>
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${reject_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{reject_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Rejected</h5>
                            <h6>Total Count: <strong>{reject?.toLocaleString()}</strong></h6>
                        </li>
                    </ul>
                </div>

                <div className="attendance-overview-section">
                    <ul>
                        <li></li>
                        <li></li>
                    </ul>
                </div>

                <div className="ofw-type-section">
                    <div className="ofw-type-piechart">
                        <h3>OFW Type</h3>
                        {ofw && relative_ofw ? (
                            <OFWtypeChart ofw={ofw} relativeOfw={relative_ofw} />
                            ) : (

                            <div class="animate-pulse w-96 h-96 block !bg-[#e3e3e3] rounded-full m-auto"></div>
                        )}
                    </div>

                    <div className="location-list">
                        <h3>Locations</h3>
                        <div className="location-filter">
                        
                            {["Country", "Region", "Province", "City"].map((item) => (
                                <button
                                key={item}
                                type="button"
                                onClick={() => handleFilterChange(item)}
                                disabled={isLocationLoading}
                                style={{ pointerEvents: "auto" }}
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
                                type="button"
                                onClick={() => handleFilterChange("Metro Manila")}
                                disabled={isLocationLoading}
                                style={{ pointerEvents: "auto" }}
                                className={`text-white font-medium py-2 px-4 rounded pointer-events-auto
                                ${filter === "Metro Manila"
                                    ? "!bg-blue-600"
                                    : "!bg-[#ff902b]"}
                                `}
                            >
                                Metro Manila: {metro_manila?.toLocaleString()}
                            </button>

                        </div>
                        {isLocationLoading ? (
                            <div className="flex justify-center py-8">
                                <img src={Loading} width="200px" style={{ margin: "auto" }} alt="Loading location data" />
                            </div>
                        ) : null}
                        <div style={{ display: isLocationLoading ? "none" : "block" }}>
                            <LocationChart filter={filter} onLoadingChange={setIsLocationLoading} />
                        </div>
                    </div>
                </div>
            </div>


            {/* <DashboardTitle />
            
            <div className="admin-divider border p-3 rounded-[10px]">
                <h4 className="text-1xl font-medium block mt-10">Validation Type</h4>
                <div className="flex flex-row flex-wrap mt-10">

                    <div className="sm:w-full md:w-6/12 lg:w-3/12 relative size-60">
                        <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="1.5" stroke-dasharray={`${verified_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                        </svg>

                        <div className="absolute top-1/2 inset-s-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <Link to="/status-filtered/verified">
                                <span className="text-2xl  block">{verified_percentage?.toFixed(2)}%</span>
                                <span className="text-2xl  font-bold block">Verified</span>
                                <span className=" block">{verified?.toLocaleString()}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="sm:w-full md:w-6/12 lg:w-3/12 relative size-60">
                        <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="1.5" stroke-dasharray={`${incomplete_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                        </svg>

                        <div className="absolute top-1/2 inset-s-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <Link to="/status-filtered/incomplete">
                                <span className="text-2xl  block">{incomplete_percentage?.toFixed(2)}%</span>
                                <span className="text-2xl  font-bold block">Incomplete</span>
                                <span className=" block">{incomplete?.toLocaleString()}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="sm:w-full md:w-6/12 lg:w-3/12 relative size-60">
                        <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="1.5" stroke-dasharray={`${returned_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                        </svg>

                        <div className="absolute top-1/2 inset-s-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <Link to="/status-filtered/returned">
                                <span className="text-2xl  block">{returned_percentage?.toFixed(2)}%</span>
                                <span className="text-2xl  font-bold block">Returned</span>
                                <span className=" block">{returned?.toLocaleString()}</span>
                            </Link>
                        </div>
                    </div>

                    <div className="sm:w-full md:w-6/12 lg:w-3/12 relative size-60">
                        <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="1.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                            <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="1.5" stroke-dasharray={`${reject_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                        </svg>

                        <div className="absolute top-1/2 inset-s-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
                            <Link to="/status-filtered/rejected">
                                <span className="text-2xl  block">{reject_percentage?.toFixed(2)}%</span>
                                <span className="text-2xl  font-bold block">Rejected</span>
                                <span className=" block">{reject?.toLocaleString()}</span>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
            
            <div className="admin-divider border p-10 mt-10 rounded-[10px]">
                <h4>Attendance Overview</h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6  gap-4 mt-10">
                    <div className="p-3 shrink bg-[#ff902b] rounded-[10px]">
                        <h3 className="text-4xl text-white font-medium block">{total?.toLocaleString()}</h3>
                        <h6 className="text-white font-medium block">Total Registered</h6>
                    </div>

                    <div className="p-3 shrink bg-[#ff902b] rounded-[10px]">
                        <h3 className="text-4xl text-white font-medium block">{attendance?.toLocaleString()}</h3>
                        <h6 className="text-white font-medium block">Total Attendance</h6>
                    </div>

                    <div className="p-3 shrink bg-[#ff902b] rounded-[10px]">
                        <h4 className="text-lg text-white font-medium block">Yes - {attendee_yes?.toLocaleString()}</h4>
                        <h4 className="text-lg text-white font-medium block">No - {attendee_no?.toLocaleString()}</h4>
                        <h6 className="text-white font-medium block">Total Attendee</h6>
                    </div>

                    <div className="p-3 shrink bg-[#ff902b] rounded-[10px]">
                        <h3 className="text-4xl text-white font-medium block">{onsite_attendee?.toLocaleString()}</h3>
                        <h6 className="text-base text-white font-medium block">Total Onsite Attendee</h6>
                    </div>

                    <div className="p-3 shrink bg-[#ff902b] rounded-[10px]">
                        <h3 className="text-4xl text-white font-medium block">{online_attendee?.toLocaleString()}</h3>
                        <h6 className="text-base text-white font-medium block">Total Online Attendee</h6>
                    </div>

                    <div className="p-3 shrink bg-[#ff902b] rounded-[10px]">
                        <h3 className="text-4xl text-white font-medium block">{companion?.toLocaleString()}</h3>
                        <h6 className="text-white font-medium block">Total Companion</h6>
                    </div>
                    
                </div>
            </div>

            <div className="admin-divider border p-10 mt-10 rounded-[10px]">
                <h4 className="text-2xl font-medium block">Registrant Type</h4>
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
            </div>

            <div className="admin-divider border p-10 mt-10 rounded-[10px]">
                <h4 className="text-2xl  font-medium block pt-10">OFW Type</h4>
                
                {ofw && relative_ofw ? (
                <OFWtypeChart ofw={ofw} relativeOfw={relative_ofw} />
                ) : (

                <div class="animate-pulse w-96 h-96 block !bg-[#e3e3e3] rounded-full m-auto"></div>
                )}
            </div>

            <div className="admin-divider border p-10 mt-10 rounded-[10px]">
                <h4 className="text-2xl  font-medium block mt-10">Location</h4>
                <div className="flex justify-center gap-4 mb-5">
                    
                    {["Country", "Region", "Province", "City"].map((item) => (
                        <button
                        key={item}
                        type="button"
                        onClick={() => handleFilterChange(item)}
                        disabled={isLocationLoading}
                        style={{ pointerEvents: "auto" }}
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
                        type="button"
                        onClick={() => handleFilterChange("Metro Manila")}
                        disabled={isLocationLoading}
                        style={{ pointerEvents: "auto" }}
                        className={`text-white font-medium py-2 px-4 rounded pointer-events-auto
                        ${filter === "Metro Manila"
                            ? "!bg-blue-600"
                            : "!bg-[#ff902b]"}
                        `}
                    >
                        Metro Manila: {metro_manila?.toLocaleString()}
                    </button>

                </div>
                {isLocationLoading ? (
                    <div className="flex justify-center py-8">
                        <img src={Loading} width="200px" style={{ margin: "auto" }} alt="Loading location data" />
                    </div>
                ) : null}
                <div style={{ display: isLocationLoading ? "none" : "block" }}>
                    <LocationChart filter={filter} onLoadingChange={setIsLocationLoading} />
                </div>
            </div> */}
        </div>
    </>
}

export default Dashboard;