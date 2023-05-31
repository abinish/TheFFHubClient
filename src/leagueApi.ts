import { ILeagueDetails, ILeagueMetadata, Site } from './models'
import { useCookies } from 'react-cookie';

export async function verifyLeagueExists( parameters: {
    site: string,
    leagueId: string,
    userId: string,
    swid: string,
    s2: string
}) {
    const response = await fetch(`https://fm3dfpxzo8.execute-api.us-east-1.amazonaws.com/api/leagueData/leagueExists?site=${parameters.site}&leagueId=${parameters.leagueId}&userId=${parameters.userId}&swid=${parameters.swid}&s2=${parameters.s2}`)
    checkStatus(response);
    return await response.json() as boolean;
}

export async function getLeagues(cookies: any) {
    if(cookies.leagues){
        return cookies.leagues as ILeagueMetadata[];
    }else{
        return [];
    }

    const response = await fetch(`https://localhost:44313/Home/leagueMetadata`)
    checkStatus(response);
    return await response.json() as ILeagueMetadata[];
}

export async function addLeague(leagueData: ILeagueMetadata, cookies: any, setCookie: any) {
    if(cookies.leagues){
        setCookie('leagues', [...cookies.leagues, leagueData]);
    }
    else{
        setCookie('leagues', [leagueData]);
    }
}

export async function getLeagueDetails( parameters: {
    site: string,
    leagueId: string,
    userId: string,
    swid: string,
    s2: string
}) {
    const response = await fetch(`https://fm3dfpxzo8.execute-api.us-east-1.amazonaws.com/api/leagueData?site=${parameters.site}&leagueId=${parameters.leagueId}&userId=${parameters.userId}&swid=${parameters.swid}&s2=${parameters.s2}`)
    checkStatus(response);
    return await response.json() as ILeagueDetails;
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
        default:
            return "";
    }
}
