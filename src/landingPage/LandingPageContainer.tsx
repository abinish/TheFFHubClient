import { useNavigate, useLocation } from 'react-router';
//import * as queryString from 'query-string';
import LeagueList from './LeagueList';
import RewriteAlert from './RewriteAlert';

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
			<RewriteAlert/>
			
			<LeagueList/>
		</>
	);
}
