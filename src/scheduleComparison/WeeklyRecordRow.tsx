import { IScheduleComparisonTeam, IComparisonRecord } from './models';

export interface IWeeklyRecordRowProps {
    team: IScheduleComparisonTeam;
    totalWeeks: number;
}

export default function WeeklyRecordRow( {team, totalWeeks}: IWeeklyRecordRowProps) {


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
            {Array.from({ length: totalWeeks }, (_, index) => {
                const weeklyResult = team.weeklyResults.find(result => result.week === index + 1);
                return (
                    <td key={index} style={{ textAlign: 'center' }}>
                        {weeklyResult ? formatRecordFromWeeklyResult(weeklyResult) : '---'}
                    </td>
                );
            })}
            <td style={{textAlign: 'center'}}>{formatTotalRecord(team.weeklyResults)}</td>
		</tr>
    )
}