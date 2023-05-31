import * as React from 'react';
import { useNavigate, useLocation } from 'react-router';
//import * as queryString from 'query-string';
import { ILeagueMetadata } from '../models';
import LeagueList from './LeagueList';
import { getLeagues} from '../leagueApi';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { Container } from 'react-bootstrap';
import AddLeagueCard from './AddLeagueCard';
import { useCookies } from 'react-cookie';

export function LandingPageContainer() {
	let location = useLocation();
	const history = useNavigate();
	const [cookies, setCookie] = useCookies(['leagues']);
	const [leagues, setLeagues] = React.useState<ILeagueMetadata[]>([]);

	React.useEffect(() => {
		const fetchData = async () => {
			const leagues = await getLeagues(cookies);
			setLeagues(leagues);
		}
		fetchData();
		 const league: ILeagueMetadata = {
			site: "sleeper",
			leagueId: "784516758580166656",
			swid: "",
			s2: "",
			userId: "",
			name: "really really long name that we can't expstect to fit in the card"
		};
		//setLeagues([league, league]);
	}, []);
	

	// if (loading) {
	// 	return <LoadingView />;
	// } else if (hasError) {
	// 	return <ErrorView />;
	// }
	return (
		<LeagueContext.Provider value={{leagues, setLeagues}}>
				<LeagueList/>
		</LeagueContext.Provider>
	);
}
