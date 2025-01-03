import { ITeam } from "../models";

export interface IScheduleComparisonTeam extends ITeam {
    weeklyResults: IWeeklyRecord[];
    scheduleComparison: ITeamScheduleComparisonRecord[];
}

export interface IWeeklyRecord extends IComparisonRecord {
    week: number;
}

export interface IComparisonRecord {
    wins: number;
    losses: number;
    ties: number;
}

export interface ITeamScheduleComparisonRecord extends IComparisonRecord {
    teamName: string;
}

export interface IWeeklyScore {
    week: number;
    scores: number[];
}

export interface ITeamSchedule {
    teamName: string;
    schedule: ITeamScheduleGame[];
}

export interface ITeamScheduleGame {
    opponentTeamName: string;
    opponentScore: number;
    ownScore: number;
    week: number;
}