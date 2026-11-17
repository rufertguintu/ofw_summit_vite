import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchApi } from "../store/api";

export default function AttendeeFiltered() {
    const { attendee } = useParams();
    const [data, setData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            const response = await fetchApi(`/attendee-filtered/${attendee}`);
            const result = await response.json();
            setData(result);
        };
        fetchData();
    }, [attendee]);

    return (
        <div className="p-[40px]">
            <h1>Attendee Overview Filtered: {attendee}</h1>
            <ul>
                {data.map((item) => (
                    <li key={item.id}>{item.name}</li>
                ))}
            </ul>
        </div>
    );
}