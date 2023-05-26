import * as React from 'react';
import { ITeam } from '../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { IScheduleComparisonTeam, IComparisonRecord } from './models';

export interface IWeeklyRecordRowProps {
    team: IScheduleComparisonTeam;
}

export default function WeeklyRecordRow( {team}: IWeeklyRecordRowProps) {


    const formatRecordFromWeeklyResult = (weeklyResult: IComparisonRecord) => {
        return formatRecord(weeklyResult.wins, weeklyResult.losses, weeklyResult.ties);
    }   

    const formatTotalRecord = (weeklyResults: IComparisonRecord[]) => {
        return formatRecord(weeklyResults.reduce((a, b) => a + b.wins, 0), weeklyResults.reduce((a, b) => a + b.losses, 0), weeklyResults.reduce((a, b) => a + b.ties, 0));
    }   

    const formatRecord = (wins: number, losses: number, ties: number) => {
        if(ties === 0) return wins + '-' + losses;
            
        return wins + '-' + losses + '-' + ties;
    }   

    return (
        <tr>
            <td>{team.teamName}</td>
            {team.weeklyResults.map((weeklyResult, index) => <td key={index} style={{textAlign: 'center'}} >{formatRecordFromWeeklyResult(weeklyResult)}</td>)}
            <td style={{textAlign: 'center'}}>{formatTotalRecord(team.weeklyResults)}</td>
		</tr>
    )
}