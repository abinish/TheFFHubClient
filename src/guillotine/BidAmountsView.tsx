import React from 'react';
import { IBidAmountsResponse, IPlayerBidSummary } from '../models';
import { Row, Col, Form, Table, Badge } from 'react-bootstrap';

interface IBidAmountsViewProps {
    data: IBidAmountsResponse;
}

export function BidAmountsView({ data }: IBidAmountsViewProps) {
    const [selectedWeek, setSelectedWeek] = React.useState<number | 'all'>('all');
    const [bidFilter, setBidFilter] = React.useState<'all' | 'won'>('won');
    const [sortBy, setSortBy] = React.useState<'name' | 'position' | 'avgBid' | 'highBid' | 'lowBid' | 'winRate'>('avgBid');
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');
    const [budgetFilter, setBudgetFilter] = React.useState<'percentage' | 'dollar'>('percentage');
    const [leagueBudget, setLeagueBudget] = React.useState<number>(1000);

    // Filter players based on selected week
    const getFilteredPlayers = (): IPlayerBidSummary[] => {
        if (selectedWeek === 'all') {
            return data.playerBids;
        }
        
        // Filter players to only show those who have data for the selected week
        return data.playerBids.filter(player => 
            player.weeklyData[selectedWeek] && 
            (bidFilter === 'all' ? player.weeklyData[selectedWeek].totalBids > 0 : player.weeklyData[selectedWeek].wonBidsCount > 0)
        );
    };

    const filteredPlayers = getFilteredPlayers();

    // Get stats for a player (either overall or week-specific)
    const getPlayerStats = (player: IPlayerBidSummary) => {
        if (selectedWeek === 'all') {
            return player;
        }
        
        const weekData = player.weeklyData[selectedWeek];
        if (!weekData) return null;
        
        return {
            ...player,
            averageAllBids: weekData.averageAllBids,
            highestAllBid: weekData.highestAllBid,
            lowestAllBid: weekData.lowestAllBid,
            totalBids: weekData.totalBids,
            averageWinningBid: weekData.averageWinningBid,
            highestWinningBid: weekData.highestWinningBid,
            lowestWinningBid: weekData.lowestWinningBid,
            wonBidsCount: weekData.wonBidsCount,
            winRate: weekData.winRate
        };
    };

    // Filter and sort players
    const filteredAndSortedPlayers = React.useMemo(() => {
        let filtered = filteredPlayers.map(getPlayerStats).filter(p => p !== null) as IPlayerBidSummary[];

        // Filter by bid type (won bids only vs all bids)
        if (bidFilter === 'won') {
            filtered = filtered.filter(player => player.wonBidsCount > 0);
        } else {
            filtered = filtered.filter(player => player.totalBids > 0);
        }

        // Sort players
        filtered.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortBy) {
                case 'name':
                    aValue = a.playerName.toLowerCase();
                    bValue = b.playerName.toLowerCase();
                    break;
                case 'position':
                    aValue = a.position;
                    bValue = b.position;
                    break;
                case 'avgBid':
                    aValue = bidFilter === 'won' ? a.averageWinningBid : a.averageAllBids;
                    bValue = bidFilter === 'won' ? b.averageWinningBid : b.averageAllBids;
                    break;
                case 'highBid':
                    aValue = bidFilter === 'won' ? a.highestWinningBid : a.highestAllBid;
                    bValue = bidFilter === 'won' ? b.highestWinningBid : b.highestAllBid;
                    break;
                case 'lowBid':
                    aValue = bidFilter === 'won' ? a.lowestWinningBid : a.lowestAllBid;
                    bValue = bidFilter === 'won' ? b.lowestWinningBid : b.lowestAllBid;
                    break;
                case 'winRate':
                    aValue = a.winRate;
                    bValue = b.winRate;
                    break;
                default:
                    aValue = bidFilter === 'won' ? a.averageWinningBid : a.averageAllBids;
                    bValue = bidFilter === 'won' ? b.averageWinningBid : b.averageAllBids;
            }

            if (sortOrder === 'desc') {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });

        return filtered;
    }, [filteredPlayers, bidFilter, sortBy, sortOrder, selectedWeek]);

    // Get position color
    const getPositionColor = (position: string): string => {
        switch (position.toUpperCase()) {
            case 'QB': return 'primary';
            case 'RB': return 'success';
            case 'WR': return 'info';
            case 'TE': return 'warning';
            case 'K': return 'secondary';
            case 'DEF': case 'DST': return 'dark';
            default: return 'light';
        }
    };

    // Format bid based on budget filter
    const formatBid = (amount: number): string => {
        if (budgetFilter === 'percentage') {
            return `${amount.toFixed(1)}%`;
        } else {
            // amount is already a percentage, so convert to dollar amount
            const dollarAmount = (amount / 100) * leagueBudget;
            return `$${dollarAmount.toFixed(0)}`;
        }
    };

    // Handle sort
    const handleSort = (column: 'name' | 'position' | 'avgBid' | 'highBid' | 'lowBid' | 'winRate') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (column: 'name' | 'position' | 'avgBid' | 'highBid' | 'lowBid' | 'winRate') => {
        if (sortBy !== column) return ' ↕️';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    if (data.playerBids.length === 0) {
        return (
            <div>
                <h3>Bid Amounts Analysis</h3>
                <div className="alert alert-info">
                    No bidding data available.
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3>Bid Amounts Analysis</h3>
            <p className="text-muted">
                Analysis of bidding patterns and amounts across {data.metadata.totalLeagues} leagues.
                {selectedWeek !== 'all' && ` Showing data for Week ${selectedWeek}.`}
            </p>

            {/* Metadata Summary */}
            <Row className="mb-4">
                <Col>
                    <div className="alert alert-light">
                        <strong>Data Summary:</strong> {data.metadata.totalPlayers} players, {data.metadata.totalBids} total bids across {data.metadata.totalLeagues} leagues
                        <br />
                        <small className="text-muted">Last updated: {new Date(data.metadata.lastUpdated).toLocaleDateString()}</small>
                    </div>
                </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-4">
                <Col md={4}>
                    <Form.Label><strong>Time Period:</strong></Form.Label>
                    <Form.Select 
                        value={selectedWeek} 
                        onChange={(e) => setSelectedWeek(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    >
                        <option value="all">All Weeks</option>
                        {data.availableWeeks.map(week => (
                            <option key={week} value={week}>Week {week}</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Label><strong>Bid Type:</strong></Form.Label>
                    <Form.Select 
                        value={bidFilter} 
                        onChange={(e) => setBidFilter(e.target.value as 'all' | 'won')}
                    >
                        <option value="won">Won Bids Only</option>
                        <option value="all">All Bids</option>
                    </Form.Select>
                </Col>
                <Col md={4}>
                    <Form.Label><strong>Showing:</strong></Form.Label>
                    <div className="mt-2">
                        <span className="text-muted">
                            {bidFilter === 'won' ? 'Players with winning bids' : 'All players with bids'}
                            {selectedWeek !== 'all' && ` in Week ${selectedWeek}`}
                        </span>
                    </div>
                </Col>
            </Row>

            {/* Budget Filter Controls */}
            <Row className="mb-3">
                <Col md={4}>
                    <Form.Label><strong>Display Format:</strong></Form.Label>
                    <Form.Select 
                        value={budgetFilter} 
                        onChange={(e) => setBudgetFilter(e.target.value as 'percentage' | 'dollar')}
                    >
                        <option value="percentage">% of Budget</option>
                        <option value="dollar">Dollar Amount</option>
                    </Form.Select>
                </Col>
                {budgetFilter === 'dollar' && (
                    <Col md={4}>
                        <Form.Label><strong>League Budget:</strong></Form.Label>
                        <Form.Control
                            type="number"
                            value={leagueBudget}
                            onChange={(e) => setLeagueBudget(parseInt(e.target.value) || 1000)}
                            min="1"
                            max="1000"
                        />
                    </Col>
                )}
                <Col md={budgetFilter === 'dollar' ? 4 : 8}>
                    <Form.Label><strong>Note:</strong></Form.Label>
                    <div className="mt-2">
                        <span className="text-muted">
                            {budgetFilter === 'percentage' 
                                ? 'Values shown as percentage of total budget' 
                                : `Values calculated based on $${leagueBudget} budget`
                            }
                        </span>
                    </div>
                </Col>
            </Row>

            {/* Results Summary */}
            <Row className="mb-3">
                <Col>
                    <div className="alert alert-light">
                        <strong>Results:</strong> Showing {filteredAndSortedPlayers.length} players
                        {bidFilter === 'won' ? ' with winning bids' : ' with bids'}
                        {selectedWeek !== 'all' && ` in Week ${selectedWeek}`}
                    </div>
                </Col>
            </Row>

            {/* Bid Table */}
            <div className="table-responsive">
                <Table striped hover>
                    <thead>
                        <tr>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('name')}
                            >
                                Player Name{getSortIcon('name')}
                            </th>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('position')}
                            >
                                Position{getSortIcon('position')}
                            </th>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('avgBid')}
                            >
                                Average {bidFilter === 'won' ? 'Winning' : ''} Bid{budgetFilter === 'percentage' ? ' (%)' : ' ($)'}{getSortIcon('avgBid')}
                            </th>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('highBid')}
                            >
                                Highest {bidFilter === 'won' ? 'Winning' : ''} Bid{budgetFilter === 'percentage' ? ' (%)' : ' ($)'}{getSortIcon('highBid')}
                            </th>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('lowBid')}
                            >
                                Lowest {bidFilter === 'won' ? 'Winning' : ''} Bid{budgetFilter === 'percentage' ? ' (%)' : ' ($)'}{getSortIcon('lowBid')}
                            </th>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('winRate')}
                            >
                                Win Rate{getSortIcon('winRate')}
                            </th>
                            <th>Total Bids</th>
                            <th>Leagues</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedPlayers.slice(0, 100).map((player) => (
                            <tr key={`${player.playerId}_${player.playerName}`}>
                                <td>
                                    <strong>{player.playerName}</strong>
                                </td>
                                <td>
                                    <Badge bg={getPositionColor(player.position)}>
                                        {player.position}
                                    </Badge>
                                </td>
                                <td>
                                    <strong>
                                        {formatBid(bidFilter === 'won' ? player.averageWinningBid : player.averageAllBids)}
                                    </strong>
                                </td>
                                <td>
                                    {formatBid(bidFilter === 'won' ? player.highestWinningBid : player.highestAllBid)}
                                </td>
                                <td>
                                    {formatBid(bidFilter === 'won' ? player.lowestWinningBid : player.lowestAllBid)}
                                </td>
                                <td>
                                    <Badge bg={player.winRate >= 50 ? 'success' : player.winRate >= 25 ? 'warning' : 'danger'}>
                                        {player.winRate.toFixed(1)}%
                                    </Badge>
                                </td>
                                <td>
                                    <small className="text-muted">
                                        {player.totalBids} total / {player.wonBidsCount} won
                                    </small>
                                </td>
                                <td>
                                    <small className="text-muted">
                                        {player.leagueCount}
                                    </small>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {filteredAndSortedPlayers.length > 100 && (
                <div className="text-center mt-3">
                    <small className="text-muted">
                        Showing top 100 results. Total: {filteredAndSortedPlayers.length} players.
                    </small>
                </div>
            )}

            {/* Quick Stats */}
            <Row className="mt-4">
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Highest Average {bidFilter === 'won' ? 'Winning' : ''} Bids {budgetFilter === 'percentage' ? '(%)' : '($)'}</h6>
                            {filteredAndSortedPlayers.slice(0, 5).map((player, index) => (
                                <div key={player.playerId} className="d-flex justify-content-between align-items-center mb-1">
                                    <span>
                                        {index + 1}. {player.playerName} 
                                        <Badge bg={getPositionColor(player.position)} className="ms-2">
                                            {player.position}
                                        </Badge>
                                    </span>
                                    <strong>
                                        {formatBid(bidFilter === 'won' ? player.averageWinningBid : player.averageAllBids)}
                                    </strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Most Contested Players</h6>
                            {filteredPlayers
                                .filter(p => {
                                    const stats = getPlayerStats(p);
                                    return stats && stats.totalBids > 1;
                                })
                                .sort((a, b) => {
                                    const aStats = getPlayerStats(a);
                                    const bStats = getPlayerStats(b);
                                    return (bStats?.totalBids || 0) - (aStats?.totalBids || 0);
                                })
                                .slice(0, 5)
                                .map((player, index) => {
                                    const stats = getPlayerStats(player);
                                    return (
                                        <div key={player.playerId} className="d-flex justify-content-between align-items-center mb-1">
                                            <span>
                                                {index + 1}. {player.playerName}
                                                <Badge bg={getPositionColor(player.position)} className="ms-2">
                                                    {player.position}
                                                </Badge>
                                            </span>
                                            <strong>{stats?.totalBids} bids</strong>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Best Win Rates</h6>
                            {filteredPlayers
                                .filter(p => {
                                    const stats = getPlayerStats(p);
                                    return stats && stats.totalBids >= 3; // Only players with at least 3 bids
                                })
                                .sort((a, b) => {
                                    const aStats = getPlayerStats(a);
                                    const bStats = getPlayerStats(b);
                                    return (bStats?.winRate || 0) - (aStats?.winRate || 0);
                                })
                                .slice(0, 5)
                                .map((player, index) => {
                                    const stats = getPlayerStats(player);
                                    return (
                                        <div key={player.playerId} className="d-flex justify-content-between align-items-center mb-1">
                                            <span>
                                                {index + 1}. {player.playerName}
                                                <Badge bg={getPositionColor(player.position)} className="ms-2">
                                                    {player.position}
                                                </Badge>
                                            </span>
                                            <Badge bg={(stats?.winRate || 0) >= 50 ? 'success' : 'warning'}>
                                                {stats?.winRate.toFixed(1)}%
                                            </Badge>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
