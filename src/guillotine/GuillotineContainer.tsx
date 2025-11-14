import React from 'react';
import { IGuillotineSummaryResponse } from '../models';
import { getGuillotineData } from '../leagueApi';
import { Loading } from '../shared/loading';
import { Row, Col } from 'react-bootstrap';
import { BidAmountsView } from './BidAmountsView';
import { ChoppedPlayersView } from './ChoppedPlayersView';
import { DraftPositionSuccessView } from './DraftPositionSuccessView';

export function GuillotineContainer() {
    const [guillotineData, setGuillotineData] = React.useState<IGuillotineSummaryResponse>();
    const [activeView, setActiveView] = React.useState<'bidAmounts' | 'choppedPlayers' | 'draftPosition'>('bidAmounts');

    const loading = guillotineData === undefined;

    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getGuillotineData();
                setGuillotineData(data);
            } catch (error) {
                console.error('Error fetching guillotine data:', error);
                // Set empty data structure on error
                setGuillotineData(undefined);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return <Loading />;
    }

    if (!guillotineData) {
        return (
            <div>
                <h1>Guillotine League Analysis</h1>
                <div className="alert alert-danger">
                    Failed to load guillotine data. Please try again later.
                </div>
            </div>
        );
    }

    return (
        <div>
            <h1>Guillotine League Analysis</h1>
            
            {/* View Selection */}
            <Row className="mb-3">
                <Col>
                    <div className="btn-group" role="group">
                        <button
                            type="button"
                            className={`btn ${activeView === 'bidAmounts' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveView('bidAmounts')}
                        >
                            Bid Amounts
                        </button>
                        <button
                            type="button"
                            className={`btn ${activeView === 'choppedPlayers' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveView('choppedPlayers')}
                        >
                            Chopped Players
                        </button>
                        <button
                            type="button"
                            className={`btn ${activeView === 'draftPosition' ? 'btn-primary' : 'btn-outline-primary'}`}
                            onClick={() => setActiveView('draftPosition')}
                        >
                            Draft Position Success
                        </button>
                    </div>
                </Col>
            </Row>

            {/* Data Summary */}
            <Row className="mb-3">
                <Col>
                    <p className="text-muted">
                        Data from {guillotineData.metadata.totalLeagues || 0} leagues
                        {guillotineData.metadata.lastUpdated && 
                            ` - Last updated: ${new Date(guillotineData.metadata.lastUpdated).toLocaleDateString()}`
                        }
                    </p>
                </Col>
            </Row>

            {/* View Content */}
            {activeView === 'bidAmounts' && <BidAmountsView data={guillotineData.bidAmounts} />}
            {activeView === 'choppedPlayers' && <ChoppedPlayersView data={guillotineData.choppedPlayers} />}
            {activeView === 'draftPosition' && <DraftPositionSuccessView data={guillotineData.draftPositions} />}
        </div>
    );
}
