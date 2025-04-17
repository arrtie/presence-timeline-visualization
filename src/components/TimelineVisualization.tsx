/** @format */

import { useMemo, useState } from "react";
import styled from "styled-components";
import { PresenceManager, ProfilePresenceInterval } from "./PresenceManager";

const VizContainer = styled.section`
  width: 100%;
  height: 100%;
  background: green;
`;

interface TimelineVisualizationProps {
  data: ProfilePresenceInterval[];
}

export default function TimelineVisualization({
  data,
}: TimelineVisualizationProps) {
    return (
      <VizContainer>
        <code>{JSON.stringify(data)}</code>;
      </VizContainer>
  );
}
