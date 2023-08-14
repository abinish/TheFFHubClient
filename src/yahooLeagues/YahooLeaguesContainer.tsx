import * as React from 'react';
import { useLocation } from 'react-router';
import { ILeagueMetadata } from '../models';
import { getYahooLeagueMetadata, setYahooId} from '../leagueApi';
import { useSearchParams } from 'react-router-dom';
import '../landingPage/Cards.css'
import { Button } from 'react-bootstrap';
import YahooLeagueCard from './YahooLeagueCard';
import { Loading } from '../shared/loading';

export function YahooLeaguesContainer() {
	let location = useLocation();
	const [leagues, setLeagues] = React.useState<ILeagueMetadata[]>([]);
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = React.useState<boolean>(true);

	React.useEffect(() => {
		const fetchData = async (yahooId: string) => {
			const leagues = await getYahooLeagueMetadata(yahooId);
			setLeagues(leagues);
            setLoading(false);
		}

        //TODO: If we have a leagueId in the query string, add it to the cookie
        var yahooId = searchParams.get("userId");
        if(yahooId && yahooId.length > 0){
            setYahooId(yahooId);
		    fetchData(yahooId);
        }

	}, []);
	

    if (loading) {
	    return <Loading />;
	}
	return (
		<div>
            <h2>Yahoo leagues associated with your user:</h2>
            <br/>
			<div className='ffHubDiv'>
				{leagues.map(t => <YahooLeagueCard league={t} key={t.leagueId+t.site+t.name}/>)}
			</div>
			<div className='ffHubDiv' style={{paddingTop: '10px'}}>
				{/*Add a custom league option if we need <AddLeagueCard/> */}
			</div>
            <div>
                <Button variant="primary" href="/">I'm done adding Yahoo leagues</Button>
            </div>
		</div>
	);
}
