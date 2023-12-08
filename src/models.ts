export interface ILeagueDetails {
    leagueSettings: ILeagueSettings;
    remainingSchedule: IWeek[];
    completedSchedule: IWeek[];
    //totalSchedule: IWeek[];
    site: string;
    leagueId: string;
    teams: ITeam[];
}

export interface ILeagueSettings {
    leagueName: string;
    statusTypeId: number;
    regularSeasonWeeks: number;
    playoffTiebreakerID: PlayoffTiebreakerID;
    formatTypeId: number;
    tieRule: number;
    playoffTeams: number;
    divisions: IDivision[];
    playsLeagueMedian: boolean;
}

export interface IWeek {
    week: number;
    matchups: IMatchupItem[]
}

export interface IMatchupItem {
    awayTeamName: string;
    awayTeamScore: number;
    homeTeamName: string;
    homeTeamScore: number;
    awayTeamWon: boolean;
    homeTeamWon: boolean;
    tie: boolean;
    noWinnerSelected: boolean;
}

export interface IDivision {
    name: string;
    id: number;
    teams: ITeam[];
}

export interface ITeam {
    id: number;
    teamName: string;
    division: string;
    wins: number;
    losses: number;
    ties: number;
    winPercentage: number;
    divisionWins: number;
    divisionLosses: number;
    divisionTies: number;
    divisionWinPercentage: number;
    pointsFor: number;
    pointsAgainst: number;
    divisionRank: number;
    overallRank: number;
    tiebreakers: string[][];
}

export enum PlayoffTiebreakerID {
	HeadToHead               = 0,
	TotalPointsScored        = 1,
	IntraDivisionRecord      = 2,
	TotalPointsAgainst       = 3
}

export interface ILeagueMetadata {
    site: string;
    leagueId: string;
    name: string;
    userId: string;
    swid: string;
    s2: string;
    isPrivateLeague: boolean;
    privateLeagueData: string;
    privateLeagueDataValidUntil: Date;
}

export interface IPrivateLeagueData {
    
}

export enum Site {
    ESPN =    1,
    Yahoo =   2,
    Sleeper = 3,
    Fleaflicker = 4,
    NFL = 5
}

export interface IHeadToHeadStandingsTeam {
    team: ITeam;
    totalGames: number;
    winPercentage: number;
    wins: number;
    losses: number;
    ties: number
}