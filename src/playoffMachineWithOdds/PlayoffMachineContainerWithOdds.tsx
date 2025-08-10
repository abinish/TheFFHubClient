import * as React from 'react';
import { IDivision, ILeagueDetails, IMatchupItem, ITeam } from '../models';
import { LeagueDataContext } from '../Contexts/LeagueDataContexts';
import { useSearchParams } from 'react-router-dom';
import { getLeagueDetails } from '../leagueApi';
import update from 'immutability-helper'
import { PlayoffMachineContext } from '../Contexts/PlayoffMachineContexts';
import PlayoffMachineDivision from '../playoffMachine/PlayoffMachineDivision';
import PlayoffMachineMatchupWeek from '../playoffMachine/PlayoffMachineMatchupWeek';
import { Button, Tab, Tabs } from 'react-bootstrap';
import { orderStandings } from '../shared/orderStandingsHelper';
import { Loading } from '../shared/loading';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { deepCopy } from '../shared/helpers';
import PlayoffOddsTable from '../playoffOdds/PlayoffOddsTable';
import { IPlayoffOddsTeam } from '../playoffOdds/models';
import { getPlayoffOddsTeams } from '../playoffOdds/PlayoffOddsHelper';

export function PlayoffMachineContainerWithOdds() { 
	//const history = useHistory();
	// const listUrl = React.useMemo(() => pathname.substring(0, pathname.lastIndexOf('/')), [pathname]);
	// const initAreaId = React.useMemo(() => {
	// 	const query = queryString.parse(search);
	// 	const optionalAreaId = Number(query?.a);
	// 	return isNaN(optionalAreaId) ? null : optionalAreaId;
	// }, [search]);
    const leagues = React.useContext(LeagueDataContext);
    const leaguesMetadata = React.useContext(LeagueContext);
	const [playoffOddsTeams, setPlayoffOddsTeams] = React.useState<IPlayoffOddsTeam[]>();
    const [leagueData, setLeagueData] = React.useState<ILeagueDetails>();
    const [tabValue, setTabValue] = React.useState(0);
    const [searchParams] = useSearchParams();
    const loading = leagueData === undefined;

	const getLeagueDetailsParam = () => {
		var matchedLeague = leaguesMetadata.leagues.find((l) => l.leagueId === searchParams.get('leagueId') && l.site === searchParams.get('site'));
		if(matchedLeague){
			return {
				site: matchedLeague.site,
				leagueId: matchedLeague.leagueId,
				userId: matchedLeague.userId,
				swid: matchedLeague.swid,
				s2: matchedLeague.s2,
				isPrivateLeague: matchedLeague.isPrivateLeague,
				privateLeagueData: matchedLeague.privateLeagueData
			};
		}else{
			return {
				site:  searchParams.get('site') || "",
				leagueId: searchParams.get('leagueId') || "",
				userId: searchParams.get('userId') || "",
				swid: searchParams.get('swid') || "",
				s2: searchParams.get('s2') || "",
				isPrivateLeague: false,
				privateLeagueData: ''
			};
		}
	}

	const hasEnoughData = () => {

		if((leagueData?.completedSchedule.length ?? 0) >= 4){
			return true;
		}
		return false;
	}

	const updateLeagueData =  (league: ILeagueDetails) => {
		const leagueToUse = deepCopy(league);
		setLeagueData(leagueToUse);
		orderStandings(leagueToUse);
		var playoffOddsTeamsTemp = getPlayoffOddsTeams(leagueToUse, 10000);
		if(playoffOddsTeamsTemp)
			setPlayoffOddsTeams(playoffOddsTeamsTemp);
	}

	React.useEffect(() => {
		const fetchData = async () => {
			
			const league = await getLeagueDetails(getLeagueDetailsParam());
            var index = leagues.leagueData.findIndex((l) => l.leagueId === searchParams.get('leagueId') && l.site === searchParams.get('site'));
            if(index === -1){
                var updatedLeagues = [...leagues.leagueData, league]
                leagues.setLeagueData(updatedLeagues);
            }else{
                const updatedLeagues = update(leagues.leagueData, {$splice: [[index, 1, league]]});
                leagues.setLeagueData(updatedLeagues);
            }
            
            //Deep copy league
            var clonedLeague= JSON.parse(JSON.stringify(league));

            updateLeagueData(clonedLeague);
        }
        fetchData();
    }, []);

	const setMatchupsByWinningPercentage = () => {
		leagueData?.remainingSchedule.forEach(w => {
			w.matchups.forEach(m => {
				
				var awayTeam = leagueData?.teams.find((team) => team.teamName === m.awayTeamName)!;
				var homeTeam = leagueData?.teams.find((team) => team.teamName === m.homeTeamName)!;
				if((awayTeam.wins + (0.5*awayTeam.ties)) > (homeTeam.wins + (0.5*homeTeam.ties))){
					handleMatchup(m, true, false, false)
				}
				else if((homeTeam.wins + (0.5*homeTeam.ties)) > (awayTeam.wins + (0.5*awayTeam.ties))){
					handleMatchup(m, false, false, true)
				}
				else{
					handleMatchup(m, false, true, false)
				}
			});
		});
	};

	const setMatchupsByPointsFor = () => {
		leagueData?.remainingSchedule.forEach(w => {
			w.matchups.forEach(m => {
				
				var awayTeam = leagueData?.teams.find((team) => team.teamName === m.awayTeamName)!;
				var homeTeam = leagueData?.teams.find((team) => team.teamName === m.homeTeamName)!;
				if(awayTeam.pointsFor > homeTeam.pointsFor){
					handleMatchup(m, true, false, false)
				}
				else if(homeTeam.pointsFor > awayTeam.pointsFor){
					handleMatchup(m, false, false, true)
				}
				else{
					handleMatchup(m, false, true, false)
				}
			});
		});
	};

	const setMatchupsToAway = () => {
		leagueData?.remainingSchedule.forEach(w => {
			w.matchups.forEach(m => {
				handleMatchup(m, true, false, false)
			});
		});
	};

	const setMatchupsToHome = () => {
		leagueData?.remainingSchedule.forEach(w => {
			w.matchups.forEach(m => {
				handleMatchup(m, false, false, true)
			});
		});
	};

	const clearAllMatchupSelections = () => {
		leagueData?.remainingSchedule.forEach(w => {
			w.matchups.forEach(m => {
				handleMatchup(m, false, false, false)
			});
		});
	};



    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    }
	if (loading) {
	    return <Loading />;
	} //else if (hasError) { 
	 //   return <ErrorView />;
	//}


	const  handleMatchup = (matchup: IMatchupItem, awayTeamWon: boolean, tie: boolean, homeTeamWon: boolean) => {
        if((matchup.awayTeamWon && awayTeamWon) || (matchup.tie && tie) || (matchup.homeTeamWon && homeTeamWon))
            return;

        var isDivisionalGame = leagueData?.leagueSettings.divisions.some((division) => {
            return division.teams.some((team) => team.teamName === matchup.awayTeamName)
            &&
            division.teams.some((team) => team.teamName === matchup.homeTeamName)
        });

        var homeTeam = leagueData?.teams.find((team) => team.teamName === matchup.homeTeamName)!;
        var awayTeam = leagueData?.teams.find((team) => team.teamName === matchup.awayTeamName)!;

        //Remove previous win/loss/tie from teams
        if(matchup.tie){
            homeTeam.ties--;
            awayTeam.ties--;
            if(isDivisionalGame){
                homeTeam.divisionTies--;
                awayTeam.divisionTies--;
            }
        }
        else if(matchup.awayTeamWon){
            awayTeam.wins--;
            homeTeam.losses--;
            if(isDivisionalGame){
                awayTeam.divisionWins--;
                homeTeam.divisionLosses--;
            }
        }
        else if(matchup.homeTeamWon){
            awayTeam.losses--;
            homeTeam.wins--;
            if(isDivisionalGame){
                awayTeam.divisionLosses--;
                homeTeam.divisionWins--;
            }
        }
        

        //Set matchup
        if(tie){
            homeTeam.ties++;
            awayTeam.ties++;
            if(isDivisionalGame){
                homeTeam.divisionTies++;
                awayTeam.divisionTies++
            }
        }
        else if(awayTeamWon){
            awayTeam.wins++;
            homeTeam.losses++;
            if(isDivisionalGame){
                awayTeam.divisionWins++;
                homeTeam.divisionLosses++;
            }
        }
        else if(homeTeamWon){
            awayTeam.losses++;
            homeTeam.wins++;
            if(isDivisionalGame){
                awayTeam.divisionLosses++;
                homeTeam.divisionWins++;
            }
        }
        matchup.awayTeamWon = awayTeamWon;
        matchup.tie = tie;
        matchup.homeTeamWon = homeTeamWon;
        if(leagueData){
            updateLeagueData(leagueData);
        }

    }

	const handlePointsChange = (team: ITeam, pointsFor: number) => {
        leagueData.teams.find((t) => t.teamName === team.teamName)!.pointsFor = pointsFor;
		updateLeagueData(leagueData);
    }

	const handleTiebreakerSettingChange = (site: string, tiebreaker: int) => {
		if(leagueData){
			leagueData.site = site;
			leagueData.leagueSettings.playoffTiebreakerID = tiebreaker
			updateLeagueData(leagueData);
		}
	}



	return <PlayoffMachineContext.Provider value={{leagueData, setLeagueData}}>
				{ hasEnoughData() && playoffOddsTeams&&
								<PlayoffOddsTable teams={playoffOddsTeams} playoffTeams={leagueData?.leagueSettings.playoffTeams || 0} />
							}
						
							
                <div style={{display:'flex'}}>
                    {leagueData?.leagueSettings.divisions.map((d,index) => <div key={index} style={{flex: 1, paddingRight:'1rem'}}><PlayoffMachineDivision key={d.name} division={d} teams={leagueData?.teams} playoffTeams={leagueData.leagueSettings.playoffTeams} remainingSchedule={leagueData?.remainingSchedule}/></div> )}
                </div>
				<div>
					Quick select winners (will override all selections):
					
					<Button style={{margin: '5px'}} variant="outline-dark" onClick={setMatchupsByWinningPercentage}>By Winning %</Button>
					<Button style={{margin: '5px'}} variant="outline-dark" onClick={setMatchupsByPointsFor}>By Points For</Button>
					<Button style={{margin: '5px'}} variant='outline-dark' onClick={() => setMatchupsToAway()}>All Away</Button>
					<Button style={{margin: '5px'}} variant="outline-dark" onClick={setMatchupsToHome}>All Home</Button>
					<Button style={{margin: '5px'}} variant="outline-dark" onClick={clearAllMatchupSelections}>Clear All Selections</Button>
				</div>
				<br/>
                <Tabs id="test" className="mb-3" fill>
                    {leagueData?.remainingSchedule.map((w, index) => <Tab key={index} eventKey={w.week} title={"Week " + w.week}  ><PlayoffMachineMatchupWeek week={w}/> </Tab>)}
                </Tabs>
				{/* <PlayoffMachineAdvancedOptions league={leagueData} handlePointsChange={handlePointsChange} /> */}
				<br/><br/><br/>
				<div>
					y: Clinched division
					<br/>
					x: Clinched playoffs
					<br/>
					e: Eliminated from playoffs
					<br/>
					Clinching criteria are purely on record.  Tiebreakers are not considered for clinching.  Clinching is purely based on mathematical clinching/elimination.  Future matchups are not considered.
				</div>
        </PlayoffMachineContext.Provider>;
}
