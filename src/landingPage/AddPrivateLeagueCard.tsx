import React from 'react';
import { LeagueContext } from '../Contexts/LeagueContexts';
import { ILeagueMetadata } from '../models';
import FFHubLink from './FFHubLink';
import { LinkType } from './models'
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface ILeagueCardProps {
    league: ILeagueMetadata;
}

export default function AddPrivateLeagueCard( {league}: ILeagueCardProps) {
	const leagues = React.useContext(LeagueContext);

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

    return (
		<div/>
            /* {<div ng-show="showPrivateLeagueSettings">
			We could not properly load your league.  This may be because it is a private league. <br />
			In order to view private leagues you will have to do the following steps (or <a href="https://chrome.google.com/webstore/detail/espn-private-league-key-a/bakealnpgdijapoiibbgdbogehhmaopn">download this extension</a> and try again ): <br />
			1. Open <a href="http://espn.go.com">ESPN</a> in a web browser<br />
			2. Go to the following URL: <a ng-href="{{privateLeagueUri}}">{{privateLeagueUri}}</a><br />
			3. Copy what is returned into the textbox below:<br />
			<textarea ng-model="privateLeagueDataToAdd" rows="10"></textarea><br />
			<div ng-show="privateLeagueDataToAdd !== ''">
				4. Select which screen you want to open:<br />
				<form action="Home/PlayoffMachine" method="post" id="lowerPM" target="_blank">
					<input type="text" name="data" ng-model="privateLeagueDataToAdd" ng-show="false" />
					<a onclick="document.forms['lowerPM'].submit(); return false;" style="cursor: pointer">Playoff Machine</a>
				</form>
				<form action="Home/PowerRankings" method="post" id="lowerPR" target="_blank">
					<input type="text" name="data" ng-model="privateLeagueDataToAdd" ng-show="false" />
					<a onclick="document.forms['lowerPR'].submit(); return false;" style="cursor: pointer">Power Rankings</a>
				</form>
				<form action="Home/PlayoffOdds" method="post" id="lowerPO" target="_blank">
					<input type="text" name="data" ng-model="privateLeagueDataToAdd" ng-show="false" />
					<a onclick="document.forms['lowerPO'].submit(); return false;" style="cursor: pointer">Playoff Odds</a>
				</form>
				<form action="Home/Scheduler" method="post" id="lowerS" target="_blank">
					<input type="text" name="data" ng-model="privateLeagueDataToAdd" ng-show="false" />
					<a onclick="document.forms['lowerS'].submit(); return false;" style="cursor: pointer">Schedule Comparison</a>
				</form>
			</div>
		</div> */
    )
}