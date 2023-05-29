import * as React from 'react';
import { IPowerRankingTeam } from './models';
import PowerRankingsTable from './PowerRankingsTable';
import { getPowerRankingTeams } from './PowerRankingsHelper';
import { getLeagueDetails } from '../leagueApi';
import { LeagueDataContext } from '../Contexts/LeagueDataContexts';
import update from 'immutability-helper'
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../shared/loading';


export function PowerRankingsContainer(){ 

	//const history = useHistory();
	// const listUrl = React.useMemo(() => pathname.substring(0, pathname.lastIndexOf('/')), [pathname]);
	// const initAreaId = React.useMemo(() => {
	// 	const query = queryString.parse(search);
	// 	const optionalAreaId = Number(query?.a);
	// 	return isNaN(optionalAreaId) ? null : optionalAreaId;
	// }, [search]);
	const [powerRankingTeams, setPowerRankingTeams] = React.useState<IPowerRankingTeam[]>();


	const leagues = React.useContext(LeagueDataContext);

	const [searchParams] = useSearchParams();

	const loading = powerRankingTeams === undefined;

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
			var teams = getPowerRankingTeams(league);
			if(teams)
				setPowerRankingTeams(teams);

		}
		fetchData();
	}, []);

	if (loading) {
	    return <Loading />;
	} //else if (hasError) { 
	 //   return <ErrorView />;
	//}
	return (
		<PowerRankingsTable Teams={powerRankingTeams} />
	);

}