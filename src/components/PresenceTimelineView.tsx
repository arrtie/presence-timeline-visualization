import { useEffect, useState } from "react";
import PresenceTimelineController from "./PresenceTimelineController";
import { getPresence } from "@src/api/presence";
import type { RawDataStatus, RawPresenceData } from "@src/model";

export default function PresenceTimelineView() {
    const [dataStatus, setDataStatus] = useState<RawDataStatus>("loading")
    const [data, setData] = useState<RawPresenceData | null>(null);

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

    return <>
    <PresenceTimelineController dataStatus={dataStatus} data={data} />
    </>
};
