import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Select from 'react-select';
import { ILeagueDetails, ITeam, Site, PlayoffTiebreakerID } from '../models';
import { convertSiteToText } from '../leagueApi';

export interface IPlayoffMachineAdvancedOptionsProps {
    league: ILeagueDetails;
    handlePointsChange: (team: ITeam, pointsFor: number) => void;
    handleTiebreakerSettingChange: (site: string, playoffTiebreakerID: number) => void;
}

export default function PlayoffMachineAdvancedOptions( {league, handlePointsChange, handleTiebreakerSettingChange}: IPlayoffMachineAdvancedOptionsProps) {
    
    // Convert league site string to Site enum
    const getLeagueSite = (): Site => {
        switch(league.site.toLowerCase()) {
            case 'espn':
                return Site.ESPN;
            case 'yahoo':
                return Site.Yahoo;
            case 'sleeper':
                return Site.Sleeper;
            case 'fleaflicker':
                return Site.Fleaflicker;
            case 'nfl':
                return Site.NFL;
            default:
                return Site.ESPN;
        }
    };

    const [selectedSite, setSelectedSite] = React.useState<Site>(getLeagueSite());
    const [selectedTiebreaker, setSelectedTiebreaker] = React.useState<PlayoffTiebreakerID>(league.leagueSettings.playoffTiebreakerID);

    // Site options
    const siteOptions = [
        { value: Site.ESPN, label: 'ESPN' },
        { value: Site.Yahoo, label: 'Yahoo' },
        { value: Site.Sleeper, label: 'Sleeper' },
        { value: Site.Fleaflicker, label: 'Fleaflicker' },
        { value: Site.NFL, label: 'NFL' }
    ];

    // Get available tiebreakers based on selected site
    const getAvailableTiebreakers = (site: Site) => {
        const allTiebreakers = [
            { value: PlayoffTiebreakerID.HeadToHead, label: 'Head to Head' },
            { value: PlayoffTiebreakerID.TotalPointsScored, label: 'Total Points Scored' },
            { value: PlayoffTiebreakerID.IntraDivisionRecord, label: 'Intra Division Record' },
            { value: PlayoffTiebreakerID.TotalPointsAgainst, label: 'Total Points Against' }
        ];

        switch(site) {
            case Site.ESPN:
            case Site.NFL:
                // ESPN and NFL support all four tiebreakers
                return allTiebreakers;
            case Site.Fleaflicker:
                // Fleaflicker only supports head to head
                return [{ value: PlayoffTiebreakerID.HeadToHead, label: 'Head to Head' }]; // Head to Head only
            case Site.Sleeper:
            case Site.Yahoo:
                // Sleeper and Yahoo only support points for
                return [{ value: PlayoffTiebreakerID.TotalPointsScored, label: 'Total Points Scored' }]; // Total Points Scored only
            default:
                return allTiebreakers;
        }
    };

    const availableTiebreakers = getAvailableTiebreakers(selectedSite);

    // Handle site change
    const handleSiteSelectedChange = (site: Site) => {
        setSelectedSite(site);
        
        // Get available tiebreakers for the new site
        const newAvailableTiebreakers = getAvailableTiebreakers(site);
        
        // If current tiebreaker is not available for the new site, select the first available one
        let newTiebreaker = selectedTiebreaker;
        if (!newAvailableTiebreakers.some(t => t.value === selectedTiebreaker)) {
            newTiebreaker = newAvailableTiebreakers[0].value;
        }
        
        setSelectedTiebreaker(newTiebreaker);
        handleTiebreakerSettingChange(convertSiteToText(site), newTiebreaker);
    };

    // Handle tiebreaker change
    const handleTiebreakerChange = (tiebreakerID: PlayoffTiebreakerID) => {
        setSelectedTiebreaker(tiebreakerID);
        handleTiebreakerSettingChange(convertSiteToText(selectedSite), tiebreakerID);
    };
  return (
    <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
            <Accordion.Header as={Card.Header}>
            Advanced Options (Beta)
            </Accordion.Header>
            <Accordion.Body>
                <h5 style={{ marginBottom: '15px', color: '#495057', borderBottom: '1px solid #dee2e6', paddingBottom: '5px' }}>
                    Change Tiebreaker Rules
                </h5>
                
                {selectedSite === Site.Yahoo && (
                    <Alert variant="info" style={{ marginBottom: '20px' }}>
                        <Alert.Heading style={{ fontSize: '16px' }}>Yahoo Tiebreaker Note</Alert.Heading>
                        Yahoo handles ties for division winners with intra division record but all others with points for. This will only happen when yahoo is selected as the tiebreaker options.
                    </Alert>
                )}
                
                <div style={{ display: 'flex', gap: '15px', marginBottom: '20px', flexWrap: 'wrap' }}>
                    <div style={{ minWidth: '200px' }}>
                        <Form.Label><strong>Site:</strong></Form.Label>
                        <Select 
                            styles={{
                                menu: (base) => ({...base, width: '200px'}), 
                                control: (base) => ({...base, width: '200px'})
                            }} 
                            options={siteOptions} 
                            value={siteOptions.find(option => option.value === selectedSite)} 
                            onChange={(selectedOption) => selectedOption && handleSiteSelectedChange(selectedOption.value)}
                            isSearchable={false}
                        />
                    </div>

                    <div style={{ minWidth: '250px' }}>
                        <Form.Label><strong>Playoff Tiebreaker:</strong></Form.Label>
                        <Select 
                            styles={{
                                menu: (base) => ({...base, width: '250px'}), 
                                control: (base) => ({...base, width: '250px'})
                            }} 
                            options={availableTiebreakers} 
                            value={availableTiebreakers.find(option => option.value === selectedTiebreaker)} 
                            onChange={(selectedOption) => selectedOption && handleTiebreakerChange(selectedOption.value)}
                            isSearchable={false}
                        />
                    </div>
                </div>
                
                {/* {league.teams.map((team) => (
                    <div>
                        <span style={{marginTop: 100}}>{team.teamName}: </span><br />
                        <input type="number" value={team.pointsFor} onChange={s=> handlePointsChange(team, parseFloat(s.target.value))} name='pointsFor'/> <br />
                    </div>
                ))} */}
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
  );
};
