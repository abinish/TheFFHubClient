import * as React from 'react';
import { ILeagueDetails } from '../models';
import { getLeagueDetails, getLeagueHistory } from '../leagueApi';
import { LeagueDataContext } from '../Contexts/LeagueDataContexts';
import update from 'immutability-helper'
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../shared/loading';
import { LeagueContext } from '../Contexts/LeagueContexts';
import LeagueHistoryScoringStats from './LeagueHistoryScoringStats';


export function LeagueHistoryContainer(){ 

	const [leagueHistoryData, setLeagueHistoryData] = React.useState<ILeagueDetails[]>();

	const leaguesMetadata = React.useContext(LeagueContext);

	const [searchParams] = useSearchParams();

	const loading = leagueHistoryData === undefined;

	const getLeagueDetailsParam = () => {
		var matchedLeague = leaguesMetadata.leagues.find((l) => l.leagueId === searchParams.get('leagueId') && l.site === searchParams.get('site'));
		if(matchedLeague){
			return {
				site: matchedLeague.site,
				leagueId: matchedLeague.leagueId,
				userId: matchedLeague.userId,
				swid: matchedLeague.swid,
				s2: matchedLeague.s2
			};
		}else{
			return {
				site:  searchParams.get('site') || "",
				leagueId: searchParams.get('leagueId') || "",
				userId: searchParams.get('userId') || "",
				swid: searchParams.get('swid') || "",
				s2: searchParams.get('s2') || ""
			};
		}
	}

	React.useEffect(() => {
		const fetchData = async () => {
			
			const leagueHistory = await getLeagueHistory(getLeagueDetailsParam());

			if(leagueHistory)
                setLeagueHistoryData(leagueHistory);

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
            
            <LeagueHistoryScoringStats leagues={leagueHistoryData}/>
            

            
        </div>
	);

}