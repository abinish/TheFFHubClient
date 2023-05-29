import React from "react";
import { ILeagueDetails } from "../models";

const LeagueDataContext = React.createContext({
    leagueData: [] as ILeagueDetails[],
    setLeagueData: (state: ILeagueDetails[]) => {}
});

export {LeagueDataContext};