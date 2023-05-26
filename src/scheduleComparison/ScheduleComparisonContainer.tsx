import * as React from 'react';
import { ILeagueDetails } from '../models';
import { IScheduleComparisonTeam } from './models';
import ScheduleComparisonTable from './ScheduleComparisonTable';
import { getLeagueDetails } from '../leagueApi';
import { LeagueDataContext } from '../Contexts/LeagueDataContexts';
import update from 'immutability-helper'
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../shared/loading';
import { getScheduleComparisonTeams } from './ScheduleComparisonHelper';
import WeeklyRecordTable from './WeeklyRecordTable';


export function ScheduleComparisonContainer(){ 

	//const history = useHistory();
	// const listUrl = React.useMemo(() => pathname.substring(0, pathname.lastIndexOf('/')), [pathname]);
	// const initAreaId = React.useMemo(() => {
	// 	const query = queryString.parse(search);
	// 	const optionalAreaId = Number(query?.a);
	// 	return isNaN(optionalAreaId) ? null : optionalAreaId;
	// }, [search]);
	const [scheduleComparisonTeams, setScheduleComparisonTeams] = React.useState<IScheduleComparisonTeam[]>();
	const [leagueData, setLeagueData] = React.useState<ILeagueDetails>();


	const leagues = React.useContext(LeagueDataContext);

	const [searchParams] = useSearchParams();

	const loading = scheduleComparisonTeams === undefined;

	React.useEffect(() => {
		const fetchData = async () => {
			const league = await getLeagueDetails({
				site: searchParams.get('site') || "",
				leagueId: searchParams.get('leagueId') || "",
				userId: searchParams.get('userId') || "",
				swid: searchParams.get('swid') || "",
				s2: searchParams.get('s2') || ""
			});
			var index = leagues.leagueData.findIndex((l) => l.leagueId === searchParams.get('leagueId') && l.site === searchParams.get('site'));
			if(index === -1){
				var updatedLeagues = [...leagues.leagueData, league]
				leagues.setLeagueData(updatedLeagues);
			}else{
				const updatedLeagues = update(leagues.leagueData, {$splice: [[index, 1, league]]});
				leagues.setLeagueData(updatedLeagues);
			}
            setLeagueData(league);

			var teams = getScheduleComparisonTeams(league);
			if(teams)
                setScheduleComparisonTeams(teams);

		}
		fetchData();
	}, []);


	if (loading) {
	    return <Loading />;
	} //else if (hasError) { 
	 //   return <ErrorView />;
	//}
	return (
        <div>
            <h4>Schedule Comparisons</h4>

            <ScheduleComparisonTable teams={scheduleComparisonTeams} completedWeeks={leagueData?.completedSchedule ?? []} />

            <br/><br/>
            <h4>Weekly Record vs All Teams</h4>
            <WeeklyRecordTable teams={scheduleComparisonTeams} completedWeeks={leagueData?.completedSchedule ?? []}/>
        </div>
	);

}