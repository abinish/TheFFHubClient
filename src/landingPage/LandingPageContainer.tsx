import * as React from 'react';
import { useNavigate, useLocation } from 'react-router';
//import * as queryString from 'query-string';
import { ILeagueMetadata } from '../models';
import LeagueList from './LeagueList';
import { getLeagues} from '../leagueApi';
import { LeagueContext } from '../Contexts/LeagueContexts';
import AddLeagueCard from './AddLeagueCard';

export function LandingPageContainer() {
	let location = useLocation();
	const history = useNavigate();


	const [leagues, setLeagues] = React.useState<ILeagueMetadata[]>([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const leagues = await getLeagues();
			setLeagues(leagues);
		}
		//fetchData();
		 const league: ILeagueMetadata = {
			site: "sleeper",
			leagueId: "784516758580166656",
			swid: "",
			s2: "",
			userId: "",
			name: "test"
		};
		setLeagues([league]);
	}, []);


	const addLeague = (site: string, leagueId: string, userId: string, swid: string, s2: string, name: string) => {
		const leagueToAdd: ILeagueMetadata = {	
			site: site,
			leagueId: leagueId,
			name: name,
			userId: userId,
			swid: swid,
			s2: s2
		};
		setLeagues([...leagues, leagueToAdd]);
	};

	const deleteLeague = (league: ILeagueMetadata) => {
		var updatedLeagues = leagues.filter(item => item.site !== league.site || item.leagueId !== league.leagueId);
		setLeagues(updatedLeagues);
	}

	// if (loading) {
	// 	return <LoadingView />;
	// } else if (hasError) {
	// 	return <ErrorView />;
	// }
	return (
		<LeagueContext.Provider value={{leagues, setLeagues}}>
			<LeagueList/>
			<AddLeagueCard/>
		</LeagueContext.Provider>
	);
}
