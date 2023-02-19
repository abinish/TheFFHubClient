import * as React from 'react';
import { ITeam } from '../models';

export interface IPlayoffMachineDivisionRowProps {
    team: ITeam;
}

export default function PlayoffMachineDivisionRow( {team}: IPlayoffMachineDivisionRowProps) {
    return (
        <tr>
            <td>{team.teamName}</td>
            <td>{team.wins}</td>
            <td>{team.losses}</td>
            <td>{team.ties}</td>
		</tr>
    )
}