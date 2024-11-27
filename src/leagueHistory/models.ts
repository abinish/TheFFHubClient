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


export interface IManagerScoringStats {
    manager: string;
    allTime: IScoringStats;
    seasons: IScoringStats[];
    records: IManagerMatchups[];
}
export interface IScoringStats {
    season: string;
    scoresInLosses: number[];
    scoresInWins: number[];
    scoresAgaisntInLosses: number[];
    scoresAgaisntInWins: number[];
}

export interface IManagerMatchups {
    opposingManager: string;
    wins: number;
    losses: number;
    ties: number;
    opposingManagerScores: number[];
    managerScores: number[];
}