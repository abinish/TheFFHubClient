import { IHeadToHeadStandingsTeam, ILeagueDetails, IMatchupItem, ITeam, PlayoffTiebreakerID, Site } from "../models";

export const orderStandings = (league: ILeagueDetails) => {
    if (league == null){
        return [];
    }

    var unrankedTeams: ITeam[] = [];
    var divisionWinners: ITeam[] = [];
    var ranksRemaining: number[] = [];
    const site = getSiteFromString(league.site);
    const tiebreakerId = getTiebreakerIdFromId(league.leagueSettings.playoffTiebreakerID);

    var allMatchups: IMatchupItem[] = [];
    league.completedSchedule.forEach((week)=> {
        allMatchups.push(...week.matchups);
    })
    league.remainingSchedule.forEach((week)=> {
        allMatchups.push(...week.matchups);
    })

    for (let index = 0; index < league.teams.length; index++) {
        ranksRemaining.push(index+1);
    }

    league.teams.forEach(team => {
        team.winPercentage = (team.wins + (0.5) * team.ties) / Math.max((team.wins + team.losses + team.ties), 1);
        team.divisionWinPercentage = (team.divisionWins + (0.5) * team.divisionTies) / Math.max((team.divisionWins + team.divisionLosses + team.divisionTies), 1);
        team.tiebreakers = [];
        unrankedTeams.push(team);
    });

    //Find divion winners
    for(var i =0; i < league.leagueSettings.divisions.length; i++){
        var divisionWinner = determineDivisionWinner(sortByWinPercentage(league.leagueSettings.divisions[i].teams), site, tiebreakerId, allMatchups); 
        if(divisionWinner)
            divisionWinners.push(divisionWinner);
    }

    //Remove division winners from overall ranks
    unrankedTeams = unrankedTeams.filter((team) => {
        return divisionWinners.findIndex((eachTeam) =>{
            return eachTeam.teamName === team.teamName;
        }) < 0;
    });

    //Sort division winners
    var sortedDivisionWinners = sortTeams(divisionWinners, site, tiebreakerId, allMatchups);

    //Apply Ranking
    setTeamRanking(ranksRemaining, sortedDivisionWinners);

    //Sort al lthe rest
    var sortedTeams = sortTeams(unrankedTeams, site, tiebreakerId, allMatchups);

    setTeamRanking(ranksRemaining, sortedTeams);
}

const sortTeams = (teams: ITeam[], site: Site, tiebreakerId: PlayoffTiebreakerID, allMatchups: IMatchupItem[]): ITeam[] => {
    var orderedTeams: ITeam[] = [];

    var sortedTeams = sortByWinPercentage(teams);

    while(sortedTeams.length > 0){
        var topTeams = sortedTeams.filter((team) => {
            return team.winPercentage === sortedTeams[0].winPercentage;
        });

        //Loop through all until all of the tiebreakers are resolved
        while(topTeams.length > 1){
            var tiebreaker = generateTiebreakerObject(topTeams);

            var topTeam = determineTieBreakersWinner(topTeams, site, tiebreaker, tiebreakerId, allMatchups);

            if(!topTeam)
                return [];

            //Remove from all teams
            var index = sortedTeams.indexOf(topTeam);
            if(index > -1)
                sortedTeams.splice(index, 1);

            //Remove from tiebreaking teams
            index = topTeams.indexOf(topTeam);
            if(index > -1)
                topTeams.splice(index, 1);

            orderedTeams.push(topTeam);
        }

        var temp = topTeams.shift();
    
        if(temp){
            //Remove from teams
            var sortedTeamIndex = sortedTeams.indexOf(temp);
            if(sortedTeamIndex > -1)
                sortedTeams.splice(sortedTeamIndex, 1);

            orderedTeams.push(temp);
        }
    }
    return orderedTeams;
}

