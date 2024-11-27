import * as React from 'react';
import { IPlayoffOddsTeam } from './models'

export interface IPlayoffOddsRowProps {
    team: IPlayoffOddsTeam;
    playoffTeams: number;
}

export default function PlayoffOddsRow( {team, playoffTeams}: IPlayoffOddsRowProps) {

    const totalPlayoffPercentage = team.simulatedPlacements.slice(0, playoffTeams).reduce((a, b) => a + b, 0)

    const getStyle = (index: number) => {
        if(index + 1 <= playoffTeams)
            return {backgroundColor: '#dff0d8'}
        
        return {}
    }
    
    return (
        <tr>
            <td>{team.teamName}</td>
            {team.simulatedPlacements.map((placement, index) => <td key={index} style={getStyle(index)}>{+placement.toFixed(2)}</td>)}
            <td>{+totalPlayoffPercentage.toFixed(2)}</td>
		</tr>
    )
}