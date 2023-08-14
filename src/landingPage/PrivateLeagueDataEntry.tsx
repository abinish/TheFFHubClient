import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { ILeagueMetadata } from '../models';
import FFHubLink from './FFHubLink';
import { LinkType } from './models'
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Form } from 'react-bootstrap';

export interface IPrivateLeagueDataEntryProps {
    league: ILeagueMetadata;
	onPrivateLeagueDataChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	shouldShowFailureMessage: boolean;
}

export default function PrivateLeagueDataEntry( {league, onPrivateLeagueDataChange, shouldShowFailureMessage}: IPrivateLeagueDataEntryProps) {

	const getSeasonId =  () => {
		var now = new Date();

		//If it is the second half of the year return this year
		//Otherwise it is early in the next year and espn uses the start of the season as the seasonID
		if (now.getMonth() > 6)
			return now.getFullYear();


		return now.getFullYear() -1;
	}

	const privateLeagueUri = 'https://fantasy.espn.com/apis/v3/games/ffl/seasons/' + getSeasonId() + '/segments/0/leagues/' + league.leagueId + '?view=mMatchupScore&view=mTeam&view=mSettings';

    return (
		<Form.Group controlId="privateLeague">
			<Form.Label>
				{shouldShowFailureMessage && <span> We could not properly load your league.  This may be because it is a private league. <br /></span>}
				In order to get private league data you will have to do the following steps: <br />
				1. Open <a href="http://espn.go.com">ESPN</a> in a web browser<br />
				2. Go to the following URL: <a href={privateLeagueUri}>{privateLeagueUri}</a><br />
				3. Copy what is returned into the textbox below:
			</Form.Label>
			<Form.Control as="textarea" rows={10} defaultValue={league.privateLeagueData} onChange={onPrivateLeagueDataChange}></Form.Control>
		</Form.Group>
    )
}