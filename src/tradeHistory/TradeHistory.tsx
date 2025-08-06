import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import './TradeHistory.css';

interface Player {
  player_id: string;
  first_name: string;
  last_name: string;
  position: string;
  team: string;
}

interface League {
  league_id: string;
  name: string;
  season: string;
  previous_league_id: string;
}

interface Transaction {
  type: string;
  transaction_id: string;
  status: string;
  roster_ids: number[];
  adds: Record<string, number>;
  drops: Record<string, number>;
  creator: string;
  consenter_ids: number[];
  created: number; // Timestamp in milliseconds
  metadata: {
    notes?: string;
  };
  leg?: number;
  waiver_budget?: number;
  trade_ids?: string[];
  draft_picks?: {
    season: string;
    round: number;
    roster_id: number;
    previous_owner_id: number;
    owner_id: number;
  }[];
}

interface TradeDisplay {
  transactionId: string;
  date: string;
  managers: string[];
  playersAdded: {managerId: string, players: {playerId: string, name: string}[]}[];
  draftPicksByManager?: Record<number, {
    season: string, 
    round: number, 
    originalTeam: string, 
    pickNumber?: number,
    isFuturePick?: boolean // Make isFuturePick optional
  }[]>;
  notes?: string;
  leagueId: string;
  leagueName: string;
  season: string;
  tradeDate: Date; // Store the actual Date object for easier comparison
}

