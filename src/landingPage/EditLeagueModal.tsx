import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { Alert, Card, Form, Modal } from 'react-bootstrap';
import './Cards.css'
import AddLeagueModal from './AddLeagueModal';
import { ILeagueMetadata } from '../models';
import PrivateLeagueDataEntry from './PrivateLeagueDataEntry';

export interface IEditLeagueModalProps {
    showModal: boolean;
    setShowModal: (showModal: boolean) => void;
    league: ILeagueMetadata;
    handleSave: () => void;
}

export default function EditLeagueModal( {showModal, setShowModal, league, handleSave}: IEditLeagueModalProps) {
    const handleModalClose = () => setShowModal(false);
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        league.name = e.currentTarget.value;
      }

    var getValidUntilDate = () => {
        var now = new Date();
        now.setDate(now.getDate() + (((2 + 7 - now.getDay()) % 7) || 7));
        now.setHours(0,3,0,0);
        return now;
	}
	const handlePrivateLeagueDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        league.privateLeagueData = e.currentTarget.value;
		league.privateLeagueDataValidUntil = getValidUntilDate();
    }

    return (
		<Modal show={showModal} onHide={handleModalClose}> 
			<Modal.Header>Edit {league.name}</Modal.Header>
			<Modal.Body>
                {league.isPrivateLeague && league.privateLeagueDataValidUntil < new Date() &&
                    <Alert key='warning' variant={'warning'} dismissible>
                        The league data may be out of date. Follow the steps below to update to the latest data.
                    </Alert>
                }
				<Form>
                    <Form.Group controlId="formLeagueName">
                        <Form.Label>League Name:</Form.Label>
                        <Form.Control type="text" placeholder="Enter league name" defaultValue={league.name} onChange={handleNameChange}/>
                    </Form.Group>
                    <br/>
                    {league.isPrivateLeague &&
                        <PrivateLeagueDataEntry league={league} shouldShowFailureMessage={false} onPrivateLeagueDataChange={handlePrivateLeagueDataChange}/>
                    }
                </Form>
			</Modal.Body>
			<Modal.Footer>
				<button className='btn btn-success' onClick={handleSave}>Save</button>
				<button className='btn btn-secondary' onClick={handleModalClose}>Cancel</button>
			</Modal.Footer>
		</Modal>
    )
}