const setTeamRanking = (remainingRankings: number[], sortedTeams: ITeam[]) => {
    while (sortedTeams.length > 0) {
        var team = sortedTeams.shift()
        if(team)
            team.overallRank = remainingRankings.shift() ?? 100;
    }
}

const determineDivisionWinner = (sortedTeams: ITeam[], site: Site, tiebreakerId: PlayoffTiebreakerID, allMatchups: IMatchupItem[] ) : ITeam | undefined => {
    var topTeams = sortedTeams.filter((team) => {
        return team.winPercentage === sortedTeams[0].winPercentage;
    });

    if(topTeams.length === 1)
        return topTeams[0];

    var tiebreaker = generateTiebreakerObject(topTeams);

    //Yahoo does intra division for division winner firs then normal
    if(site === Site.Yahoo){
        var winner = intraDivisionTiebreaker(topTeams, tiebreaker);
        if(winner)
            return winner;
    }

    //Otherwise start doing tiebreakers
    return determineTieBreakersWinner(topTeams, site, tiebreaker, tiebreakerId, allMatchups);
}

const determineTieBreakersWinner = (sortedTeams: ITeam[], site: Site, tiebreaker: string[], tiebreakerId: PlayoffTiebreakerID, allMatchups: IMatchupItem[]) : ITeam | undefined => {
    if(site === Site.Yahoo){
        var winner = pointsForTiebreaker(sortedTeams, tiebreaker);
        if(winner)
            return winner;

        //Fuck the other tiebreaker, I don't want to calculate it. Let it fallback to coin flip
    }else if(site === Site.Sleeper){
        winner = pointsForTiebreaker(sortedTeams, tiebreaker);
        if(winner)
            return winner;

        winner = pointsAgainstTiebreaker(sortedTeams, tiebreaker);
        if(winner)
            return winner;

        //Fallback to coin flip
    }else{
        if(tiebreakerId === PlayoffTiebreakerID.HeadToHead){
            winner = headToHeadTiebreaker(sortedTeams, site,  tiebreaker, tiebreakerId, allMatchups);
            if(winner)
                return winner;

            winner = pointsForTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;

            winner = intraDivisionTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;

            winner = pointsAgainstTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;
            
            //Nobody wins, fallback to randomish
        }else if(tiebreakerId === PlayoffTiebreakerID.TotalPointsScored){
            winner = pointsForTiebreaker(sortedTeams,  tiebreaker);
            if(winner)
                return winner;

            winner = headToHeadTiebreaker(sortedTeams, site, tiebreaker, tiebreakerId, allMatchups);
            if(winner)
                return winner;

            winner = intraDivisionTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;

            winner = pointsAgainstTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;
            
            //Nobody wins, fallback to randomish
        }else if(tiebreakerId === PlayoffTiebreakerID.IntraDivisionRecord){
            winner = intraDivisionTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;
            
            winner = headToHeadTiebreaker(sortedTeams, site, tiebreaker, tiebreakerId, allMatchups);
            if(winner)
                return winner;

            winner = pointsForTiebreaker(sortedTeams,  tiebreaker);
            if(winner)
                return winner;

            winner = pointsAgainstTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;
            
            //Nobody wins, fallback to randomish
        }else if(tiebreakerId === PlayoffTiebreakerID.TotalPointsAgainst){
            winner = pointsAgainstTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;
            
            winner = headToHeadTiebreaker(sortedTeams, site, tiebreaker, tiebreakerId, allMatchups);
            if(winner)
                return winner;

            winner = pointsForTiebreaker(sortedTeams,  tiebreaker);
            if(winner)
                return winner;
                
            winner = intraDivisionTiebreaker(sortedTeams, tiebreaker);
            if(winner)
                return winner;
            
            //Nobody wins, fallback to randomish
        }
    }
    //Either we shouldn't be here or all tiebreakers failed
    return coinFlipTiebreaker(sortedTeams, tiebreaker);
}

