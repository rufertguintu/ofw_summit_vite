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
    const [filteredData, setFilteredData] = useState(null);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filteredTotal, setFilteredTotal] = useState(null);
    const [dateFilterError, setDateFilterError] = useState("");
    const [isDateLoading, setIsDateLoading] = useState(false);

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

    const verified = filteredData?.verified ?? data?.verified;
    const incomplete = filteredData?.incomplete ?? data?.incomplete;
    const returned = filteredData?.returned ?? data?.returned;
    const reject = filteredData?.reject ?? data?.reject;
    const validation = filteredData?.validation ?? data?.validation;
    
    const attendance = filteredData?.attendance ?? data?.attendance;
    const attendee_yes = filteredData?.attendee_yes ?? data?.attendee_yes;
    const attendee_no = filteredData?.attendee_no ?? data?.attendee_no;
    const onsite_attendee = filteredData?.onsite_attendee ?? data?.onsite_attendee;
    const online_attendee = filteredData?.online_attendee ?? data?.online_attendee;
    const companion = filteredData?.companion ?? data?.companion;

    const online_registrant = filteredData?.online_registrant ?? data?.online_registrant;
    const onsite_registrant = filteredData?.onsite_registrant ?? data?.onsite_registrant;
    const mall_registrant = filteredData?.mall_registrant ?? data?.mall_registrant;
    const networker_registrant = filteredData?.networker_registrant ?? data?.networker_registrant;
    const owwa_registrant = filteredData?.owwa_registrant ?? data?.owwa_registrant;

    const ofw = filteredData?.ofw ?? data?.ofw;
    const relative_ofw = filteredData?.relative_ofw ?? data?.relative_ofw;

    const total = data?.subscriber_count;
    const displayedTotal = filteredData?.total ?? total;
    const verified_percentage = (verified / displayedTotal) * 100;
    const incomplete_percentage = (incomplete / displayedTotal) * 100;
    const returned_percentage = (returned / displayedTotal) * 100;
    const reject_percentage = (reject / displayedTotal) * 100;
    const validation_percentage = (validation / displayedTotal) * 100;

    const metro_manila = filteredData?.metro_manila ?? data?.metro_manila;
   
    
    const [filter, setFilter] = useState("Metro Manila");
    const [isLocationLoading, setIsLocationLoading] = useState(false);

    const handleDateFilterApply = async () => {
        setDateFilterError("");

        if (startDate && endDate && startDate > endDate) {
            setDateFilterError("The start date must be before or equal to the end date.");
            return;
        }

        setIsDateLoading(true);

        try {
            const params = new URLSearchParams();

            if (startDate) {
                params.set("start_date", startDate);
            }

            if (endDate) {
                params.set("end_date", endDate);
            }

            const query = params.toString();
            const response = await fetchApi(
                `/wp-json/custom/v1/user-count${query ? `?${query}` : ""}`
            );

            if (!response.ok) {
                throw new Error("Unable to load the registration count.");
            }

            const result = await response.json();
            setFilteredData(result);
        } catch (error) {
            console.error("Unable to load filtered registration count:", error);
            setDateFilterError("Unable to load the registration count. Please try again.");
        } finally {
            setIsDateLoading(false);
        }
    };

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
                <div className="dashboard-filter-section">
                    <div className="dashboard-title">
                        <h3>Date Range Filter:</h3>
                    </div>
                    <div className="date-range-cont">
                        <input
                            type="date"
                            value={startDate}
                            onChange={(event) => setStartDate(event.target.value)}
                            aria-label="Registration start date"
                        />
                        <input
                            type="date"
                            value={endDate}
                            onChange={(event) => setEndDate(event.target.value)}
                            aria-label="Registration end date"
                        />
                        <button
                            type="button"
                            onClick={handleDateFilterApply}
                            disabled={isDateLoading}
                        >
                            {isDateLoading ? "Loading..." : "Apply"}
                        </button>
                        {dateFilterError && (
                            <p role="alert">{dateFilterError}</p>
                        )}
                    </div>
                </div>

                <div className="dashboard-heading">
                    <div className="dashboard-title">
                        <h1 className="text-3xl font-bold">Dashboard</h1>
                    </div>
                    <div className="list-attendance">
                        <ul>
                            <li>
                                <h6>Registrants</h6>
                                <h3>{displayedTotal?.toLocaleString()} Registrants</h3>
                            </li>
                            <li>
                                <h6>Attendance</h6>
                                <h3>{filteredData?.attendance?.toLocaleString() ?? attendance?.toLocaleString()} Attendance</h3>
                            </li>
                            <li>
                                <h6>Companions</h6>
                                <h3>{filteredData?.companion?.toLocaleString() ?? companion?.toLocaleString()} Companion</h3>
                            </li>
                        </ul>
                    </div>
                </div>
                
                <div className="dashboard-validation-type">
                    <h3>Validation Type</h3>
                    <ul>
                        <li>
                            <Link to="/status-filtered/verified">
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${verified_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{verified_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Verified</h5>
                            <h6>Total Count: <strong>{verified?.toLocaleString()}</strong></h6>
                            </Link>
                        </li>
                        <li>
                            <Link to="/status-filtered/validation">
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${validation_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{validation_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Validation</h5>
                            <h6>Total Count: <strong>{validation?.toLocaleString()}</strong></h6>
                            </Link>
                        </li>
                        <li>
                            <Link to="/status-filtered/incomplete">
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${incomplete_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{incomplete_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Incomplete</h5>
                            <h6>Total Count: <strong>{incomplete?.toLocaleString()}</strong></h6>
                            </Link>
                        </li>
                        <li>
                            <Link to="/status-filtered/returned">
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${returned_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{returned_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Returned</h5>
                            <h6>Total Count: <strong>{returned?.toLocaleString()}</strong></h6>
                            </Link>
                        </li>
                        <li>
                            <Link to="/status-filtered/rejected">
                            <div className="round-percentage">
                                <svg className="rotate-135 size-full" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                            
                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-based text-foreground/10" stroke-width="5.5" stroke-dasharray="100 100" stroke-linecap="round"></circle>

                                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current " stroke-width="5.5" stroke-dasharray={`${reject_percentage?.toFixed(2)} 100`} stroke-linecap="round"></circle>
                                </svg>
                            </div>
                            <h4><strong>{reject_percentage?.toFixed(2)}%</strong></h4>
                            <h5>Rejected</h5>
                            <h6>Total Count: <strong>{reject?.toLocaleString()}</strong></h6>
                            </Link>
                        </li>
                    </ul>
                </div>

                <div className="dashboard-validation-type">
                    <h3>Retrieved and New Registrants</h3>
                    <ul>
                        <li>
                            <Link to="/retrieved-filtered/">
                                <h5>Retrieved: <strong>{filteredData?.recover_acct ?? data?.recover_acct?.toLocaleString()}</strong></h5>
                            </Link>
                        </li>
                        <li>
                            <h5>New Registrants: <strong>{filteredData?.new_registrants ?? data?.new_registrants?.toLocaleString()}</strong></h5>
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
                    <h3>Attendee Overview</h3>
                    <ul>
                        <li>
                            <h5>Yes: <strong>{attendee_yes?.toLocaleString()}</strong></h5>
                        </li>
                        <li>
                            <h5>No: <strong>{attendee_no?.toLocaleString()}</strong></h5>
                        </li>
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
        </div>
    </>
}

export default Dashboard;