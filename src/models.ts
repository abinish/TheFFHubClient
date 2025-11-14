export interface ILeagueDetails {
    leagueSettings: ILeagueSettings;
    remainingSchedule: IWeek[];
    completedSchedule: IWeek[];
    //totalSchedule: IWeek[];
    site: string;
    leagueId: string;
    teams: ITeam[];
    season: string;
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
    teamManager: string;
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

// Guillotine League Models
export interface IGuillotineLeague {
    leagueId: string;
    leagueSize: number;
    waiverBudget: number;
    teams: IGuillotineTeam[];
    settings: IGuillotineLeagueSettings;
    transactions: IGuillotineWeeklyTransactions[];
    chopEpochTimes: { [week: number]: number };
    choppedPlayersByWeek: { [week: number]: IGuillotineChoppedPlayer[] };
}

export interface IGuillotineTeam {
    rosterId: number;
    draftSpot: number;
    diedWeek?: number;
}

export interface IGuillotineLeagueSettings {
    isSixPtQBTouchdown: boolean;
    isPPR: boolean;
    isHalfPPR: boolean;
    isStandard: boolean;
    isTEPremium: boolean;
    isOddScoring: boolean;
    isSuperflexOrTwoQB: boolean;
    isAbnormalRosterSizes: boolean;
}

export interface IGuillotineWeeklyTransactions {
    weekNumber: number;
    transactions: IGuillotineTransaction[];
}

export interface IGuillotineTransaction {
    transactionId: string;
    playerId: string;
    playerName: string;
    position: string;
    bidAmount: number;
    bidPercentageOfBudget: number;
    wonBid: boolean;
}

export interface IGuillotineChoppedPlayer {
    playerId: string;
    playerName: string;
    position: string;
}

// New Guillotine API Models
export interface IPlayerBidSummary {
    playerId: string;
    playerName: string;
    position: string;
    
    // All bids statistics
    averageAllBids: number;
    highestAllBid: number;
    lowestAllBid: number;
    totalBids: number;
    
    // Won bids statistics
    averageWinningBid: number;
    highestWinningBid: number;
    lowestWinningBid: number;
    wonBidsCount: number;
    
    // Calculated fields
    winRate: number;
    averageBidsPerLeague: number;
    leagueCount: number;
    
    // Week-specific data for filtering
    weeklyData: { [week: number]: IPlayerWeeklyBidData };
}

export interface IPlayerWeeklyBidData {
    averageAllBids: number;
    highestAllBid: number;
    lowestAllBid: number;
    totalBids: number;
    averageWinningBid: number;
    highestWinningBid: number;
    lowestWinningBid: number;
    wonBidsCount: number;
    winRate: number;
}

export interface IBidAmountsMetadata {
    totalLeagues: number;
    totalPlayers: number;
    totalBids: number;
    lastUpdated: string;
}

export interface IBidAmountsResponse {
    playerBids: IPlayerBidSummary[];
    availableWeeks: number[];
    metadata: IBidAmountsMetadata;
}

export interface IChoppedPlayerSummary {
    playerId: string;
    playerName: string;
    position: string;
    
    // Season totals
    totalChops: number;
    leagueCount: number;
    weeksChopped: number[];
    
    // Week-specific breakdown
    chopsByWeek: { [week: number]: number };
    
    // Additional insights
    averageChopsPerLeague: number;
    mostChopsInSingleWeek: number;
    weekOfMostChops: number;
}

export interface IChoppedPlayersMetadata {
    totalLeagues: number;
    totalChoppedPlayers: number;
    totalChops: number;
    chopsByWeek: { [week: number]: number };
    lastUpdated: string;
}

export interface IChoppedPlayersResponse {
    choppedPlayers: IChoppedPlayerSummary[];
    availableWeeks: number[];
    positionBreakdown: { [position: string]: number };
    metadata: IChoppedPlayersMetadata;
}

export interface IDraftPositionByLeagueSize {
    draftPosition: number;
    totalTeams: number;
    
    // Dictionary: Week -> Count of teams that died in that week
    deathsByWeek: { [week: number]: number };
    
    // Basic survival stats
    shortestSurvival: number;
    longestSurvival: number;
    averageWeeksSurvived: number;
    medianWeeksSurvived: number;
    fullSeasonSurvivors: number;
}

export interface IDraftPositionMetadata {
    totalLeagues: number;
    totalTeams: number;
    leagueSizes: number[];
    lastUpdated: string;
}

export interface IDraftPositionResponse {
    leagueSizes: { [size: number]: IDraftPositionByLeagueSize[] };
    metadata: IDraftPositionMetadata;
}

export interface IGuillotineSummaryMetadata {
    totalLeagues: number;
    totalTeams: number;
    totalPlayers: number;
    totalBids: number;
    totalChoppedPlayers: number;
    totalChops: number;
    leagueSizes: number[];
    lastUpdated: string;
}

export interface IGuillotineSummaryResponse {
    bidAmounts: IBidAmountsResponse;
    choppedPlayers: IChoppedPlayersResponse;
    draftPositions: IDraftPositionResponse;
    metadata: IGuillotineSummaryMetadata;
}