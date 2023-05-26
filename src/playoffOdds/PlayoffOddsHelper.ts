import { ILeagueDetails } from "../models";
import { IPlayoffOddsTeam } from "./models";

export const getPlayoffOddsTeams = (league: ILeagueDetails): IPlayoffOddsTeam[] | null => {
    if (league == null){
        return null;
    }

    return null;
}