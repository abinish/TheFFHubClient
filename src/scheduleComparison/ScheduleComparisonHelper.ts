import { ILeagueDetails } from "../models";
import { IScheduleComparisonTeam, ITeamSchedule, IWeeklyScore } from "./models";

export const getTeam = (teamName: string, teams: ITeamSchedule[]) : ITeamSchedule => {
    return teams.find(team => team.teamName === teamName)!;
}

export const getScheduleComparisonTeams = (league: ILeagueDetails): IScheduleComparisonTeam[] | null => {
    if (league === null){
        return null;
    }

    var teams = league.teams.map(team => ({  ...team, weeklyResults: [], scheduleComparison: [] } as IScheduleComparisonTeam));
    var teamScheduleLookup: ITeamSchedule[] = teams.map(team => ({teamName: team.teamName, schedule: []}));
    var weeklyScores: IWeeklyScore[] = [];


    //Determine all play
    league.completedSchedule.forEach(week => {
        weeklyScores.push({week: week.week, scores: []});
        week.matchups.forEach(matchup => {
            weeklyScores[week.week-1].scores.push(matchup.awayTeamScore);
            weeklyScores[week.week-1].scores.push(matchup.homeTeamScore);

            var awayTeam = getTeam(matchup.awayTeamName, teamScheduleLookup);
            if(awayTeam)
                awayTeam.schedule.push({ opponentTeamName: matchup.homeTeamName, opponentScore: matchup.homeTeamScore, ownScore: matchup.awayTeamScore, week: week.week});

            var homeTeam = getTeam(matchup.homeTeamName, teamScheduleLookup);
            if(homeTeam)
                homeTeam.schedule.push({ opponentTeamName: matchup.awayTeamName, opponentScore: matchup.awayTeamScore, ownScore: matchup.homeTeamScore, week: week.week});
        });
    });

    teams.forEach(team => {
        //Calculate the weekly results
        weeklyScores.forEach(weeklyScore => {
            var teamScore = getTeam(team.teamName, teamScheduleLookup).schedule.find(schedule => schedule.week === weeklyScore.week)?.ownScore;
            if(teamScore === undefined){
                return;
            }
            var wins = weeklyScore.scores.filter(score => score < teamScore!).length;
            var ties = weeklyScore.scores.filter(score => score === teamScore!).length-1;
            var losses = weeklyScore.scores.filter(score => score > teamScore!).length;
            team.weeklyResults.push({wins: wins, ties: ties, losses: losses});
        });

        //Calculate the schedule comparison
        var currentTeamsSchedule = teamScheduleLookup.find(teamSchedule => teamSchedule.teamName === team.teamName)!;
        //Go through each other team's schedule
        teamScheduleLookup.forEach(teamSchedule => {
 

            var wins = 0;
            var ties = 0;
            var losses = 0;



            //Go through each of the other teams games and compare to ours
            teamSchedule.schedule.forEach(opponentGame => {
                var currentTeamScore = currentTeamsSchedule.schedule.find(ourGame => ourGame.week === opponentGame.week)?.ownScore;

                if(currentTeamScore === undefined){
                    return;
                }

                //If the opponent for the team we are comparing to is the team we are comparing, then keep the result as is.
                if(opponentGame.opponentTeamName === team.teamName){
                    if(currentTeamScore > opponentGame.ownScore){
                        wins++;
                    } else if(currentTeamScore === opponentGame.ownScore){
                        ties++;
                    } else {
                        losses++;
                    }
                    return;
                }else{
                    //Otherwise we need to compare the opponent's score to our score
                    if(currentTeamScore > opponentGame.opponentScore){
                        wins++;
                    } else if(currentTeamScore === opponentGame.opponentScore){
                        ties++;
                    } else {
                        losses++;
                    }
                }
            });

            team.scheduleComparison.push({teamName: teamSchedule.teamName, wins: wins, ties: ties, losses: losses});

        });
    });
    
    return teams;
}