const coinFlipTiebreaker = (sortedTeams: ITeam[], tiebreaker: string[]) : ITeam | undefined => {
    var winningTeam = sortedTeams.shift();
    if(winningTeam){
        //Set losers tiebreakers
        sortedTeams.forEach(team => {
            addTiebreakerToTeam(team, tiebreaker, "Lost coin flip tiebreaker to " + winningTeam?.teamName);
        });

        addTiebreakerToTeam(winningTeam, tiebreaker, "Won con flip tiebreaker");
        return winningTeam;
    }
}

const headToHeadTiebreaker = (teams: ITeam[], site: Site, tiebreaker: string[], tiebreakerId: PlayoffTiebreakerID, allMatchups: IMatchupItem[]) : ITeam | undefined  => {
    var headToHeadTeams: IHeadToHeadStandingsTeam[] = [];
    var totalTeams = teams.length;

    for(var i=0; i<teams.length; i++){
        var selectedTeam = teams[i]; 
        var otherTeams = teams.filter((team) => {
            return team.teamName !== selectedTeam.teamName;
        });
        var teamWins = 0;
		var teamLosses = 0;
		var teamTies = 0;

        for(var j=0; j<teams.length; j++){
            var matchup = allMatchups[j];

            if(matchup.awayTeamName === selectedTeam.teamName && otherTeams.find((team) => team.teamName === matchup.homeTeamName)){
                if (matchup.awayTeamWon) {
                    teamWins++;
                } else if (matchup.homeTeamWon) {
                    teamLosses++;
                } else if (matchup.tie) {
                    teamTies++;
                }
            }else if(matchup.homeTeamName === selectedTeam.teamName && otherTeams.find((team) => team.teamName === matchup.awayTeamName)){
                if (matchup.homeTeamWon) {
                    teamWins++;
                } else if (matchup.awayTeamWon) {
                    teamLosses++;
                } else if (matchup.tie) {
                    teamTies++;
                }
            }
        }
        var totalGames = teamWins + teamLosses + teamTies;
        var headToHeadTeam: IHeadToHeadStandingsTeam = {
            team: selectedTeam,
            totalGames: totalGames,
            winPercentage: (teamWins + (0.5) * teamTies) / Math.max((teamWins + teamLosses + teamTies), 1),
            wins: teamWins,
            losses: teamLosses,
            ties: teamTies
        };
        headToHeadTeams.push(headToHeadTeam);

    }
    
    var teamsWithMatchingGames = headToHeadTeams.filter((team) => {
        return team.totalGames === headToHeadTeams[0].totalGames;
    });

    //If all teams don't have the same number of games then we can't use head to head
    if(teamsWithMatchingGames.length !== headToHeadTeams.length){
        tiebreaker.push("Head to head tiebreaker cannot be used as all teams don't have the same amount of games against eachother");
        return undefined;
    }

    var bestRecordWinPercentage = Math.max(...headToHeadTeams.map(t => t.winPercentage));

    var teamsWithMatchingWinPercentage = headToHeadTeams.filter((team) => {
        return team.winPercentage === bestRecordWinPercentage;
    });

    var teamsWithoutMatchingWinPercentage = headToHeadTeams.filter((team) => {
        return team.winPercentage !== bestRecordWinPercentage;
    });

    //If more than one team has the same winning percentage then we can't use head to head
    if(teamsWithMatchingWinPercentage.length > 1){
        teamsWithoutMatchingWinPercentage.forEach((team)=> {
            addTiebreakerToTeam(team.team, tiebreaker, "Lost head to head tiebreaker due to multiple teams being " + teamsWithMatchingWinPercentage[0].wins + "-" + teamsWithMatchingWinPercentage[0].losses + "-" + teamsWithMatchingWinPercentage[0].ties + " compared to " + team.wins + "-" + team.losses + "-" + team.ties);
        
            var index = teams.findIndex((eachTeam) => {
                return team.team.teamName === eachTeam.teamName;
            });
            if(index > -1)
                teams.splice(index,1);
        });

        //line 368 doesnt seem needed

        var remainingTeamNames = teams.map((team) => team.teamName);

        var remainingText = "";
        //If there are multiple teams remaining and not all are moving on we have to restart the tiebreaking with the remaining teams
        if(totalTeams > 2 && totalTeams !== teams.length){
            remainingText = " Teams remaining: " + remainingTeamNames.join(', ') + ". Remaining teams will restart the tiebreaking process";
            tiebreaker.push(remainingText);
            return determineTieBreakersWinner(teams, site, tiebreaker, tiebreakerId, allMatchups);
        }

        tiebreaker.push("Head to head tiebreaker could not break the tie because multiple teams have the same head to head record." + remainingText);
		return undefined;
    }

    var bestRecordTeam = teamsWithMatchingWinPercentage[0].team;

    var loserStrings = teamsWithoutMatchingWinPercentage.map((team) => {
        return team.team.teamName + ": " + team.wins + "-" + team.losses + "-" + team.ties;
    });

    teamsWithoutMatchingWinPercentage.forEach((team) => {
        addTiebreakerToTeam(team.team, tiebreaker, "Lost head to head tiebreaker to " + bestRecordTeam.teamName + " with " + bestRecordTeam.wins + "-" + bestRecordTeam.losses + "-" + bestRecordTeam.ties + " record compared to " + team.wins + "-" + team.losses + "-" + team.ties);
    });


    addTiebreakerToTeam(bestRecordTeam, tiebreaker, "Won points for by having more points for than the specified team(s): " + loserStrings.join(', '));
    return bestRecordTeam;	

}

