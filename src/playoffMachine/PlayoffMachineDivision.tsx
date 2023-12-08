import * as React from 'react';
import { IDivision, ITeam, IWeek } from '../models';
import PlayoffMachineDivisionRow from './PlayoffMachineDivisionRow';
import { get } from 'http';

export interface IPlayoffMachineTableProps {
    division: IDivision | null;
	teams: ITeam[] | null;
    playoffTeams: number;
    remainingSchedule: IWeek[]
}

export default function PlayoffMachineDivision({
    division,
	teams,
    playoffTeams,
    remainingSchedule
}: IPlayoffMachineTableProps) {

    const getIsPlayoffTeam = (team: ITeam, playoffTeams: number) => {
        if(team.overallRank <= playoffTeams)
            return true;

        return false;
    }
    
    function getTeamsFromDivision(division: IDivision | null): ITeam[] {
        //Get all teams from LeagueData.teams where they are in the division
        return teams?.filter(t => t.division === division?.name) || [];
    }

    const clinchedDivisionWin = (team: ITeam) => {
        var teamMaxVictoryPoints = team.wins + (0.5*team.ties);

        var teamsWithBetterRecord = getTeamsFromDivision(division).filter(t => (t.wins + (0.5*t.ties)  + getUndecidedRemainingGamesForTeam(t)) >= teamMaxVictoryPoints && t.teamName !== team.teamName);

        if((teamsWithBetterRecord?.length ?? 100) > 0)
            return false;

        return true;
    }

    const clinchedPlayoffSpot = (team: ITeam) => {
        var teamMaxVictoryPoints = team.wins + (0.5*team.ties);

        if(! teams)
            return false;


        var teamsWithBetterRecord = teams.filter(t => (t.wins + (0.5*t.ties)  + getUndecidedRemainingGamesForTeam(t))>= teamMaxVictoryPoints && t.teamName !== team.teamName);

        if(teamsWithBetterRecord.length < playoffTeams)
            return true;

       /*  if(teamsWithBetterRecord?.length === playoffTeams)
        {
            var teamsWithSameMaxPoints = teams?.filter(t => (t.wins + (0.5*t.ties)  + getUndecidedRemainingGamesForTeam(t)) === teamMaxVictoryPoints && t.teamName !== team.teamName);
            if(teamsWithSameMaxPoints.length > 1){
                //If more than 1 team could tie on record see if they play eachother
                teamsWithSameMaxPoints.forEach(t => {
                    remainingSchedule.forEach(week => {
                        week.matchups.forEach(matchup => {
                            if(matchup.awayTeamName === t.teamName && teamsWithSameMaxPoints.some(x => x.teamName === matchup.homeTeamName))
                                return true;
                            if(matchup.homeTeamName === t.teamName && teamsWithSameMaxPoints.some(x => x.teamName === matchup.awayTeamName))
                                return true;
                        })
                    })
                        
                });
            }
        } */

        return false;
    }

    const clinchedElimination = (team: ITeam) => {
        var teamMaxVictoryPoints = team.wins + (0.5*team.ties) + getUndecidedRemainingGamesForTeam(team);
        if(!teams)
            return false;

        var teamsWithBetterRecord = teams.filter(t => (t.wins + (0.5*t.ties)) > teamMaxVictoryPoints && t.teamName !== team.teamName);
        if(teamsWithBetterRecord.length >= playoffTeams)
            return true;

        return false;

    }

    const getUndecidedRemainingGamesForTeam = (team: ITeam) => {
        var remainingGames = 0;

        remainingSchedule.forEach(week => {
            week.matchups.forEach(matchup => {
                if(matchup.homeTeamName === team.teamName || matchup.awayTeamName === team.teamName){
                    if(!matchup.awayTeamWon && !matchup.homeTeamWon && !matchup.tie){
                        remainingGames++;
                    }
                }
            })
        });
        return remainingGames;
    }

	return (
		<div>
            <h4>{division?.name}</h4>
            <table className="table">
                <thead>
                    <tr>
                        <th>Team Name</th>
                        <th>Wins</th>
                        <th>Losses</th>
                        <th>Ties</th>
                    </tr>
                </thead>
                <tbody>
                    {getTeamsFromDivision(division)?.sort((a,b) => a.overallRank > b.overallRank? 1 : -1).map(t => <PlayoffMachineDivisionRow key={t.teamName} team={t} isPlayoffTeam={getIsPlayoffTeam(t, playoffTeams)} clinchedDivision={clinchedDivisionWin(t)} clinchedPlayoffs={clinchedPlayoffSpot(t)} clinchedElimination={clinchedElimination(t)} />)}
                </tbody>
            </table>	
		</div>
	);
}
