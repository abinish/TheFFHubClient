import React from 'react';
/*import './oldCss/Site.css'
import './oldCss/bootstrap.css'
import './oldCss/FFHub.css'
*/
import { ILeagueDetails, ILeagueMetadata } from './models';
import { LandingPageContainer } from './landingPage/LandingPageContainer';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './shared/navBar';
import { LeagueDataContext } from './Contexts/LeagueDataContexts';
import { PowerRankingsContainer } from './powerRankings/PowerRankingsContainer';
import { PlayoffMachineContainer } from './playoffMachine/PlayoffMachineContainer';
import { Container } from 'react-bootstrap';
import { MaintenanceContainer } from './maintenance/MaintenanceContainer';
import { ScheduleComparisonContainer } from './scheduleComparison/ScheduleComparisonContainer';
import { PlayoffOddsContainer } from './playoffOdds/PlayoffOddsContainer';
import { YahooLeaguesContainer } from './yahooLeagues/YahooLeaguesContainer';
import { LeagueContext } from './Contexts/LeagueContexts';
import { getLeagues } from './leagueApi';
import { AboutContainer } from './about/AboutContainer';
import { PlayoffScenariosContainer } from './playoffScenarios/PlayoffScenariosContainer';
import LeagueHistoryScoringStats from './leagueHistory/LeagueHistoryScoringStats';
import { LeagueHistoryContainer } from './leagueHistory/LeagueHistoryContainer';
import { TradeHistoryContainer } from './tradeHistory/TradeHistoryContainer';
import { PlayoffTool } from './playoffTool/PlayoffTool';
import { GuillotineContainer } from './guillotine/GuillotineContainer';

function App() {

  const [leagueData, setLeagueData] = React.useState<ILeagueDetails[]>([]);
	const [leagues, setLeagues] = React.useState<ILeagueMetadata[]>([]);

  
  React.useEffect(() => {
		const fetchData = async () => {
			const leagues = await getLeagues();
			setLeagues(leagues);
		}
		fetchData();
		 const league: ILeagueMetadata = {
			site: "sleeper",
			leagueId: "784516758580166656",
			swid: "",
			s2: "",
			userId: "",
			name: "really really long name that we can't expstect to fit in the card",
			isPrivateLeague: false,
			privateLeagueData: '',
			privateLeagueDataValidUntil: new Date("1/1/2100")
		};
		//setLeagues([league, league]);
	}, []);

  return (
      <LeagueDataContext.Provider value={{leagueData, setLeagueData}}>
        
		  <LeagueContext.Provider value={{leagues, setLeagues}}>
        <BrowserRouter>
          <NavBar/>
          <Container fluid="true" style={{margin:'4rem', marginTop:'0rem'}}>
              <Routes>
                <Route path='/PlayoffMachine' element={<PlayoffMachineContainer/>} />
                <Route path='/PowerRankings' element={<PowerRankingsContainer/>} />
                <Route path='/ScheduleComparison' element={<ScheduleComparisonContainer/>} />
                <Route path='/PlayoffOdds' element={<PlayoffOddsContainer/>} />
                <Route path='/PlayoffScenarios' element={<PlayoffScenariosContainer/>} />
                <Route path='/LeagueHistory' element={<LeagueHistoryContainer/>} />
                <Route path='/YahooLeagues' element={<YahooLeaguesContainer/>} />
                <Route path='/About' element={<AboutContainer/>} />
                <Route path='/TradeHistory' element={<TradeHistoryContainer/>} />
                <Route path ='/PlayoffTool' element ={<PlayoffTool/>} />
                <Route path='/Guillotine' element={<GuillotineContainer/>} />
                <Route path='/' element={<LandingPageContainer/>} />
              </Routes>
          </Container>
        </BrowserRouter>
        </LeagueContext.Provider>
      </LeagueDataContext.Provider>
  );
}

export default App;
