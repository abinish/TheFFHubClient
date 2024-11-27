import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { Button, Card } from 'react-bootstrap';
import './Cards.css'
import AddLeagueModal from './AddLeagueModal';
import { ILeagueMetadata } from '../models';
import PrivateLeagueDataEntry from './PrivateLeagueDataEntry';

export interface IAddPrivateLeagueOrReturnProps {
	setShowAddPrivateLeague: (setShowAddPrivateLeague: boolean) => void;
	league: ILeagueMetadata;
	onPrivateLeagueDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	addLeague: () => void;
}

export default function AddPrivateLeagueOrReturn({ setShowAddPrivateLeague, league, onPrivateLeagueDataChange, addLeague}: IAddPrivateLeagueOrReturnProps) {
    return (
		<div>
			<PrivateLeagueDataEntry league={league} shouldShowFailureMessage={true} onPrivateLeagueDataChange={onPrivateLeagueDataChange}/>
			<Button variant="success" style={{margin: '10px'}} onClick={() => addLeague()} >Add Private League</Button>
			<Button variant="primary" style={{float: 'right', margin: '10px'}} onClick={() => setShowAddPrivateLeague(false)}>My league isn't private</Button>
		</div>
    )
}