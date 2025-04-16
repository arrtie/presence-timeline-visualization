import { styled } from "styled-components";
import EmptyPresenceData from "./EmptyPresenceData";
import Loader from "./Loader";
import type { DataStatus, PresenceData } from "../model";

const Container = styled.section`
    width: 100%;
    height: 100%;    
    background: pink;
`
interface PresenceTimelineProps {
    dataStatus: DataStatus;
    data: null | PresenceData;
}
export default function PresenceTimeline({dataStatus, data}: PresenceTimelineProps) {
    
    return (
        <Container>
            {(()=> {
                if(dataStatus === "loading"){
                    return <Loader />
                }
                if(dataStatus === "empty"){
                    return <EmptyPresenceData />
                }
                if(data != null) {
                    return <code>
                        {JSON.stringify(data)}
                    </code>
                }
                return null;
            })()
        }
        </Container>
    )
};
