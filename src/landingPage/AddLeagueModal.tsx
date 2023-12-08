import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { ILeagueMetadata, Site } from '../models';
import { LinkType } from './models'
import Select from 'react-select';
import { addLeague, convertSiteToText, verifyLeagueExists } from '../leagueApi';
import { Button } from 'react-bootstrap';
import AddPrivateLeagueOrReturn from './AddPrivateLeagueOrReturn';
import PrivateLeagueDataEntry from './PrivateLeagueDataEntry';

export default function AddLeagueModal() {
	const leagues = React.useContext(LeagueContext);
    const [leagueToAdd, setLeagueToAdd] = React.useState<ILeagueMetadata>(
        {
            site: "espn",
            leagueId: "",
            name: "",
            userId: "",
            swid: "",
            s2: "",
            isPrivateLeague: false,
            privateLeagueData: "",
            privateLeagueDataValidUntil: new Date("1/1/2100")
            
        }
    );
    const [isLoading, setLoading] = React.useState(false);
	const [selectedSite, setSelectedSite] = React.useState(Site.ESPN);
    const [showAddPrivateLeague, setShowAddPrivateLeague] = React.useState(false);

    const showYahooAuthentication = selectedSite === Site.Yahoo;

    const addLeagueButtonDisabled = !leagueToAdd.name || !leagueToAdd.leagueId || isLoading;

    const siteUrlImage = () => {
        if(selectedSite === Site.ESPN){
            return <img src="/espnurl.PNG" alt="espn url" />
        }
        if(selectedSite === Site.Yahoo){
            return <img src="/yahooUrl.PNG" alt="yahoo url" />
        }
        if(selectedSite === Site.Sleeper){
            return <img src="/sleeperUrl.png" alt="sleeper url" />
        }
        if(selectedSite === Site.Fleaflicker){
            return <img src="/fleaflickerUrl.PNG" alt="fleaflicker url" />
        }
        return <span></span>;
    }

    const privateLeagueUri = (type: LinkType) => {
        switch(type){
            case LinkType.PlayoffMachine:
                return "Playoff Machine";
            case LinkType.PlayoffOdds:
                return "Playoff Odds";
            case LinkType.PowerRankings:
                return "Power Rankings";
            case LinkType.Scheduler:
                return "Schedule Comparison";
            default:
                return "Playoff Machine";
        }
    }
    
    const options = [
        { value: Site.ESPN, label: 'ESPN' },
        { value: Site.Yahoo, label: 'Yahoo' },
        { value: Site.Sleeper, label: 'Sleeper' },
        { value: Site.Fleaflicker, label: 'Fleaflicker (NARFFL beta)' },
        { value: Site.NFL, label: 'NFL (beta)' }
    ]

    const handleLeagueIdChange = (s: string) => {
        setLeagueToAdd({
            ...leagueToAdd,
            leagueId: s
        });
    }

    const handleNameChange = (s: string) => {
        setLeagueToAdd({
            ...leagueToAdd,
            name: s
        });
    }

    const handleYahooLogin = () => {
        window.location.assign('https://api.theffhub.com/api/Auth/YahooLogin');
    }

	const handleAddLeague = () => {
            const fetchData = async () => {
                const leagueExists = await verifyLeagueExists(
                    {
                        site: leagueToAdd.site,
                        leagueId: leagueToAdd.leagueId,
                        userId: "",
                        swid: "",
                        s2: ""
                    }
                );
                if(leagueExists){

                    handleAddLeagueHelper(leagueToAdd);
                }else{
                    handleShowPrivateLeague(true);
                }
                setLoading(false);
            }
            setLoading(true);
            fetchData();
            
	}


    const handleAddPrivateLeague = () => {
        handleAddLeagueHelper(leagueToAdd);
        handleShowPrivateLeague(false);
    }

    const handleAddLeagueHelper = (league: ILeagueMetadata) => {
        addLeague(league);
        var updatedLeagues = [...leagues.leagues, league]
        leagues.setLeagues(updatedLeagues);
        setLeagueToAdd({
            site: leagueToAdd.site,
            leagueId: "",
            name: "",
            userId: "",
            swid: "",
            s2: "",
            isPrivateLeague: false,
            privateLeagueData: '',
            privateLeagueDataValidUntil: new Date("1/1/2100")
        });
    }
    
    const handleSiteSelectedChange = (s: Site) => {
        setLeagueToAdd({
            ...leagueToAdd,
            site: convertSiteToText(s)
        });
        setSelectedSite(s);
    }

    var getValidUntilDate = () => {
        var now = new Date();
        now.setDate(now.getDate() + (((2 + 7 - now.getDay()) % 7) || 7));
        now.setHours(0,3,0,0);
        return now;
	}
	const handlePrivateLeagueDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setLeagueToAdd({
            ...leagueToAdd,
            privateLeagueData: e.currentTarget.value,
            privateLeagueDataValidUntil: getValidUntilDate()
        });
    }

    const handleShowPrivateLeague = (value: boolean) => {
        setLeagueToAdd({
            ...leagueToAdd,
            isPrivateLeague: value
        });
        setShowAddPrivateLeague(value);
    }

    return (
        <>
            { showAddPrivateLeague && <AddPrivateLeagueOrReturn setShowAddPrivateLeague={handleShowPrivateLeague} league={leagueToAdd} onPrivateLeagueDataChange={handlePrivateLeagueDataChange} addLeague={handleAddPrivateLeague}/> }
            { !showAddPrivateLeague && 
                <div>
                Select the site your league is on: <br />
                <Select styles={{menu: (base) => ({...base, width: '190px'}), control: (base) => ({...base, width: '190px'})}} options={options} value = { options.filter(option => option.value === selectedSite)} onChange={s =>handleSiteSelectedChange(s?.value || Site.ESPN)}/>

                { !showYahooAuthentication &&
                    <span>
                        <span style={{paddingTop:100}}>Grab the league ID from the URL of your league (see image below for more details):</span> <br />

                        <input placeholder="League ID" type="text" value={leagueToAdd.leagueId || ''} onChange={s=> handleLeagueIdChange(s.target.value)} name='leagueId' /> {siteUrlImage()}<br />

                        <span style={{marginTop: 100}}>Add a name to remember your league by: </span><br />
                        <input placeholder="Name of the league" type="text" value={leagueToAdd.name || ''} onChange={s=> handleNameChange(s.target.value)} name='leagueName'/> <br />
                        <Button variant='success' onClick={handleAddLeague} disabled={addLeagueButtonDisabled} style={{marginTop:10}}>{isLoading ? 'Loading...' : 'Add'}</Button>
                    </span>
                }
                { showYahooAuthentication &&
                    <div style={{paddingTop: '10px'}}>
                        <Button variant="success" onClick={handleYahooLogin}>Authenticate with Yahoo</Button>
                    </div>
                }
                </div>
            }
        </>
    )
}