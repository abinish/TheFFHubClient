import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import LeagueCard from './LeagueCard';
import { Col, Row } from 'react-bootstrap';

export default function LeagueList() {
	const leagues = React.useContext(LeagueContext);

	return (
		<div>
			<Row xs={1} md={2} className="g-4">
				{leagues.leagues?.map(t => <Col><LeagueCard league={t} key={t.leagueId+t.site}/></Col>)}
			</Row>
            {/* <div
                data-testid='toggle-other-Leagues'
                className={cx(styles.showMoreLink, {[styles.expanded]: showNotMatching})}
                onClick={() => setShowNotMatching(p => !p)}>
                {showNotMatching ? 'Hide other Leagues' : 'Show other Leagues'}
                <Icon type='navigation-next' />
            </div> */}
			
		</div>
	);
}
