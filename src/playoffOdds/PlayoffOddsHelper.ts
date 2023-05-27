
import { ILeagueDetails } from "../models";
import { IPlayoffOddsTeam } from "./models";
import { deepCopy, mean, setMatchup, standardDeviation } from "../shared/helpers";
import { orderStandings } from "../shared/orderStandingsHelper";

export const getPlayoffOddsTeams = (league: ILeagueDetails, iterations: number): IPlayoffOddsTeam[] | null => {
    if (league == null){
        return null;
    }

	var playoffOddsTeams = league.teams.map(team => ({  ...team, simulatedPlacements: new Array(league.teams.length).fill(0), standardDeviation: 0, averageScore: 0 } as IPlayoffOddsTeam));

	//Initialize additional team data
	playoffOddsTeams.forEach(team => {
		var scores: number[] = [];
		league.completedSchedule.forEach(week => {
			week.matchups.forEach(matchup => {
				if (matchup.awayTeamName === team.teamName)
					scores.push(matchup.awayTeamScore);
				if (matchup.homeTeamName === team.teamName)
				scores.push(matchup.homeTeamScore);
			});
		});
		if (scores.length !== 0) {
			team.averageScore = mean(scores);
			team.standardDeviation = Math.round(standardDeviation(scores));
		}else{
			team.averageScore = 0;
			team.standardDeviation = 0;
		}

	});

	runPlayoffOddsCalculation(league, playoffOddsTeams, iterations);

    return playoffOddsTeams;
}

//Box-Muller transform random
const random = () => {
	let u = 0, v = 0;
	while (u === 0) u = Math.random(); //Converting [0,1) to (0,1)
	while (v === 0) v = Math.random();
	return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

const simluateRestOfSeason = (league: ILeagueDetails, playoffOddsTeams: IPlayoffOddsTeam[]) => {

	//Something is resetting all the ranks

	league.remainingSchedule.forEach(week => {
		week.matchups.forEach(matchup => {
			var homeTeam = playoffOddsTeams.find(team => team.teamName === matchup.homeTeamName)!;
			var awayTeam = playoffOddsTeams.find(team => team.teamName === matchup.awayTeamName)!;

			var homeTeamScore = homeTeam.averageScore + random() * homeTeam.standardDeviation;
			var awayTeamScore = awayTeam.averageScore + random() * awayTeam.standardDeviation;

			homeTeam.pointsFor += homeTeamScore;
			homeTeam.pointsAgainst += awayTeamScore;
			awayTeam.pointsFor += awayTeamScore;
			awayTeam.pointsAgainst += homeTeamScore;

			if (homeTeamScore > awayTeamScore) {
				setMatchup(matchup, false, false, true, league, playoffOddsTeams);
			} else if (awayTeamScore > homeTeamScore) {
				setMatchup(matchup, true, false, false, league, playoffOddsTeams);
			}else{ //Tie
				setMatchup(matchup, false, true, false, league, playoffOddsTeams)
			}
			orderStandings(league);
		});
	});
}

const runPlayoffOddsCalculation = (league: ILeagueDetails, teams: IPlayoffOddsTeam[], iterations: number) => {
	var leagueCopy = deepCopy(league);
	var leagueToUse = deepCopy(league);
	var teamsCopy = deepCopy(teams);
	var teamsToUse = deepCopy(teams);

	for (var i = 0; i < iterations; i++) {
		simluateRestOfSeason(leagueToUse, teamsToUse);

		//Based on results, updated the simulatedPlacements for each team with passed in teams object
		teams.forEach(team => {

			//Find the team in the league with the same teamName
			var matchedTeam = teamsToUse.find(t => t.teamName === team.teamName)!;
			team.simulatedPlacements[matchedTeam.overallRank - 1] += 1.0 / iterations * 100;
		});

		//Reset league and teams for next iteration
		leagueToUse = leagueCopy;
		teamsToUse = teamsCopy;
	}
}