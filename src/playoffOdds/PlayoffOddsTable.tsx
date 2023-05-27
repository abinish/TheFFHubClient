import * as React from 'react';
import { IPlayoffOddsTeam } from './models';
import PlayoffOddsRow from './PlayoffOddsRow';

export interface IPlayoffOddsTableProps {
	teams: IPlayoffOddsTeam[];
    playoffTeams: number;
}

export default function PlayoffOddsTable({
	teams,
    playoffTeams
}: IPlayoffOddsTableProps) {

    const getOrdinalNumber = (i: number) => {
        var j = i % 10,
            k = i % 100;
        if (j === 1 && k !== 11) {
            return i + "st";
        }
        if (j === 2 && k !== 12) {
            return i + "nd";
        }
        if (j === 3 && k !== 13) {
            return i + "rd";
        }
        return i + "th";
    }
    
    const getTotalOddsSortValue = (team: IPlayoffOddsTeam) => {
        var playoffOdds = 0;
        var positionalOdds = 0;

        for (var i = 0; i <= team.simulatedPlacements.length - 1; i++) {
            var currentPositionChances = team.simulatedPlacements[i];
            if (i <=  playoffTeams - 1)
                playoffOdds += currentPositionChances;

            positionalOdds += (currentPositionChances / (i + 1));
        }
        
        return (playoffOdds * 100) + positionalOdds;
    }


	return (
		<div>
            <table className="table">
                <thead>
                    <tr>
                        <th>Team Name</th>
                        {teams.map((placement, index) => <th key={index}>{getOrdinalNumber(index+1)}</th>)}
                        <th>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {teams?.sort((a,b) => getTotalOddsSortValue(a) < getTotalOddsSortValue(b)? 1 : -1).map(t => <PlayoffOddsRow key={t.teamName} team={t} playoffTeams={playoffTeams} />)}
                </tbody>
            </table>	
            *Note: These odds are calculated purely from the history of each team's scores this year. It does not take projections or byes into account. It uses that data to run 10,000 monte carlo simulations of each matchup given a team's average score and standard deviation.	
		</div>
	);
}
