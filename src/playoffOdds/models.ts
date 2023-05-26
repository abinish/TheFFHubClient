import { ITeam } from "../models";

export interface IPlayoffOddsTeam extends ITeam {
    simulatedPlacements: number[];
}