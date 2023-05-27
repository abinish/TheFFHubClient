import { IScheduleComparisonTeam } from './models';
import ScheduleComparisonRow from './ScheduleComparisonRow';
import { IWeek } from '../models';

export interface IScheduleComparisonTableProps {
	teams: IScheduleComparisonTeam[];
    completedWeeks: IWeek[];
}

export default function ScheduleComparisonTable({
	teams,
    completedWeeks
}: IScheduleComparisonTableProps) {
    
	return (
		<div>
            <table className="table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Vs Who's Schedule</th>
                    </tr>
                    <tr>
                        <th>Teams</th>
                        {teams.map(t => <th key={t.teamName}>{t.teamName}</th>)}
                    </tr>
                </thead>
                <tbody>
                    {teams.map(t => <ScheduleComparisonRow key={t.teamName} team={t} teams={teams}/>)}
                </tbody>
            </table>	
		</div>
	);
}
