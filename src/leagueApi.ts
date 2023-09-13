import { ILeagueDetails, ILeagueMetadata, Site } from './models';

export async function verifyLeagueExists( parameters: {
    site: string,
    leagueId: string,
    userId: string,
    swid: string,
    s2: string
}) {
    const response = await fetch(`https://api.theffhub.com/api/leagueData/leagueExists?site=${parameters.site}&leagueId=${parameters.leagueId}&userId=${parameters.userId}&swid=${parameters.swid}&s2=${parameters.s2}`)
    checkStatus(response);
    return await response.json() as boolean;
}

export async function getLeagues() {
    const leagueData = localStorage.getItem('leagues')
    if(leagueData){
        return JSON.parse(leagueData) as ILeagueMetadata[];
    }else{
        return [];
    }

    const response = await fetch(`https://localhost:44313/Home/leagueMetadata`)
    checkStatus(response);
    return await response.json() as ILeagueMetadata[];
}

export async function addLeague(leagueData: ILeagueMetadata) {
    const leaguesStorageData = localStorage.getItem('leagues');
    if(leaguesStorageData){
        const leagues = JSON.parse(leaguesStorageData) as ILeagueMetadata[];
        const newLeagues = [...leagues, leagueData];
        localStorage.setItem('leagues', JSON.stringify(newLeagues));
    }
    else{
        const newLeagues = [leagueData];
        localStorage.setItem('leagues', JSON.stringify(newLeagues));
    }
}

export async function setLeagues(leagues: ILeagueMetadata[]) {
    localStorage.setItem('leagues', JSON.stringify(leagues));
}


export async function setYahooId(yahooId: string) {
    localStorage.setItem('yahooId', yahooId);
}

export async function getYahooId() {
    const yahooId = localStorage.getItem('yahooId');
    if(yahooId){
        return yahooId;
    }
    return "";
}

export async function getYahooLeagueMetadata(userId: string) {
    const response = await fetch(`https://api.theffhub.com/api/Yahoo/leagues?userId=${userId}`)
    checkStatus(response);
    return await response.json() as ILeagueMetadata[];
}

export async function getLeagueDetails( parameters: {
    site: string,
    leagueId: string,
    userId: string,
    swid: string,
    s2: string,
    isPrivateLeague: boolean,
    privateLeagueData: string
}) {
    if(parameters.isPrivateLeague){
        //Make a post request to the private league endpoint
        const response = await fetch(`https://api.theffhub.com/api/leagueData`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                data: parameters.privateLeagueData
            })
        });
        checkStatus(response);
        return await response.json() as ILeagueDetails;
    }else{

    const response = await fetch(`https://api.theffhub.com/api/leagueData?site=${parameters.site}&leagueId=${parameters.leagueId}&userId=${parameters.userId}&swid=${parameters.swid}&s2=${parameters.s2}`)
    checkStatus(response);
    return await response.json() as ILeagueDetails;
    }
}

export function checkStatus(response: Response) {
	const redirectLocation = response.redirected === true ? response.url : response.headers.get('location');
	if (response.status >= 200 && response.status < 300) {
		return response;
	} else if (redirectLocation) {
		window.location.replace(redirectLocation);
		throw new Error(response.statusText);
	} else {
		throw new Error(response.statusText);
	}
}

export function convertSiteToText(site: Site){
    switch(site){
        case Site.ESPN:
            return "espn";
        case Site.Yahoo:
            return "yahoo";
        case Site.Sleeper:
            return "sleeper";
        case Site.Fleaflicker:
            return "fleaflicker";
        default:
            return "";
    }
}
