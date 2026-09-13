import { useNavigate, useLocation } from 'react-router';
//import * as queryString from 'query-string';
import LeagueList from './LeagueList';
import YahooAlert from './YahooAlert';

export function LandingPageContainer() {
	let location = useLocation();
	const history = useNavigate();


	// if (loading) {
	// 	return <LoadingView />;
	// } else if (hasError) {
	// 	return <ErrorView />;
	// }
	return (
		<>
			<YahooAlert/>
			
			<LeagueList/>
		</>
	);
}
