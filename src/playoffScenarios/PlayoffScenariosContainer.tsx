import * as React from 'react';
import { ILeagueDetails, IMatchupItem } from '../models';
import { getLeagueDetails } from '../leagueApi';
import { LeagueDataContext } from '../Contexts/LeagueDataContexts';
import update from 'immutability-helper'
import { useSearchParams } from 'react-router-dom';
import { Loading } from '../shared/loading';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { deepCopy, setMatchup } from '../shared/helpers';
import { orderStandings } from '../shared/orderStandingsHelper';
import { IPlayoffScenarioProgress } from './models';
import { Button } from 'react-bootstrap';

export function PlayoffScenariosContainer(){ 

	const [scenarios, setScenarios] = React.useState<ILeagueDetails[]>([]);
	const [leagueData, setLeagueData] = React.useState<ILeagueDetails>();
	const [scenarioCount, setScenarioCount] = React.useState<IPlayoffScenarioProgress>({ totalScenarios: 0, processedScenarios: 0});


	const leagues = React.useContext(LeagueDataContext);
	const leaguesMetadata = React.useContext(LeagueContext);

	const [searchParams] = useSearchParams();

	const loading = scenarios === undefined;

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
            setLeagueData(league);

			setScenarioCount({...scenarioCount, totalScenarios:  Math.pow(3, league.remainingSchedule.reduce((total, week) => total + week.matchups.length, 0))});

			


		}

		

		fetchData();
	}, []);

	const getScenarios = () => {
		if(!leagueData)
			return;

		var scenarios: ILeagueDetails[] = [];
		const addScenarioToVariable = (league: ILeagueDetails) => {
			scenarios.push(league);
		};

		//limit league.remainingweeks to 2
		//league.remainingSchedule = league.remainingSchedule.slice(0, 2);

		setOutcomesVarIterative(leagueData, addScenarioToVariable);

		setScenarios(scenarios);

	}

	const setOutcomesVarIterative = (initialLeague: ILeagueDetails, addScenarioToVariable: (league: ILeagueDetails) => void) => {
		let stack = [initialLeague];
	
		while (stack.length > 0) {
			let league = stack.pop()!;
	
			if (league.remainingSchedule.every(week => week.matchups.every(game => game.awayTeamWon || game.homeTeamWon || game.tie))) {
				orderStandings(league);
				addScenarioToVariable(league);
				
				setScenarioCount({...scenarioCount, processedScenarios:  scenarioCount.processedScenarios++});
				continue;
			}
	
			//get first matchup from the first week in remaining schedule that is not resolved
			
			for (let week of league.remainingSchedule) {

				var matchupToLookAt = week.matchups.find(x => !x.awayTeamWon && !x.homeTeamWon && !x.tie);

				if(!matchupToLookAt){
					continue;
				}
/* 					const newLeagueTie = deepCopy(league);
				const tieGame = newLeagueTie.remainingSchedule.find(matchingWeek => matchingWeek.week === week.week)!.matchups.find(matchup => matchup.awayTeamName === matchupToLookAt!.awayTeamName && matchup.homeTeamName === matchupToLookAt!.homeTeamName)!;
				setMatchup(tieGame, false, true, false, newLeagueTie, newLeagueTie.teams);
				stack.push(newLeagueTie); */

				const newLeagueHome = deepCopy(league);			
				const homeGame = newLeagueHome.remainingSchedule.find(matchingWeek => matchingWeek.week === week.week)!.matchups.find(matchup => matchup.awayTeamName === matchupToLookAt!.awayTeamName && matchup.homeTeamName === matchupToLookAt!.homeTeamName)!;
				setMatchup(homeGame, true, false, false, newLeagueHome, newLeagueHome.teams);
				stack.push(newLeagueHome);

				const newLeagueAway = deepCopy(league);
				const awayGame = newLeagueAway.remainingSchedule.find(matchingWeek => matchingWeek.week === week.week)!.matchups.find(matchup => matchup.awayTeamName === matchupToLookAt!.awayTeamName && matchup.homeTeamName === matchupToLookAt!.homeTeamName)!;
				setMatchup(awayGame, false, false, true, newLeagueAway, newLeagueAway.teams);
				stack.push(newLeagueAway);
				break;
					
				
			}
		}
	}

	const runScenarios = () => {
		getScenarios();
	}


	//function to see if there are 5 completed weeks or not on leagueData object
	


	if (loading) {
	    return <Loading />;
	} //else if (hasError) { 
	 //   return <ErrorView />;
	//}
	return (
		<>
			{scenarios.length}
			Total Possible Scenarios: {scenarioCount.totalScenarios.toLocaleString()}
			<br />
			Scenarios Processed: {scenarioCount.processedScenarios.toLocaleString()}
			<br />
			<Button onClick={() => runScenarios()}>Run all scenarios</Button>
		</>
	);

}