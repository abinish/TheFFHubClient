import React from "react";
import { ILeagueMetadata } from "../models";

const LeagueContext = React.createContext({
    leagues: [] as ILeagueMetadata[],
    setLeagues: (state: ILeagueMetadata[]) => {}
});

export {LeagueContext};