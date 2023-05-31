import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { ILeagueMetadata } from '../models';
import FFHubLink from './FFHubLink';
import { LinkType } from './models'
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from 'react-bootstrap';
import './Cards.css'

export interface ILeagueCardProps {
    league: ILeagueMetadata;
}

export default function LeagueCard( {league}: ILeagueCardProps) {
	const leagues = React.useContext(LeagueContext);

	const onDeleteLeague = (league: ILeagueMetadata) => {
		var updatedLeagues = leagues.leagues.filter(item => item.site !== league.site && item.leagueId !== league.leagueId);
		leagues.setLeagues(updatedLeagues);
	}

    return (
		<Card className='ffHubCard'>
			<Card.Header>{league.name}<FontAwesomeIcon icon={faTrash}  aria-hidden="true" style={{float: 'right', paddingLeft: '10px'}} onClick={() => onDeleteLeague(league)}/></Card.Header>
			<Card.Body className='ffHubCardBody'>
				<Card.Text>
						<FFHubLink league={league} type={LinkType.PowerRankings}/>
						<br />
						<FFHubLink league={league} type={LinkType.PlayoffMachine}/>
						<br />
						<FFHubLink league={league} type={LinkType.PlayoffOdds}/>
						<br />
						<FFHubLink league={league} type={LinkType.Scheduler}/>
				</Card.Text>
			</Card.Body>
		</Card>
    )
}