const pointsForTiebreaker = (teams: ITeam[], tiebreaker: string[]) : ITeam | undefined  => {
    var maxPointsFor = Math.max(...teams.map(t => t.pointsFor));

    var teamsWithPointValue = teams.filter((team) =>{
        return team.pointsFor === maxPointsFor
    });

    if(teamsWithPointValue.length === 1){
        var losers = teams.filter((team) => team.teamName !== teamsWithPointValue[0].teamName);
        var loserStrings = losers.map((team) => team.teamName + ": " + (teamsWithPointValue[0].pointsFor - team.pointsFor).toFixed(2));

        losers.forEach((team) => {
            var pointsForDiff = (teamsWithPointValue[0].pointsFor - team.pointsFor).toFixed(2);
            addTiebreakerToTeam(team, tiebreaker, "Lost points for tiebreaker to " + teamsWithPointValue[0].teamName + " by " + pointsForDiff + " points");
        });

        addTiebreakerToTeam(teamsWithPointValue[0], tiebreaker, "Won points for by having more points for than the specified team(s): " + loserStrings.join(', '));
		return teamsWithPointValue[0];	
    }
    //We couldn't use points for
    tiebreaker.push("Points for tiebreaker could not break the tie because multiple teams have the same points for.");
    return undefined;
}


const pointsAgainstTiebreaker = (teams: ITeam[], tiebreaker: string[]) : ITeam | undefined  => {
    var maxPointsAgainst = Math.max(...teams.map(t => t.pointsAgainst));

    var teamsWithPointValue = teams.filter((team) =>{
        return team.pointsAgainst === maxPointsAgainst
    });

    if(teamsWithPointValue.length === 1){
        var losers = teams.filter((team) => {
            return team.teamName !== teamsWithPointValue[0].teamName;
        });
        var loserStrings = losers.map((team) => {
            return team.teamName + ": " + (teamsWithPointValue[0].pointsAgainst - team.pointsAgainst).toFixed(2);
        });

        losers.forEach((team) => {
            var pointsAgainstDiff = (teamsWithPointValue[0].pointsAgainst - team.pointsAgainst).toFixed(2);
            addTiebreakerToTeam(team, tiebreaker, "Lost points against tiebreaker to " + teamsWithPointValue[0].teamName + " by " + pointsAgainstDiff + " points againsts");
        });

        addTiebreakerToTeam(teamsWithPointValue[0], tiebreaker, "Won points against by having more points against than the specified team(s): " + loserStrings.join(', '));
		return teamsWithPointValue[0];	
    }
    //We couldn't use points against
    tiebreaker.push("Points against tiebreaker could not break the tie because multiple teams have the same points against.");
    return undefined;
}

