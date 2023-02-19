import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import LeagueCard from './LeagueCard';

export default function LeagueList() {
	const leagues = React.useContext(LeagueContext);

	return (
		<div>
			<div>
				{leagues.leagues?.map(t => <LeagueCard league={t} key={t.leagueId+t.site}/>)}
			</div>
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
