import { ILeagueDetails, IMatchupItem, ITeam } from "../models";

export function deepCopy<T>(a: T): T {
    return JSON.parse(JSON.stringify(a));
}

export function mean(values: number[]): number {
    return values.reduce((a, b) => a + b) / values.length;
}

export function standardDeviation(values: number[]): number {
    const avg = mean(values);
    const squareDiffs = values.map(value => {
        const diff = value - avg;
        return diff * diff;
    });
    const avgSquareDiff = mean(squareDiffs);
    return Math.sqrt(avgSquareDiff);
}

export const setMatchup = (matchup: IMatchupItem, awayTeamWon: boolean, tie: boolean, homeTeamWon: boolean, league: ILeagueDetails, teams: ITeam[]) => {
    if((matchup.awayTeamWon && awayTeamWon) || (matchup.tie && tie) || (matchup.homeTeamWon && homeTeamWon))
        return;

    var isDivisionalGame = league.leagueSettings.divisions.some(division => {
        //If the division contains both home and away then it is a divisional game
        return division.teams.some(team => team.teamName === matchup.awayTeamName)
            &&
            division.teams.some(team => team.teamName === matchup.homeTeamName)
    });

    var homeTeam = teams.find(team => team.teamName === matchup.homeTeamName)!;
    var awayTeam = teams.find(team => team.teamName === matchup.awayTeamName)!;


    //Remove previous win/loss/tie from teams
    if (matchup.tie) {
        //remove ties from both
        homeTeam.ties--;
        awayTeam.ties--;
        if (isDivisionalGame) {
            homeTeam.divisionTies--;
            awayTeam.divisionTies--;
        }

    } else if (matchup.awayTeamWon) {
        //remove away team win and remove home team loss
        awayTeam.wins--;
        homeTeam.losses--;

        if (isDivisionalGame) {
            awayTeam.divisionWins--;
            homeTeam.divisionLosses--;
        }

    } else if (matchup.homeTeamWon) {
        //remove home team win and remove away team loss
        awayTeam.losses--;
        homeTeam.wins--;

        if (isDivisionalGame) {
            awayTeam.divisionLosses--;
            homeTeam.divisionWins--;
        }
    }

    if (tie) {
        //add tie to both teams
        homeTeam.ties++;
        awayTeam.ties++;
        if (isDivisionalGame) {
            homeTeam.divisionTies++;
            awayTeam.divisionTies++;
        }

    } else if (awayTeamWon) {
        //add win to awawy team and loss to home team
        awayTeam.wins++;
        homeTeam.losses++;

        if (isDivisionalGame) {
            awayTeam.divisionWins++;
            homeTeam.divisionLosses++;
        }

    } else if (homeTeamWon) {
        //add win to home team and loss to away team
        awayTeam.losses++;
        homeTeam.wins++;

        if (isDivisionalGame) {
            awayTeam.divisionLosses++;
            homeTeam.divisionWins++;
        }
    }

    matchup.awayTeamWon = awayTeamWon;
    matchup.tie = tie;
    matchup.homeTeamWon = homeTeamWon;
}