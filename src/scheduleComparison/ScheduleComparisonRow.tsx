import { IScheduleComparisonTeam, IComparisonRecord } from './models';
import './ScheduleComparisonRow.css'

export interface IScheduleComparisonRowProps {
    team: IScheduleComparisonTeam;
    teams: IScheduleComparisonTeam[];
}

export default function ScheduleComparisonRow( {team, teams}: IScheduleComparisonRowProps) {
    
    const formatRecord = (weeklyResult: IComparisonRecord | undefined) => {
        if(!weeklyResult) return '-';
        if(weeklyResult.ties === 0) return weeklyResult.wins + '-' + weeklyResult.losses;
            
        return weeklyResult.wins + '-' + weeklyResult.losses + '-' + weeklyResult.ties;
    }   
    const getStyle = (teamName: string, comparingToTeamName: string) => {
        if(teamName === comparingToTeamName)
            return "ownTeamRecord"
        
        return "otherTeamRecord";
    }

    const getMatchingMatchupRecord = (team: IScheduleComparisonTeam, teamToGetFromMatchup: string) => {
        return team?.scheduleComparison?.find(x => x.teamName === teamToGetFromMatchup);
    }

    return (
        <tr>
            <td>{team.teamName}</td>
            {teams.map((t, index) => <td key={index} className={getStyle(team.teamName, t.teamName)} >{formatRecord(getMatchingMatchupRecord(team, t.teamName))}</td>)}
		</tr>
    )
}