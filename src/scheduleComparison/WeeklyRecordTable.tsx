import { IScheduleComparisonTeam } from './models';
import WeeklyRecordRow from './WeeklyRecordRow';
import { IWeek } from '../models';

export interface IWeeklyRecordTableProps {
	teams: IScheduleComparisonTeam[];
    completedWeeks: IWeek[];
}

export default function WeeklyRecordTable({
	teams,
    completedWeeks
}: IWeeklyRecordTableProps) {
    
    const getSortValue = (team: IScheduleComparisonTeam) => {
        return team.weeklyResults.reduce((a, b) => a + b.wins, 0)
    }


	return (
		<div>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Week</th>
                    </tr>
                    <tr>
                        <th>Team Name</th>
                        {completedWeeks.map((week, index) => <th key={index} style={{textAlign: 'center'}}>{(index+1)}</th>)}
                        <th style={{textAlign: 'center'}}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {teams?.sort((a,b) => getSortValue(a) < getSortValue(b)? 1 : -1).map(t => <WeeklyRecordRow key={t.teamName} team={t} totalWeeks={completedWeeks.length}/>)}
                </tbody>
            </table>	
		</div>
	);
}
