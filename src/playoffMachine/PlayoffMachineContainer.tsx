import * as React from 'react';
import { ILeagueDetails, ILeagueMetadata } from '../models';
import { IPowerRankingTeam } from '../powerRankings/models';
import { LeagueDataContext } from '../Contexts/LeagueDataContexts';
import { useSearchParams } from 'react-router-dom';
import { getLeagueDetails } from '../leagueApi';
import update from 'immutability-helper'
import { PlayoffMachineContext } from '../Contexts/PlayoffMachineContexts';
import PlayoffMachineDivision from './PlayoffMachineDivision';
import PlayoffMachineMatchupWeek from './PlayoffMachineMatchupWeek';
import { Tab, Tabs } from 'react-bootstrap';
import { orderStandings } from '../shared/orderStandingsHelper';

export function PlayoffMachineContainer() { 
	//const history = useHistory();
	// const listUrl = React.useMemo(() => pathname.substring(0, pathname.lastIndexOf('/')), [pathname]);
	// const initAreaId = React.useMemo(() => {
	// 	const query = queryString.parse(search);
	// 	const optionalAreaId = Number(query?.a);
	// 	return isNaN(optionalAreaId) ? null : optionalAreaId;
	// }, [search]);
    const leagues = React.useContext(LeagueDataContext);
    const [leagueData, setLeagueData] = React.useState<ILeagueDetails>();
    const [tabValue, setTabValue] = React.useState(0);
    const [searchParams] = useSearchParams();

    React.useEffect(() => {
        const fetchData = async () => {
            const league = await getLeagueDetails({
                site: searchParams.get('site') || "",
                leagueId: searchParams.get('leagueId') || "",
                userId: searchParams.get('userId') || "",
                swid: searchParams.get('swid') || "",
                s2: searchParams.get('s2') || ""
            });
            var index = leagues.leagueData.findIndex((l) => l.leagueId == searchParams.get('leagueId') && l.site == searchParams.get('site'));
            if(index == -1){
                var updatedLeagues = [...leagues.leagueData, league]
                leagues.setLeagueData(updatedLeagues);
            }else{
                const updatedLeagues = update(leagues.leagueData, {$splice: [[index, 1, league]]});
                leagues.setLeagueData(updatedLeagues);
            }

            orderStandings(league);
            setLeagueData(league);

        }
        fetchData();
    }, []);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }
	// if (loading) {
	// 	return <LoadingView />;
	// } else if (hasError) { 
	// 	return <ErrorView />;
	// }



	return <PlayoffMachineContext.Provider value={{leagueData, setLeagueData}}>
            <div>
                {leagueData?.leagueSettings.divisions.map(d => <PlayoffMachineDivision key={d.name} division={d} /> )}

            </div>
            <Tabs id="test" className="mb-3" fill>
                {leagueData?.remainingSchedule.map((w, index) => <Tab key={w.week} eventKey={w.week} title={"Week " + w.week}  ><PlayoffMachineMatchupWeek week={w}/> </Tab>)}
            </Tabs>
        </PlayoffMachineContext.Provider>;
}