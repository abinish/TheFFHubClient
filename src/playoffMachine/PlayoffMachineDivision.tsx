import * as React from 'react';
import { IDivision, ITeam } from '../models';
import PlayoffMachineDivisionRow from './PlayoffMachineDivisionRow';

export interface IPlayoffMachineTableProps {
    division: IDivision | null;
	teams: ITeam[] | null;
    playoffTeams: number;
}

export default function PlayoffMachineDivision({
    division,
	teams,
    playoffTeams
}: IPlayoffMachineTableProps) {

    const getIsPlayoffTeam = (team: ITeam, playoffTeams: number) => {
        if(team.overallRank <= playoffTeams)
            return true;

        return false;
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
                    {teams?.sort((a,b) => a.overallRank > b.overallRank? 1 : -1).map(t => <PlayoffMachineDivisionRow key={t.teamName} team={t} isPlayoffTeam={getIsPlayoffTeam(t, playoffTeams)} />)}
                </tbody>
            </table>	
		</div>
	);
}
