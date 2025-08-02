// hooks/useFetchData.js
import { useState, useEffect } from "react";
import axios from "axios";

function useFetchData(apiendpoint) {
    const [alldata, setAlldata] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!apiendpoint) return;

        const fetchAllData = async () => {
            setLoading(true);
            try {
                const res = await axios.get(apiendpoint);
                const data = res.data;
                setAlldata(data);
            } catch (error) {
                console.error("Error fetching blog data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, [apiendpoint]);

    return { alldata, loading };
}

export default useFetchData;
