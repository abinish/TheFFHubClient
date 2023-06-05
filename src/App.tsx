import React from 'react';
/*import './oldCss/Site.css'
import './oldCss/bootstrap.css'
import './oldCss/FFHub.css'
*/
import { ILeagueDetails } from './models';
import { LandingPageContainer } from './landingPage/LandingPageContainer';
import { CookiesProvider } from 'react-cookie';
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

function App() {

  const [leagueData, setLeagueData] = React.useState<ILeagueDetails[]>([]);

  return (
    <CookiesProvider>
      <LeagueDataContext.Provider value={{leagueData, setLeagueData}}>
        <BrowserRouter>
          <NavBar/>
          <Container fluid="true" style={{margin:'4rem', marginTop:'0rem'}}>
              <Routes>
                <Route path='/PlayoffMachine' element={<PlayoffMachineContainer/>} />
                <Route path='/PowerRankings' element={<PowerRankingsContainer/>} />
                <Route path='/ScheduleComparison' element={<ScheduleComparisonContainer/>} />
                <Route path='/PlayoffOdds' element={<PlayoffOddsContainer/>} />
                <Route path='/YahooLeagues' element={<YahooLeaguesContainer/>} />
                <Route path='/' element={<LandingPageContainer/>} />
              </Routes>
          </Container>
        </BrowserRouter>
      </LeagueDataContext.Provider>
    </CookiesProvider>
  );
}

export default App;