export const TradeHistory: React.FC = () => {
  const [searchParams] = useSearchParams();
  const leagueId = searchParams.get('leagueId');
  const [players, setPlayers] = useState<Record<string, Player>>({});
  const [leagues, setLeagues] = useState<League[]>([]);
  const [trades, setTrades] = useState<TradeDisplay[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch all players from Sleeper API
  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        // Check if players data is in sessionStorage and still valid
        const cachedTimestamp = sessionStorage.getItem('sleeper_players_timestamp');
        const currentTime = new Date().getTime();
        
        // Cache valid for 24 hours (86400000 ms)
        const cacheValid = cachedTimestamp && 
          (currentTime - parseInt(cachedTimestamp, 10)) < 86400000;
        
        if (cacheValid) {
          console.log('Using cached players data');
          
          // Load players data in chunks to avoid quota issues
          let allCachedPlayers: Record<string, Player> = {};
          let chunkIndex = 0;
          let chunkData: string | null;
          
          while ((chunkData = sessionStorage.getItem(`sleeper_players_chunk_${chunkIndex}`))) {
            const chunkPlayers = JSON.parse(chunkData);
            allCachedPlayers = { ...allCachedPlayers, ...chunkPlayers };
            chunkIndex++;
          }
          
          if (Object.keys(allCachedPlayers).length > 0) {
            setPlayers(allCachedPlayers);
            return;
          }
        }
        
        // If cache is invalid or doesn't exist, fetch from API
        console.log('Fetching players from API');
        const response = await fetch('https://api.sleeper.app/v1/players/nfl');
        if (!response.ok) {
          throw new Error('Failed to fetch players');
        }
        const fullData = await response.json();
        
        // Process the data to only keep essential fields
        const essentialPlayerData: Record<string, Player> = {};
        Object.entries(fullData).forEach(([playerId, playerData]: [string, any]) => {
          essentialPlayerData[playerId] = {
            player_id: playerId,
            first_name: playerData.first_name || '',
            last_name: playerData.last_name || '',
            position: playerData.position || '',
            team: playerData.team || ''
          };
        });
        
        // Save to sessionStorage in chunks to avoid quota issues
        // Each chunk is about 500KB (rough estimate)
        const playerIds = Object.keys(essentialPlayerData);
        const chunkSize = 1000; // Adjust based on testing
        
        // Clear existing chunks
        let existingChunkIndex = 0;
        while (sessionStorage.getItem(`sleeper_players_chunk_${existingChunkIndex}`)) {
          sessionStorage.removeItem(`sleeper_players_chunk_${existingChunkIndex}`);
          existingChunkIndex++;
        }
        
        // Store new chunks
        for (let i = 0; i < playerIds.length; i += chunkSize) {
          const chunk: Record<string, Player> = {};
          const chunkIds = playerIds.slice(i, i + chunkSize);
          
          chunkIds.forEach(id => {
            chunk[id] = essentialPlayerData[id];
          });
          
          try {
            sessionStorage.setItem(
              `sleeper_players_chunk_${Math.floor(i / chunkSize)}`, 
              JSON.stringify(chunk)
            );
          } catch (e) {
            console.warn('Storage quota exceeded for chunk, proceeding without caching this chunk', e);
            // Continue with the players we've already cached
            break;
          }
        }
        
        // Save timestamp
        sessionStorage.setItem('sleeper_players_timestamp', currentTime.toString());
        
        setPlayers(essentialPlayerData);
      } catch (err) {
        setError('Failed to load players. Please try again later.');
        console.error('Error fetching players:', err);
      }
    };

    fetchPlayers();
  }, []);

  // Fetch draft order for a specific league
  const fetchDraftOrder = async (leagueId: string, season: string) => {
    try {
      // First, get the league data to find the draft_id
      const leagueResponse = await fetch(`https://api.sleeper.app/v1/league/${leagueId}`);
      if (!leagueResponse.ok) {
        console.warn(`Failed to fetch league data for draft info: ${leagueId}`);
        return null;
      }
      
      const leagueData = await leagueResponse.json();
      if (!leagueData || !leagueData.draft_id) {
        console.warn(`No draft_id found in league data for: ${leagueId}`);
        return null;
      }
      
      const draftId = leagueData.draft_id;
      console.log(`Found draft_id: ${draftId} for league: ${leagueId}`);
      
      // Get the draft data which contains slot_to_roster_id mapping
      const draftResponse = await fetch(`https://api.sleeper.app/v1/draft/${draftId}`);
      if (!draftResponse.ok) {
        console.warn(`Failed to fetch draft data for draft_id: ${draftId}`);
        return null;
      }
      
      const draftData = await draftResponse.json();
      if (!draftData || !draftData.slot_to_roster_id) {
        console.warn(`No slot_to_roster_id found in draft data for: ${draftId}`);
        return null;
      }
      
      // Get the slot_to_roster_id mapping
      const slotToRosterId = draftData.slot_to_roster_id || {};
      console.log('slot_to_roster_id mapping:', slotToRosterId);
      
      // Create draft pick map
      const draftPickMap: Record<string, Array<{round: number, pick: number}>> = {};
      
      // Convert slot_to_roster_id mapping to roster_id -> draft position
      const rosterToSlot: Record<number, number> = {};
      
      // Invert the mapping: slot -> roster_id becomes roster_id -> slot
      Object.entries(slotToRosterId).forEach(([slotStr, rosterId]) => {
        const slot = parseInt(slotStr, 10);
        if (!isNaN(slot)) {
          // Javascript converts number to string when used as an object key
          rosterToSlot[rosterId as number] = slot; 
        }
      });
      
      // Now for each roster ID, we know their draft slot (1-based)
      Object.entries(rosterToSlot).forEach(([rosterIdStr, draftSlot]) => {
        const rosterId = parseInt(rosterIdStr, 10);
        if (!isNaN(rosterId)) {
          const key = `${season}_${rosterId}`;
          
          // Add an entry for this roster with their draft slot
          // The pick number is the same as the draft slot
          draftPickMap[key] = [{
            round: 1, // We only need one entry as the pick number is the same for all rounds
            pick: draftSlot
          }];
          
          console.log(`Added draft pick for roster ${rosterId} at slot ${draftSlot}`);
        }
      });
      
      return draftPickMap;
    } catch (err) {
      console.error('Error fetching draft order:', err);
      return null;
    }
  };

  // Fetch league information and transactions
  useEffect(() => {
    if (!leagueId) {
      setError('No league ID provided');
      setLoading(false);
      return;
    }

    const fetchLeaguesAndTrades = async () => {
      try {
        setLoading(true);
        let currentLeagueId = leagueId;
        const leagueChain: League[] = [];
        const allTrades: TradeDisplay[] = [];
        const draftPickMaps: Record<string, Record<string, Array<{round: number, pick: number}>>> = {};

        // Loop through league chain until previous_league_id is null or 0
        while (currentLeagueId && currentLeagueId !== '0') {
          // Get league info
          const leagueResponse = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}`);
          if (!leagueResponse.ok) {
            throw new Error(`Failed to fetch league with ID: ${currentLeagueId}`);
          }
          const leagueData: League = await leagueResponse.json();
          leagueChain.push(leagueData);

          // Get roster mapping (to match roster_id with user_id)
          const rosterResponse = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}/rosters`);
          if (!rosterResponse.ok) {
            throw new Error(`Failed to fetch rosters for league: ${currentLeagueId}`);
          }
          const rostersData = await rosterResponse.json();
          
          const rosterToOwnerMap: Record<number, string> = {};
          rostersData.forEach((roster: any) => {
            rosterToOwnerMap[roster.roster_id] = roster.owner_id;
          });

          // Get users mapping (to match user_id with display_name)
          const usersResponse = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}/users`);
          if (!usersResponse.ok) {
            throw new Error(`Failed to fetch users for league: ${currentLeagueId}`);
          }
          const usersData = await usersResponse.json();
          
          const userIdToNameMap: Record<string, string> = {};
          usersData.forEach((user: any) => {
            userIdToNameMap[user.user_id] = user.display_name;
          });

          // Get all transactions from all pages (1-18)
          let allTransactionsForLeague: Transaction[] = [];
          console.log(`Fetching transactions for league ${currentLeagueId}`);
          
          // Process up to 18 pages of transactions
          for (let page = 1; page <= 25; page++) {
            try {
              const transactionsResponse = await fetch(`https://api.sleeper.app/v1/league/${currentLeagueId}/transactions/${page}`);
              if (!transactionsResponse.ok) {
                // 404 means we've reached the end of available pages
                if (transactionsResponse.status === 404) {
                  console.log(`No more transaction pages available after page ${page-1}`);
                  break;
                }
                throw new Error(`Failed to fetch transactions for league: ${currentLeagueId}, page: ${page}`);
              }
              
              const pageTransactions: Transaction[] = await transactionsResponse.json();
              console.log(`Retrieved ${pageTransactions.length} transactions from page ${page}`);
              
              // If empty page, we've reached the end
              if (pageTransactions.length === 0) {
                console.log(`No more transactions on page ${page}`);
                break;
              }
              
              allTransactionsForLeague.push(...pageTransactions);
            } catch (err) {
              console.error(`Error fetching transactions page ${page}:`, err);
              // Continue with the pages we've already fetched
              break;
            }
          }
          
          // Filter for trades
          const tradeTransactions = allTransactionsForLeague.filter(transaction => transaction.type === 'trade');
          console.log(`Found ${tradeTransactions.length} trades in league ${currentLeagueId}`);
          
          // Always fetch draft data for the league regardless of whether there are trades 
          // This ensures we get draft data for the initial league as well as leagues with future picks
          console.log(`Fetching draft data for league ${currentLeagueId}`);
          const draftPickMap = await fetchDraftOrder(currentLeagueId, leagueData.season);
          if (draftPickMap) {
            draftPickMaps[currentLeagueId] = draftPickMap;
            console.log(`Draft data fetched successfully, keys: ${Object.keys(draftPickMap).length}`);
          } else {
            console.warn(`No draft data available for league ${currentLeagueId}`);
          }

          // Process trade transactions
          const tradesInLeague = tradeTransactions.map(trade => {
            const managers = trade.roster_ids.map(rosterId => {
              const userId = rosterToOwnerMap[rosterId];
              return userIdToNameMap[userId] || `Unknown Manager (${rosterId})`;
            });

            // Format epoch timestamp to correct readable date
            const tradeDate = new Date(trade.created);
            const formattedDate = `${tradeDate.getMonth() + 1}/${tradeDate.getDate()}/${tradeDate.getFullYear()}`;
            
            // Map roster IDs to their position in the managers array for easier reference
            const rosterIdToManagerIndex: Record<number, number> = {};
            trade.roster_ids.forEach((rosterId, index) => {
              rosterIdToManagerIndex[rosterId] = index;
            });
            
            const playersAdded = trade.roster_ids.map(rosterId => {
              const managerId = rosterToOwnerMap[rosterId];
              const playerAdds: {playerId: string, name: string}[] = [];
              
              if (trade.adds) {
                Object.entries(trade.adds).forEach(([playerId, addedRosterId]) => {
                  if (addedRosterId === rosterId) {
                    const player = players[playerId];
                    const playerName = player 
                      ? `${player.first_name} ${player.last_name}`
                      : `Unknown Player (${playerId})`;
                    playerAdds.push({ playerId, name: playerName });
                  }
                });
              }
              
              return {
                managerId,
                players: playerAdds
              };
            });
            
            // Process draft picks and map them to the correct receiving team
            const draftPicksByManagerIdx: Record<number, {season: string, round: number, originalTeam: string, pickNumber?: number}[]> = {};
            
            if (trade.draft_picks) {
              const draftPickMap = draftPickMaps[currentLeagueId];
              console.log(`Processing draft picks for trade ${trade.transaction_id}, draft pick map available:`, !!draftPickMap);
              
              trade.draft_picks.forEach(pick => {
                const ownerRosterId = pick.owner_id;
                const managerIndex = rosterIdToManagerIndex[ownerRosterId];
                
                if (managerIndex !== undefined) {
                  if (!draftPicksByManagerIdx[managerIndex]) {
                    draftPicksByManagerIdx[managerIndex] = [];
                  }
                  
                  // Use roster_id for original team name
                  const originalTeamName = userIdToNameMap[rosterToOwnerMap[pick.roster_id]] || `Team ${pick.roster_id}`;
                  
                  const draftPickInfo: {
                    season: string;
                    round: number;
                    originalTeam: string;
                    pickNumber?: number;
                  } = {
                    season: pick.season,
                    round: pick.round,
                    originalTeam: originalTeamName
                  };
                  
                  // Try to get pick numbers if draft data is available
                  if (draftPickMap) {
                    // Create the key using season and roster_id
                    const pickKey = `${pick.season}_${pick.roster_id}`;
                    console.log(`Looking up picks for key: ${pickKey}`);
                    
                    const picks = draftPickMap[pickKey];
                    if (picks && Array.isArray(picks)) {
                      // Use the pick number directly without matching on round
                      // For each roster, the pick number is the same for every round
                      if (picks.length > 0) {
                        // @ts-ignore
                        draftPickInfo.pickNumber = picks[0].pick;
                        console.log(`Found pick number ${picks[0].pick} for ${pick.season} round ${pick.round} from team ${originalTeamName}`);
                      }
                    } else {
                      console.log(`No picks array found for key ${pickKey} in current league draft data`);
                      
                      // Check if this pick might be from another league in the chain
                      // by looking through all the draft pick maps
                      Object.entries(draftPickMaps).forEach(([leagueId, leagueDraftMap]) => {
                        // Skip the current league since we already checked it
                        if (leagueId === currentLeagueId) return;
                        
                        const pickKey = `${pick.season}_${pick.roster_id}`;
                        const picks = leagueDraftMap[pickKey];
                        
                        if (picks && Array.isArray(picks) && picks.length > 0) {
                          // @ts-ignore
                          draftPickInfo.pickNumber = picks[0].pick;
                          console.log(`Found pick number ${picks[0].pick} for ${pick.season} round ${pick.round} from team ${originalTeamName} in league ${leagueId}`);
                        }
                      });
                      
                      // If still not found, try the alternate format as a last resort
                      if (!draftPickInfo.pickNumber) {
                        const alternateKey = `${pick.season}_${pick.round}_${pick.roster_id}`;
                        if (draftPickMap[alternateKey]) {
                          // @ts-ignore
                          draftPickInfo.pickNumber = draftPickMap[alternateKey];
                          console.log(`Found pick using alternate key ${alternateKey}`);
                        }
                      }
                    }
                  }
                  
                  draftPicksByManagerIdx[managerIndex].push(draftPickInfo);
                }
              });
            }

            return {
              transactionId: trade.transaction_id,
              date: formattedDate,
              managers,
              playersAdded,
              draftPicksByManager: draftPicksByManagerIdx,
              notes: trade.metadata?.notes,
              leagueId: currentLeagueId,
              leagueName: leagueData.name,
              season: leagueData.season,
              tradeDate
            };
          });

          allTrades.push(...tradesInLeague);
          
          // Move to previous league
          currentLeagueId = leagueData.previous_league_id;
        }

        setLeagues(leagueChain);
        setTrades(allTrades);
        setLoading(false);
      } catch (err) {
        setError('Failed to load league data. Please try again later.');
        console.error('Error fetching league data:', err);
        setLoading(false);
      }
    };

    fetchLeaguesAndTrades();
  }, [leagueId, players]);

  if (loading) {
    return <div className="loading">Loading trade history...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="trade-history-container">
      <h1>Trade History</h1>
      {leagueId ? (
        <>
          {leagues.length > 0 && (
            <div className="league-info">
              <h2>{leagues[0].name} - League Chain</h2>
              <div className="league-chain">
                {leagues.map((league, index) => (
                  <div key={league.league_id} className="league-chain-item">
                    {index > 0 && <span className="chain-arrow">→</span>}
                    <span>{league.season} Season</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {trades.length > 0 ? (
            <div className="trades-list">
              {trades.map(trade => (
                <div key={trade.transactionId} className="trade-card">
                  <div className="trade-header">
                    <span className="trade-date">{trade.date}</span>
                    <span className="trade-season">{trade.season} Season - {trade.leagueName}</span>
                  </div>
                  
                  <div className="trade-details">
                    <div className="trade-managers">
                      <div className="managers-title">Trade between:</div>
                      <div className="managers-list">
                        {trade.managers.map((manager, i) => (
                          <span key={i} className="manager-name">
                            {manager}
                            {i < trade.managers.length - 1 && " & "}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div className="trade-assets">
                      {trade.playersAdded.map((managerPlayers, i) => (
                        <div key={i} className="manager-assets">
                          <h4>{trade.managers[i]} received:</h4>
                          {managerPlayers.players.length > 0 ? (
                            <ul>
                              {managerPlayers.players.map(player => (
                                <li key={player.playerId}>{player.name}</li>
                              ))}
                            </ul>
                          ) : (
                            <p>No players received</p>
                          )}

                          {trade.draftPicksByManager && trade.draftPicksByManager[i] && trade.draftPicksByManager[i].length > 0 && (
                            <div className="draft-picks-section">
                              <h5>Draft Picks:</h5>
                              {trade.draftPicksByManager[i].map((pick, j) => (
                                <div key={j} className="draft-pick">
                                  {pick.pickNumber ? (
                                    // Show pick number if available
                                    `${pick.season} Round ${pick.round} Pick ${pick.pickNumber} (${pick.originalTeam})`
                                  ) : (
                                    // Just show season, round and team if pick number not available
                                    `${pick.season} Round ${pick.round} (${pick.originalTeam})`
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    {trade.notes && (
                      <div className="trade-notes">
                        <h4>Notes:</h4>
                        <p>{trade.notes}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="no-trades">No trades found for this league chain.</div>
          )}
        </>
      ) : (
        <p>No league ID provided. Please select a league to view trade history.</p>
      )}
    </div>
  );
};

export default TradeHistory;