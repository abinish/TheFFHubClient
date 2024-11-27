import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { ILeagueMetadata } from '../models';
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Card } from 'react-bootstrap';
import '../landingPage/Cards.css'
import { addLeague, setLeagues } from '../leagueApi';

export interface IYahooLeagueCardProps {
    league: ILeagueMetadata;
}

export default function YahooLeagueCard( {league}: IYahooLeagueCardProps) {
	const leagues = React.useContext(LeagueContext);
    const [leagueAdded, setLeagueAdded] = React.useState(false);
    const [isSaving, setIsSaving] = React.useState(false);

	const onDeleteLeague = (league: ILeagueMetadata) => {
		//remove from leagues where site, leagueId, and name match league
		
		var updatedLeagues = leagues.leagues.filter(item => !(item.site === league.site && item.leagueId === league.leagueId && item.name === league.name));
		leagues.setLeagues(updatedLeagues);
	}
    
    const onAddLeague = () => {
        setIsSaving(true);

        addLeague(league);

        var updatedLeagues = [...leagues.leagues, league]
		leagues.setLeagues(updatedLeagues);

        setLeagueAdded(true);
        setIsSaving(false);
    }

    <FontAwesomeIcon icon={faTrash}  aria-hidden="true"  onClick={() => onDeleteLeague(league)}/>

    const addLeagueButton = () => {
        if(isSaving) {
            return <Button variant="success" disabled>Adding...</Button>
        }else if(leagueAdded) { //If the league is added and we aren't saving
            return <Button variant="success" disabled>Added</Button>
        }else { //If the league is not added and we aren't saving
            return <Button variant="success"onClick={() => onAddLeague()}>Add to TheFFHub</Button>
        }
    }

    return (
		<Card className='ffHubCard'>
			<Card.Header>{league.name} </Card.Header>
			<Card.Body className='ffHubCardBody'>
				<Card.Text>
						LeagueId: {league.leagueId}
                        
				</Card.Text>
                <Card.Text>
                {addLeagueButton()}
                    </Card.Text>
			</Card.Body>
		</Card>
    )
}