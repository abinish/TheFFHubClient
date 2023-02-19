import * as React from 'react';
import { Button } from 'react-bootstrap';
import { PlayoffMachineContext } from '../Contexts/PlayoffMachineContexts';
import { IMatchupItem } from '../models';
import { orderStandings } from '../shared/orderStandingsHelper';

export interface IPlayoffMachineRowProps {
    matchup: IMatchupItem;
}




export default function PlayoffMachineMatchupRow( {matchup}: IPlayoffMachineRowProps) {
    const leagueData = React.useContext(PlayoffMachineContext);

    
    
    const  handleMatchup = (matchup: IMatchupItem, awayTeamWon: boolean, tie: boolean, homeTeamWon: boolean) => {
        if(matchup.awayTeamWon && awayTeamWon || matchup.tie && tie || matchup.homeTeamWon && homeTeamWon)
            return;

        var isDivisionalGame = leagueData.leagueData?.leagueSettings.divisions.some((division) => {
            return division.teams.some((team) => team.teamName == matchup.awayTeamName)
            &&
            division.teams.some((team) => team.teamName == matchup.homeTeamName)
        });

        var homeTeam = leagueData.leagueData?.teams.find((team) => team.teamName === matchup.homeTeamName)!;
        var awayTeam = leagueData.leagueData?.teams.find((team) => team.teamName === matchup.awayTeamName)!;

        //Remove previous win/loss/tie from teams
        if(matchup.tie){
            homeTeam.ties--;
            awayTeam.ties--;
            if(isDivisionalGame){
                homeTeam.divisionTies--;
                awayTeam.divisionTies--;
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
        if(leagueData.leagueData){
            orderStandings(leagueData.leagueData);
            leagueData.setLeagueData(leagueData.leagueData);
        }

    }

    const getHomeTeamColor = (matchup: IMatchupItem) => {
        if (matchup.awayTeamWon)
            return "error";
        if (matchup.homeTeamWon)
            return "success";
    
        return "outline-dark";
    }
    
    const getAwayTeamColor = (matchup: IMatchupItem) => {
        if (matchup.awayTeamWon)
            return "success";
        if (matchup.homeTeamWon)
            return "error";
    
        return "outline-dark";
    }
    
    const getTieColor = (matchup: IMatchupItem) => {
        if (matchup.tie)
            return "warning";
    
        return "outline-dark";
    }

    return (
        <tr>
            <td><Button variant={getAwayTeamColor(matchup)} onClick={() => handleMatchup(matchup, true, false, false)}>{matchup.awayTeamName}</Button></td>
			<td><Button variant={getTieColor(matchup)} onClick={() => handleMatchup(matchup, false, true, false)}>Tie</Button></td>
			<td><Button variant={getHomeTeamColor(matchup)} onClick={() => handleMatchup(matchup, false, false, true)}>{matchup.homeTeamName}</Button></td>
		</tr>
    )
}