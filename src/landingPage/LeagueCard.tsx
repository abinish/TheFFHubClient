import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { ILeagueMetadata } from '../models';
import FFHubLink from './FFHubLink';
import { LinkType } from './models'
import { faGear, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Card, Dropdown, Modal } from 'react-bootstrap';
import './Cards.css'
import { setLeagues } from '../leagueApi';
import EditLeagueModal from './EditLeagueModal';

export interface ILeagueCardProps {
    league: ILeagueMetadata;
}

export default function LeagueCard( {league}: ILeagueCardProps) {
	const leagues = React.useContext(LeagueContext);

	const [showDeleteModal, setShowDeleteModal] = React.useState(false);
	const [showEditModal, setShowEditModal] = React.useState(false);

	const handleDeleteModalClose = () => setShowDeleteModal(false);

	const handleDropdownDeleteClick = () => setShowDeleteModal(true);

	const handleDropdownEditClick = () => setShowEditModal(true);

	const onDeleteLeague = (league: ILeagueMetadata) => {
		//remove from leagues where site, leagueId, and name match league
		
		var updatedLeagues = leagues.leagues.filter(item => !(item.site === league.site && item.leagueId === league.leagueId && item.name === league.name));
		setLeagues(updatedLeagues);
		leagues.setLeagues(updatedLeagues);
	}

	const onLeagueEdit = () => {
		//save the edits done to the league
		var updatedLeagues = JSON.parse(JSON.stringify(leagues.leagues));
		setLeagues(updatedLeagues);
		leagues.setLeagues(updatedLeagues);
	}

    return (
		<>
		<EditLeagueModal showModal={showEditModal} setShowModal={setShowEditModal} league={league} handleSave={() => onLeagueEdit()}/>
		<Modal show={showDeleteModal} onHide={handleDeleteModalClose}> 
			<Modal.Header>Delete league from TheFFHub?</Modal.Header>
			<Modal.Body>
				Are you sure you want to delete {league.name} from TheFFHub?
			</Modal.Body>
			<Modal.Footer>
				<button className='btn btn-danger' onClick={() => onDeleteLeague(league)}>Delete</button>
				<button className='btn btn-secondary' onClick={() => handleDeleteModalClose()}>Cancel</button>
			</Modal.Footer>
		</Modal>
		<Card className='ffHubCard'>
			<Card.Header ><span >{league.name}</span>
				<Dropdown style={{float: 'right', paddingLeft: '10px'}} align={'end'}>
						<Dropdown.Toggle variant="outline-dark" id="dropdown-basic" size='sm'>
							<FontAwesomeIcon icon={faGear}  aria-hidden="true"/>
						</Dropdown.Toggle>
						<Dropdown.Menu>
							<Dropdown.Item  onClick={() => handleDropdownEditClick()}>Edit</Dropdown.Item>
							<Dropdown.Item  onClick={() => handleDropdownDeleteClick()}>Delete</Dropdown.Item>
						</Dropdown.Menu>
                </Dropdown>
			</Card.Header>
			<Card.Body className='ffHubCardBody'>
				<Card.Text>
						<FFHubLink league={league} type={LinkType.PowerRankings}/>
						<br />
						<FFHubLink league={league} type={LinkType.PlayoffMachine}/>
						<br />
						<FFHubLink league={league} type={LinkType.PlayoffOdds}/>
						<br />
						<FFHubLink league={league} type={LinkType.PlayoffTool}/>
						<br />
						<FFHubLink league={league} type={LinkType.Scheduler}/>
						{
							league.site === 'sleeper' &&
							<>
								<br />
								<FFHubLink league={league} type={LinkType.TradeHistory}/>
							</>
						}
						{
							league.site === 'sleeper' &&
							<>
								<br />
								<FFHubLink league={league} type={LinkType.LeagueHistory}/>
							</>
						}
				</Card.Text>
			</Card.Body>
		</Card>
		</>
    )
}