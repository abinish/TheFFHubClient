import * as React from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { PlayoffMachineContext } from '../Contexts/PlayoffMachineContexts';
import { IMatchupItem } from '../models';
import { orderStandings } from '../shared/orderStandingsHelper';
import { deepCopy } from '../shared/helpers';

export interface IPlayoffMachineRowProps {
    matchup: IMatchupItem;
}




export default function PlayoffMachineMatchupRow( {matchup}: IPlayoffMachineRowProps) {
    const playoffMachineContext = React.useContext(PlayoffMachineContext);

    
    
    const  handleMatchup = (matchup: IMatchupItem, awayTeamWon: boolean, tie: boolean, homeTeamWon: boolean) => {
        if((matchup.awayTeamWon && awayTeamWon) || (matchup.tie && tie) || (matchup.homeTeamWon && homeTeamWon))
            return;

        var isDivisionalGame = playoffMachineContext.leagueData?.leagueSettings.divisions.some((division) => {
            return division.teams.some((team) => team.teamName === matchup.awayTeamName)
            &&
            division.teams.some((team) => team.teamName === matchup.homeTeamName)
        });

        var homeTeam = playoffMachineContext.leagueData?.teams.find((team) => team.teamName === matchup.homeTeamName)!;
        var awayTeam = playoffMachineContext.leagueData?.teams.find((team) => team.teamName === matchup.awayTeamName)!;

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
        if(playoffMachineContext.leagueData){
            orderStandings(playoffMachineContext.leagueData);            
            playoffMachineContext.setLeagueData(deepCopy(playoffMachineContext.leagueData));
        }

    }

    const getHomeTeamColor = (matchup: IMatchupItem) => {
        if (matchup.awayTeamWon)
            return "danger";
        if (matchup.homeTeamWon)
            return "success";
    
        return "outline-dark";
    }
    
    const getAwayTeamColor = (matchup: IMatchupItem) => {
        if (matchup.awayTeamWon)
            return "success";
        if (matchup.homeTeamWon)
            return "danger";
    
        return "outline-dark";
    }
    
    const getTieColor = (matchup: IMatchupItem) => {
        if (matchup.tie)
            return "warning";
    
        return "outline-dark";
    }

    return (
        <Row xs={3} sm={3} md={3} lg={3} xl={3} xxl={3} className="justify-content-md-center" style={{paddingTop: '10px'}}>
            <Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}><Button style={{width:'100%'}}  variant={getAwayTeamColor(matchup)} onClick={() => handleMatchup(matchup, true, false, false)}>{matchup.awayTeamName}</Button></Col>
			<Col xs={1} sm={1} md={1} lg={1} xl={1} xxl={1}><Button style={{width:'100%'}} variant={getTieColor(matchup)} onClick={() => handleMatchup(matchup, false, true, false)}>Tie</Button></Col>
			<Col xs={5} sm={5} md={5} lg={5} xl={5} xxl={5}><Button style={{width:'100%'}} variant={getHomeTeamColor(matchup)} onClick={() => handleMatchup(matchup, false, false, true)}>{matchup.homeTeamName}</Button></Col>
		</Row>
    )
}