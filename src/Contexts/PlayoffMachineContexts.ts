import React from "react";
import { ILeagueDetails } from "../models";

const PlayoffMachineContext = React.createContext({
    leagueData: {} as ILeagueDetails | undefined,
    setLeagueData: (state: ILeagueDetails) => {}
});

export {PlayoffMachineContext};