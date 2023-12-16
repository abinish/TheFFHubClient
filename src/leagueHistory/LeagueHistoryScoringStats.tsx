import * as React from 'react';
import { ILeagueDetails } from '../models';
import { IManagerScoringStats } from './models';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';


export interface ILeagueHistoryScoringStatsRowProps {
    leagues: ILeagueDetails[];
}

export default function LeagueHistoryScoringStats( {leagues}: ILeagueHistoryScoringStatsRowProps) {

    var managersScoring = leagues.map(l => l.teams.map(t => t.teamManager)).flat().filter((v, i, a) => a.indexOf(v) === i).map(m => ({ manager: m, records: [], allTime: { season:'', scoresAgaisntInWins: [], scoresAgaisntInLosses: [], scoresInLosses: [], scoresInWins: []}, seasons: []  } as IManagerScoringStats));
    
    leagues.forEach(l => {
        l.completedSchedule.forEach(week => {
            week.matchups.forEach(matchup => {

                const awayTeamManager = managersScoring.find(m => m.manager === l.teams.find(t => t.teamName === matchup.awayTeamName)?.teamManager)!;
                const homeTeamManager = managersScoring.find(m => m.manager === l.teams.find(t => t.teamName === matchup.homeTeamName)?.teamManager)!;

                if(matchup.homeTeamWon){
                    awayTeamManager.allTime.scoresAgaisntInLosses.push(matchup.homeTeamScore);
                    awayTeamManager.allTime.scoresInLosses.push(matchup.awayTeamScore);

                    var awayTeamCurrentSeason = awayTeamManager.seasons.find(s => s.season === l.season);
                    if(!awayTeamCurrentSeason){
                        awayTeamCurrentSeason = {season: l.season, scoresAgaisntInLosses: [], scoresInLosses: [], scoresInWins: [], scoresAgaisntInWins: []};
                        awayTeamManager.seasons.push(awayTeamCurrentSeason);
                    }

                    awayTeamCurrentSeason.scoresAgaisntInLosses.push(matchup.homeTeamScore);
                    awayTeamCurrentSeason.scoresInLosses.push(matchup.awayTeamScore);


                    homeTeamManager.allTime.scoresAgaisntInWins.push(matchup.awayTeamScore);
                    homeTeamManager.allTime.scoresInWins.push(matchup.homeTeamScore);

                    var homeTeamCurrentSeason = homeTeamManager.seasons.find(s => s.season === l.season);
                    if(!homeTeamCurrentSeason){
                        homeTeamCurrentSeason = {season: l.season, scoresAgaisntInLosses: [], scoresInLosses: [], scoresInWins: [], scoresAgaisntInWins: []};
                        homeTeamManager.seasons.push(homeTeamCurrentSeason);
                    }

                    homeTeamCurrentSeason.scoresAgaisntInWins.push(matchup.awayTeamScore);
                    homeTeamCurrentSeason.scoresInWins.push(matchup.homeTeamScore);


                    //Handle record comparison
                    var awayTeamOpposingRecord = awayTeamManager.records.find(r => r.opposingManager === homeTeamManager.manager);
                    if(!awayTeamOpposingRecord){
                        awayTeamOpposingRecord = {opposingManager: homeTeamManager.manager, wins: 0, losses: 0, ties: 0, opposingManagerScores: [], managerScores: []};
                        awayTeamManager.records.push(awayTeamOpposingRecord);
                    }

                    awayTeamOpposingRecord.losses++;
                    awayTeamOpposingRecord.opposingManagerScores.push(matchup.homeTeamScore);
                    awayTeamOpposingRecord.managerScores.push(matchup.awayTeamScore);

                    var homeTeamOpposingRecord = homeTeamManager.records.find(r => r.opposingManager === awayTeamManager.manager);
                    if(!homeTeamOpposingRecord){
                        homeTeamOpposingRecord = {opposingManager: awayTeamManager.manager, wins: 0, losses: 0, ties: 0, opposingManagerScores: [], managerScores: []};
                        homeTeamManager.records.push(homeTeamOpposingRecord);
                    }

                    homeTeamOpposingRecord.wins++;
                    homeTeamOpposingRecord.opposingManagerScores.push(matchup.awayTeamScore);
                    homeTeamOpposingRecord.managerScores.push(matchup.homeTeamScore);

                }else if(matchup.awayTeamWon){
                    awayTeamManager.allTime.scoresAgaisntInWins.push(matchup.homeTeamScore);
                    awayTeamManager.allTime.scoresInWins.push(matchup.awayTeamScore);

                    var awayTeamCurrentSeason = awayTeamManager.seasons.find(s => s.season === l.season);
                    if(!awayTeamCurrentSeason){
                        awayTeamCurrentSeason = {season: l.season, scoresAgaisntInLosses: [], scoresInLosses: [], scoresInWins: [], scoresAgaisntInWins: []};
                        awayTeamManager.seasons.push(awayTeamCurrentSeason);
                    }

                    awayTeamCurrentSeason.scoresAgaisntInWins.push(matchup.homeTeamScore);
                    awayTeamCurrentSeason.scoresInWins.push(matchup.awayTeamScore);


                    homeTeamManager.allTime.scoresAgaisntInLosses.push(matchup.awayTeamScore);
                    homeTeamManager.allTime.scoresInLosses.push(matchup.homeTeamScore);

                    var homeTeamCurrentSeason = homeTeamManager.seasons.find(s => s.season === l.season);
                    if(!homeTeamCurrentSeason){
                        homeTeamCurrentSeason = {season: l.season, scoresAgaisntInLosses: [], scoresInLosses: [], scoresInWins: [], scoresAgaisntInWins: []};
                        homeTeamManager.seasons.push(homeTeamCurrentSeason);
                    }

                    homeTeamCurrentSeason.scoresAgaisntInLosses.push(matchup.awayTeamScore);
                    homeTeamCurrentSeason.scoresInLosses.push(matchup.homeTeamScore);


                    //Handle record comparison
                    var awayTeamOpposingRecord = awayTeamManager.records.find(r => r.opposingManager === homeTeamManager.manager);
                    if(!awayTeamOpposingRecord){
                        awayTeamOpposingRecord = {opposingManager: homeTeamManager.manager, wins: 0, losses: 0, ties: 0, opposingManagerScores: [], managerScores: []};
                        awayTeamManager.records.push(awayTeamOpposingRecord);
                    }

                    awayTeamOpposingRecord.wins++;
                    awayTeamOpposingRecord.opposingManagerScores.push(matchup.homeTeamScore);
                    awayTeamOpposingRecord.managerScores.push(matchup.awayTeamScore);


                    var homeTeamOpposingRecord = homeTeamManager.records.find(r => r.opposingManager === awayTeamManager.manager);
                    if(!homeTeamOpposingRecord){
                        homeTeamOpposingRecord = {opposingManager: awayTeamManager.manager, wins: 0, losses: 0, ties: 0, opposingManagerScores: [], managerScores: []};
                        homeTeamManager.records.push(homeTeamOpposingRecord);
                    }

                    homeTeamOpposingRecord.losses++;
                    homeTeamOpposingRecord.opposingManagerScores.push(matchup.awayTeamScore);
                    homeTeamOpposingRecord.managerScores.push(matchup.homeTeamScore);
                }else if(matchup.tie){
                    //Handle record comparison
                    var awayTeamOpposingRecord = awayTeamManager.records.find(r => r.opposingManager === homeTeamManager.manager);
                    if(!awayTeamOpposingRecord){
                        awayTeamOpposingRecord = {opposingManager: homeTeamManager.manager, wins: 0, losses: 0, ties: 0, opposingManagerScores: [], managerScores: []};
                        awayTeamManager.records.push(awayTeamOpposingRecord);
                    }

                    awayTeamOpposingRecord.ties++;
                    awayTeamOpposingRecord.opposingManagerScores.push(matchup.homeTeamScore);
                    awayTeamOpposingRecord.managerScores.push(matchup.awayTeamScore);

                    var homeTeamOpposingRecord = homeTeamManager.records.find(r => r.opposingManager === awayTeamManager.manager);
                    if(!homeTeamOpposingRecord){
                        homeTeamOpposingRecord = {opposingManager: awayTeamManager.manager, wins: 0, losses: 0, ties: 0, opposingManagerScores: [], managerScores: []};
                        homeTeamManager.records.push(homeTeamOpposingRecord);
                    }

                    homeTeamOpposingRecord.ties++;
                    homeTeamOpposingRecord.opposingManagerScores.push(matchup.awayTeamScore);
                    homeTeamOpposingRecord.managerScores.push(matchup.homeTeamScore);


                }
            })

        });


    });





    return (
        <div>
            <h3>Team Scoring Stats</h3>
            {
                managersScoring.map(m => 
                    <div key={m.manager}>
                        <h5>{m.manager}</h5>
                        <div>
                            <table  className="table">
                                <thead>
                                    <tr>
                                        <th>Timespan</th>
                                        <th>Wins</th>
                                        <th>Average Score in Wins</th>
                                        <th>Opponent Average Score in Wins</th>
                                        <th>Losses</th>
                                        <th>Average Score in Losses</th>
                                        <th>Opponent Average Score in Losses</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr key={m.manager+"-all"}>
                                        <td>All Time</td>
                                        <td>{m.allTime.scoresInWins.length}</td>

                                        <td>
                                            <OverlayTrigger placement='auto' overlay={(props)=> (
                                                <Tooltip  className='tooltip' id={`tooltip-${m.manager}`} {...props}>
                                                        {m.allTime.scoresInWins.sort((a,b) => a -b).map((t, i) =>
                                                            <div key={i}>
                                                                {t.toFixed(2)}
                                                            </div>
                                                        )}
                                                </Tooltip>
                                            )}>
                                                <span>{(m.allTime.scoresInWins.reduce((a,b) => a+b, 0) / m.allTime.scoresInWins.length).toFixed(2)}</span>
                                                </OverlayTrigger>
                                        </td>
                                        <td>
                                            <OverlayTrigger placement='auto' overlay={(props)=> (
                                                <Tooltip  className='tooltip' id={`tooltip-${m.manager}`} {...props}>
                                                        {m.allTime.scoresAgaisntInWins.sort((a,b) => a -b).map((t, i) =>
                                                            <div key={i}>
                                                                {t.toFixed(2)}
                                                            </div>
                                                        )}
                                                </Tooltip>
                                            )}>
                                                <span>{(m.allTime.scoresAgaisntInWins.reduce((a,b) => a+b, 0) / m.allTime.scoresAgaisntInWins.length).toFixed(2)}</span>
                                                </OverlayTrigger>
                                        </td>                                        
                                        <td>{m.allTime.scoresInLosses.length}</td>
                                        <td>
                                            <OverlayTrigger placement='auto' overlay={(props)=> (
                                                <Tooltip  className='tooltip' id={`tooltip-${m.manager}`} {...props}>
                                                        {m.allTime.scoresInLosses.sort((a,b) => a -b).map((t, i) =>
                                                            <div key={i}>
                                                                {t.toFixed(2)}
                                                            </div>
                                                        )}
                                                </Tooltip>
                                            )}>


                                            <span>{(m.allTime.scoresInLosses.reduce((a,b) => a+b, 0) / m.allTime.scoresInLosses.length).toFixed(2)}</span>
                                            </OverlayTrigger>
                                        </td>

                                        <td>
                                        <OverlayTrigger placement='auto' overlay={(props)=> (
                                            <Tooltip  className='tooltip' id={`tooltip-${m.manager}`} {...props}>
                                                    {m.allTime.scoresAgaisntInLosses.sort((a,b) => a -b).map((t, i) =>
                                                        <div key={i}>
                                                            {t.toFixed(2)}
                                                        </div>
                                                    )}
                                            </Tooltip>
                                        )}>


                                            <span>{(m.allTime.scoresAgaisntInLosses.reduce((a,b) => a+b, 0) / m.allTime.scoresAgaisntInLosses.length).toFixed(2)}</span>
                                            </OverlayTrigger>
                                        </td>
                                    </tr>
                                    {m.seasons.map(s =>
                                        <tr key={m.manager + s.season}>
                                            <td>{s.season}</td>
                                            <td>{s.scoresInWins.length}</td>

                                            <td>
                                                <OverlayTrigger placement='auto' overlay={(props)=> (
                                                    <Tooltip  className='tooltip' id={`tooltip-${m.manager}`} {...props}>
                                                            {s.scoresInWins.sort((a,b) => a -b).map((t, i) =>
                                                                <div key={i}>
                                                                    {t.toFixed(2)}
                                                                </div>
                                                            )}
                                                    </Tooltip>
                                                )}>


                                                <span>{(s.scoresInWins.reduce((a,b) => a+b, 0) / s.scoresInWins.length).toFixed(2)}</span>
                                                 </OverlayTrigger>
                                            </td>


                                            <td>
                                            <OverlayTrigger placement='auto' overlay={(props)=> (
                                                <Tooltip  className='tooltip' id={`tooltip-${m.manager}`} {...props}>
                                                        {s.scoresAgaisntInWins.sort((a,b) => a -b).map((t, i) =>
                                                            <div key={i}>
                                                                {t.toFixed(2)}
                                                            </div>
                                                        )}
                                                </Tooltip>
                                            )}>
                                                <span>{(s.scoresAgaisntInWins.reduce((a,b) => a+b, 0) / s.scoresAgaisntInWins.length).toFixed(2)}</span>                      
                                                </OverlayTrigger>
                                            </td>

                                            <td>{s.scoresInLosses.length}</td>
                                                        
                                            <td>
                                            <OverlayTrigger placement='auto' overlay={(props)=> (
                                                <Tooltip  className='tooltip' id={`tooltip-${m.manager}`} {...props}>
                                                        {s.scoresInLosses.sort((a,b) => a -b).map((t, i) =>
                                                            <div key={i}>
                                                                {t.toFixed(2)}
                                                            </div>
                                                        )}
                                                </Tooltip>
                                            )}>
                                                <span>{(s.scoresInLosses.reduce((a,b) => a+b, 0) / s.scoresInLosses.length).toFixed(2)}</span>
                                                </OverlayTrigger>
                                            </td>

                                            <td>
                                            <OverlayTrigger placement='auto' overlay={(props)=> (
                                                <Tooltip  className='tooltip' id={`tooltip-${m.manager}`} {...props}>
                                                        {s.scoresAgaisntInLosses.sort((a,b) => a -b).map((t, i) =>
                                                            <div key={i}>
                                                                {t.toFixed(2)}
                                                            </div>
                                                        )}
                                                </Tooltip>
                                            )}>
                                                <span>{(s.scoresAgaisntInLosses.reduce((a,b) => a+b, 0) / s.scoresAgaisntInLosses.length).toFixed(2)}</span>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            
            }
            <br/><br/>
            <h3>Record vs Each Owner</h3>
            {
                managersScoring.map(m => 
                    <div key={m.manager}>
                        <h5>{m.manager}</h5>
                        <div>
                            <table  className="table" style={{width:'50%'}}>
                                <thead>
                                    <tr>
                                        <th>Opponent</th>
                                        <th>Win Percentage</th>
                                        <th>Wins</th>
                                        <th>Losses</th>
                                        <th>Ties</th>
                                        <th>Average Score vs Opponent</th>
                                        <th>Opponent Average Score In Games</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {m.records.map(r =>
                                        <tr key={r.opposingManager}>
                                            <td>{r.opposingManager}</td>
                                            <td>{((r.wins + (0.5*r.ties)) / (r.wins + r.losses + r.ties)*100).toFixed(0) }%</td>
                                            <td>{r.wins}</td>
                                            <td>{r.losses}</td>
                                            <td>{r.ties}</td>

                                            <td>
                                            <OverlayTrigger placement='auto' overlay={(props)=> (
                                                <Tooltip  className='tooltip' id={`tooltip-${r.opposingManager}`} {...props}>
                                                        {r.managerScores.sort((a,b) => a -b).map((t, i) =>
                                                            <div key={i}>
                                                                {t.toFixed(2)}
                                                            </div>
                                                        )}
                                                </Tooltip>
                                            )}>


                                                <span>{(r.managerScores.reduce((a,b) => a+b, 0) / r.managerScores.length).toFixed(2)}</span>
                                                </OverlayTrigger>
                                            </td>
                                            <td>
                                            <OverlayTrigger placement='auto' overlay={(props)=> (
                                                <Tooltip  className='tooltip' id={`tooltipOp-${r.opposingManager}`} {...props}>
                                                        {r.opposingManagerScores.sort((a,b) => a -b).map((t, i) =>
                                                            <div key={i}>
                                                                {t.toFixed(2)}
                                                            </div>
                                                        )}
                                                </Tooltip>
                                            )}>


                                                <span>{(r.opposingManagerScores.reduce((a,b) => a+b, 0) / r.opposingManagerScores.length).toFixed(2)}</span>
                                                </OverlayTrigger>
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            
            }
        </div>
    )
}