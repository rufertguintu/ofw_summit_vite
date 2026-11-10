import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { Navigate } from "react-router-dom";
import DashboardTitle from "../components/DashboardTitle";
import { fetchApi } from "../store/api";
// import OFWtypeChart2025 from "../components/OFWtypeChart2025";
// import LocationChart from "../components/LocationChart";
import Loading from "../assets/loading-reg.gif";


const Dashboard2025 = () => {

    const navigate = useNavigate();

    const token = localStorage.getItem("token");

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    const [data, setData] = useState(0);
    useEffect(() => {
        fetchApi("/wp-json/custom/v1/records-2025")
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

    const registrants = data?.registrants;
    const attendees = data?.attendees;
    const verified = data?.verified;
    const verified_percentage = data?.percent_verified;
    const incomplete = data?.incomplete;
    const incomplete_percentage = data?.percent_incomplete;
    const returned = data?.returned;
    const returned_percentage = data?.percent_returned;
    const reject = data?.reject;
    const reject_percentage = data?.percent_reject;
    // const verified = data?.verified;
    // const incomplete = data?.incomplete;
    // const returned = data?.returned;
    // const reject = data?.reject;
    
    // const attendance = data?.attendance;
    // const attendee_yes = data?.attendee_yes;
    // const attendee_no = data?.attendee_no;
    // const onsite_attendee = data?.onsite_attendee;
    // const online_attendee = data?.online_attendee;
    // const companion = data?.companion;

    const online_registrant = data?.online;
    const onsite_registrant = data?.onsite;
    const mall_registrant = data?.mall;
    const networker_registrant = data?.networker;
    const owwa_registrant = data?.owwa;

    const ofw = data?.ofw;
    const relative_ofw = data?.relative_ofw;

    // const total = data?.subscriber_count;
    // const verified_percentage = (verified / total) * 100;
    // const incomplete_percentage = (incomplete / total) * 100;
    // const returned_percentage = (returned / total) * 100;
    // const reject_percentage = (reject / total) * 100;

    // const metro_manila = data?.metro_manila;
    
    // const [filter, setFilter] = useState("Metro Manila");
    // const [isLocationLoading, setIsLocationLoading] = useState(false);

    // const handleFilterChange = (nextFilter) => {
    //     if (nextFilter === filter || isLocationLoading) {
    //         return;
    //     }

    //     setIsLocationLoading(true);
    //     setFilter(nextFilter);
    // };


    return <>
        <div>
            
            <div className="admin-dashboard-layout">
                <div className="dashboard-heading">
                    <div className="dashboard-title">
                        <h2 className="text-3xl font-bold">Dashboard 2025</h2>
                    </div>
                    <div className="list-attendance list-attendance-2025">
                        <ul>
                            <li>
                                <h6>Registrants</h6>
                                <h3>{registrants?.toLocaleString()} Registrants</h3>
                            </li>
                            <li>
                                <h6>Attendance</h6>
                                <h3>{attendees?.toLocaleString()} Attendance</h3>
                            </li>
                            {/* <li>
                                <h6>Companions</h6>
                                <h3>0 Companion</h3>
                            </li> */}
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

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${verified_percentage} 100`} stroke-linecap="round"></circle>
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

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${incomplete_percentage} 100`} stroke-linecap="round"></circle>
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

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${returned_percentage} 100`} stroke-linecap="round"></circle>
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

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${reject_percentage} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{reject_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Rejected</h5>
                            <h6>Total Count: <strong>{reject?.toLocaleString()}</strong></h6>
                        </li>
                    </ul>
                </div>

                <div className="attendance-overview-section">
                    <h3>Registrant Type</h3>
                    <ul>
                        <li>
                            <h5>Online Registrant: <strong>{online_registrant?.toLocaleString()}</strong></h5>
                        </li>
                        <li>
                            <h5>Onsite Registrant: <strong>{onsite_registrant?.toLocaleString()}</strong></h5>
                        </li>
                        <li>
                            <h5>Mall Registrant: <strong>{mall_registrant?.toLocaleString()}</strong></h5>
                        </li>
                        <li>
                            <h5>Networker: <strong>{networker_registrant?.toLocaleString()}</strong></h5>
                        </li>
                        <li>
                            <h5>OWWA: <strong>{owwa_registrant?.toLocaleString()}</strong></h5>
                        </li>
                    </ul>
                </div>

                <div className="attendance-overview-section">
                    <h3>OFW Type</h3>
                    <ul>
                        <li>
                            <h5>OFW: <strong>{ofw?.toLocaleString()}</strong></h5>
                        </li>
                        <li>
                            <h5>Relative OFW: <strong>{relative_ofw?.toLocaleString()}</strong></h5>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </>
};

export default Dashboard2025;