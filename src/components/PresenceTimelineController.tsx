import { useEffect, useState } from "react";
import PresenceTimeline from "./PresenceTimeline";
import type { DataStatus, PresenceData } from "@src/model";
import { getPresence } from "@src/api/presence";

export default function PresenceTimelineController() {
    const [dataStatus, setDataStatus] = useState<DataStatus>("loading")
    const [data, setData] = useState<PresenceData | null>(null);

    useEffect(() => {
        getPresence()
        .then((jsonData) => {
            if(jsonData == null) {
                setDataStatus("empty");
            } else {
                console.log("jsonData: ", jsonData);
                setDataStatus("success");
                setData(jsonData);
            }
        }).catch((err) => {
            console.error(err);
            setDataStatus("empty");
        })
    }, [])

    return <PresenceTimeline dataStatus={dataStatus} data={data} />
};
