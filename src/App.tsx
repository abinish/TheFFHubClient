import React from 'react';
/*import './oldCss/Site.css'
import './oldCss/bootstrap.css'
import './oldCss/FFHub.css'
*/
import { ILeagueDetails, ILeagueSettings } from './models';
import { LandingPageContainer } from './landingPage/LandingPageContainer';
import { CookiesProvider } from 'react-cookie';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavBar from './shared/navBar';
import { LeagueDataContext } from './Contexts/LeagueDataContexts';
import { PowerRankingsContainer } from './powerRankings/PowerRankingsContainer';
import { PlayoffMachineContainer } from './playoffMachine/PlayoffMachineContainer';

function App() {

  const [leagueData, setLeagueData] = React.useState<ILeagueDetails[]>([]);

  return (
    <CookiesProvider>
      <LeagueDataContext.Provider value={{leagueData, setLeagueData}}>
        <BrowserRouter>
          <NavBar/>
            <Routes>
              <Route path='/PlayoffMachine' element={<PlayoffMachineContainer/>} />
              <Route path='/PowerRankings' element={<PowerRankingsContainer/>} />
              <Route path='/' element={<LandingPageContainer/>} />
            </Routes>
        </BrowserRouter>
      </LeagueDataContext.Provider>
    </CookiesProvider>
  );
}

export default App;