const intraDivisionTiebreaker = (teams: ITeam[], tiebreaker: string[]) : ITeam | undefined => {
    var sortedTeams = sortByDivisionWinPercentage(teams);
    
    var topTeams = sortedTeams.filter((team)=> {
        return team.divisionWinPercentage === sortedTeams[0].divisionWinPercentage;
    });

    if(topTeams.length === 1){
        var losers = teams.filter((team) => {
            return team.teamName !== topTeams[0].teamName;
        });
        var loserStrings = losers.map((team) => {
            return team.teamName + ": " + team.divisionWins + "-" + team.divisionLosses + "-" + team.divisionTies;
        });

        losers.forEach((team) => {
            addTiebreakerToTeam(team, tiebreaker, "Lost intradivision tiebreaker to " + topTeams[0].teamName + " " + topTeams[0].divisionWins + "-" + topTeams[0].divisionLosses + "-" + topTeams[0].divisionTies + " record compared to " + team.divisionWins + "-" + team.divisionLosses + "-" + team.divisionTies);
        });

        addTiebreakerToTeam(topTeams[0], tiebreaker, "Won intradivision tiebreaker by having a " + topTeams[0].divisionWins + "-" + topTeams[0].divisionLosses + "-" + topTeams[0].divisionTies + " record compared to " + loserStrings.join(', '));
		return topTeams[0];			
    }

    //We couldn't use intra division
    tiebreaker.push("Intra division record could not break the tie because multiple teams have the same record.");
    return undefined;
}

const sortByWinPercentage = (teams: ITeam[]) : ITeam[] => {
    teams.sort((a, b) => a.winPercentage > b.winPercentage ? 1 : -1);
    return teams.reverse();
}

const sortByDivisionWinPercentage = (teams: ITeam[]) : ITeam[] => {
    teams.sort((a, b) => a.divisionWinPercentage > b.divisionWinPercentage ? 1 : -1);
    return teams.reverse();
}

const getSiteFromString = (site: string) : Site => {
    if(site === "ESPN")
        return Site.ESPN;
    
    if (site === "Yahoo")
        return Site.Yahoo;

    if (site === "Sleeper")
        return Site.Sleeper;
    
    return Site.ESPN;
}

const generateTiebreakerObject = (teams: ITeam[]) : string[] => {
    var tiebreaker: string[] = [];
    tiebreaker.push("Tiebreaker between " + teams.map((team) => team.teamName).join(', '));
    return tiebreaker;
}

const getTiebreakerIdFromId = (tiebreakerId: number): PlayoffTiebreakerID => {
    switch(tiebreakerId) {
        case 0:
            return PlayoffTiebreakerID.HeadToHead;
        case 1:
            return PlayoffTiebreakerID.TotalPointsScored;
        case 2: 
            return PlayoffTiebreakerID.IntraDivisionRecord;
        case 3: 
            return PlayoffTiebreakerID.TotalPointsAgainst;
    }
    return PlayoffTiebreakerID.TotalPointsScored;
}

const addTiebreakerToTeam = (team: ITeam, tiebreaker: string[], tiebreakerToAdd: string) => {
    if(tiebreaker && team){
        var tiebreakerCopy = [...tiebreaker];
        tiebreakerCopy.push(tiebreakerToAdd);

        if(!team.tiebreakers){
            team.tiebreakers = [];
        }

        team.tiebreakers.push(tiebreakerCopy);
    }
}