import * as React from 'react';
import { IDivision, ITeam } from '../models';
import PlayoffMachineDivisionRow from './PlayoffMachineDivisionRow';

export interface IPlayoffMachineTableProps {
	division: IDivision | null;
}

export default function PlayoffMachineDivision({
	division
}: IPlayoffMachineTableProps) {
	return (
		<div>
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
                    {division?.teams?.sort((a,b) => a.overallRank < b.overallRank? 1 : -1).map(t => <PlayoffMachineDivisionRow key={t.teamName} team={t} />)}
                </tbody>
            </table>	
		</div>
	);
}
