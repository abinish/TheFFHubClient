import * as React from 'react';
import { ITeam, IWeek } from '../models';
import PlayoffMachineMatchupRow from './PlayoffMachineMatchupRow';

export interface IPlayoffMachineMatchupWeekProps {
    week: IWeek;
}

export default function PlayoffMachineMatchupWeek( {week}: IPlayoffMachineMatchupWeekProps) {
    return (
        <table>
            <tbody>
                {week.matchups.map((m, i) => <PlayoffMachineMatchupRow key={i} matchup={m}/>)}
            </tbody>
		</table>
    );
}