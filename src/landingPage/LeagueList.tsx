import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import LeagueCard from './LeagueCard';
import { Col, Row } from 'react-bootstrap';
import './Cards.css'
import AddLeagueCard from './AddLeagueCard';

export default function LeagueList() {
	const leagues = React.useContext(LeagueContext);

	return (
		<div>
			<div className='ffHubDiv'>
				{leagues.leagues?.map(t => <LeagueCard league={t} key={t.leagueId+t.site+t.name}/>)}
				{/* <div
					data-testid='toggle-other-Leagues'
					className={cx(styles.showMoreLink, {[styles.expanded]: showNotMatching})}
					onClick={() => setShowNotMatching(p => !p)}>
					{showNotMatching ? 'Hide other Leagues' : 'Show other Leagues'}
					<Icon type='navigation-next' />
				</div> */}
			</div>
			<div className='ffHubDiv' style={{paddingTop: '10px'}}>
				<AddLeagueCard/>
			</div>
		</div>
	);
}
