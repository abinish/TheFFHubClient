import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { ILeagueMetadata } from '../models';
import FFHubLink from './FFHubLink';
import { LinkType } from './models'
import { faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card } from 'react-bootstrap';
import './Cards.css'
import AddLeagueModal from './AddLeagueModal';



export default function AddLeagueCard() {
	const leagues = React.useContext(LeagueContext);



    return (
		<Card className='ffHubCard'>
			<Card.Header>Add new league</Card.Header>
{/* 			<Card.Body>
				<FontAwesomeIcon icon={faPlus} size='6x' />
			</Card.Body> */}

			<Card.Text as="div" style={{paddingLeft: '10px', paddingRight: '10px', paddingBottom: '10px'}}>
				<AddLeagueModal/>
			</Card.Text>
		</Card>
    )
}