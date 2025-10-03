import React from 'react';
import { IChoppedPlayersResponse, IChoppedPlayerSummary } from '../models';
import { Row, Col, Form, Table, Badge } from 'react-bootstrap';

interface IChoppedPlayersViewProps {
    data: IChoppedPlayersResponse;
}

interface IChoppedPlayerStats {
    playerId: string;
    playerName: string;
    position: string;
    totalChops: number;
    weeklyChops: { [week: number]: number };
    leagues: string[];
}

export function ChoppedPlayersView({ data }: IChoppedPlayersViewProps) {
    const [selectedWeek, setSelectedWeek] = React.useState<number | 'all'>('all');
    const [sortBy, setSortBy] = React.useState<'chops' | 'name' | 'position'>('chops');
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

    // Filter players based on selected week
    const getFilteredPlayers = (): IChoppedPlayerSummary[] => {
        if (selectedWeek === 'all') {
            return data.choppedPlayers;
        }
        
        // Filter players to only show those who were chopped in the selected week
        return data.choppedPlayers.filter(player => 
            player.chopsByWeek[selectedWeek] && player.chopsByWeek[selectedWeek] > 0
        );
    };

    const filteredPlayers = getFilteredPlayers();

    // Get chop count for a player (either overall or week-specific)
    const getPlayerChopCount = (player: IChoppedPlayerSummary): number => {
        if (selectedWeek === 'all') {
            return player.totalChops;
        }
        return player.chopsByWeek[selectedWeek] || 0;
    };

    // Filter and sort players
    const filteredAndSortedPlayers = React.useMemo(() => {
        let filtered = [...filteredPlayers];

        // Sort players
        filtered.sort((a, b) => {
            let aValue: string | number;
            let bValue: string | number;

            switch (sortBy) {
                case 'chops':
                    aValue = getPlayerChopCount(a);
                    bValue = getPlayerChopCount(b);
                    break;
                case 'name':
                    aValue = a.playerName.toLowerCase();
                    bValue = b.playerName.toLowerCase();
                    break;
                case 'position':
                    aValue = a.position;
                    bValue = b.position;
                    break;
                default:
                    aValue = getPlayerChopCount(a);
                    bValue = getPlayerChopCount(b);
            }

            if (sortOrder === 'desc') {
                return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
            } else {
                return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
            }
        });

        return filtered;
    }, [filteredPlayers, selectedWeek, sortBy, sortOrder]);

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

    // Handle sort
    const handleSort = (column: 'chops' | 'name' | 'position') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (column: 'chops' | 'name' | 'position') => {
        if (sortBy !== column) return ' ↕️';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    if (data.choppedPlayers.length === 0) {
        return (
            <div>
                <h3>Chopped Players Analysis</h3>
                <div className="alert alert-info">
                    No chopped players data available.
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3>Chopped Players Analysis</h3>
            <p className="text-muted">
                Analysis of players who have been eliminated from guillotine leagues.
                {selectedWeek !== 'all' && ` Showing data for Week ${selectedWeek}.`}
            </p>

            {/* Metadata Summary */}
            <Row className="mb-4">
                <Col>
                    <div className="alert alert-light">
                        <strong>Data Summary:</strong> {data.metadata.totalChoppedPlayers} unique players chopped, {data.metadata.totalChops} total eliminations across {data.metadata.totalLeagues} leagues
                        <br />
                        <small className="text-muted">Last updated: {new Date(data.metadata.lastUpdated).toLocaleDateString()}</small>
                    </div>
                </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-4">
                <Col md={6}>
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
                <Col md={6}>
                    <Form.Label><strong>Showing:</strong></Form.Label>
                    <div className="mt-2">
                        {selectedWeek === 'all' ? (
                            <span className="text-muted">
                                Players chopped throughout the entire season
                            </span>
                        ) : (
                            <span className="text-muted">
                                Players chopped in Week {selectedWeek} only
                            </span>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Results Summary */}
            <Row className="mb-3">
                <Col>
                    <div className="alert alert-light">
                        <strong>Results:</strong> Showing {filteredAndSortedPlayers.length} players
                        {selectedWeek !== 'all' && (
                            <span> chopped in Week {selectedWeek}</span>
                        )}
                    </div>
                </Col>
            </Row>

            {/* Players Table */}
            <div className="table-responsive">
                <Table striped hover>
                    <thead>
                        <tr>
                            <th>#</th>
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
                                onClick={() => handleSort('chops')}
                            >
                                {selectedWeek === 'all' ? 'Total Chops' : `Week ${selectedWeek} Chops`}
                                {getSortIcon('chops')}
                            </th>
                            {selectedWeek === 'all' && (
                                <th>Leagues</th>
                            )}
                            <th>Weekly Breakdown</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredAndSortedPlayers.map((player, index) => (
                            <tr key={`${player.playerId}_${player.playerName}`}>
                                <td>
                                    <strong>{index + 1}</strong>
                                </td>
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
                                        {getPlayerChopCount(player)}
                                    </strong>
                                </td>
                                {selectedWeek === 'all' && (
                                    <td>
                                        <small className="text-muted">
                                            {player.leagueCount}
                                        </small>
                                    </td>
                                )}
                                <td>
                                    <small className="text-muted">
                                        {selectedWeek === 'all' ? (
                                            player.weeksChopped.sort((a, b) => a - b).join(', ')
                                        ) : (
                                            `Week ${selectedWeek}: ${getPlayerChopCount(player)}`
                                        )}
                                    </small>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Quick Stats */}
            <Row className="mt-4">
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Most Eliminated Players</h6>
                            {filteredAndSortedPlayers.slice(0, 5).map((player, index) => (
                                <div key={player.playerId} className="d-flex justify-content-between align-items-center mb-1">
                                    <span>
                                        {index + 1}. {player.playerName} 
                                        <Badge bg={getPositionColor(player.position)} className="ms-2">
                                            {player.position}
                                        </Badge>
                                    </span>
                                    <strong>{getPlayerChopCount(player)}</strong>
                                </div>
                            ))}
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Eliminations by Position</h6>
                            <div className="d-flex flex-wrap gap-2">
                                {Object.entries(data.positionBreakdown).map(([position, count]) => (
                                    <Badge key={position} bg={getPositionColor(position)} className="fs-6">
                                        {position}: {count}
                                    </Badge>
                                ))}
                            </div>
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Most Consistent Eliminations</h6>
                            {data.choppedPlayers
                                .filter(p => p.leagueCount > 1)
                                .sort((a, b) => b.averageChopsPerLeague - a.averageChopsPerLeague)
                                .slice(0, 5)
                                .map((player, index) => (
                                    <div key={player.playerId} className="d-flex justify-content-between align-items-center mb-1">
                                        <span>
                                            {index + 1}. {player.playerName}
                                            <Badge bg={getPositionColor(player.position)} className="ms-2">
                                                {player.position}
                                            </Badge>
                                        </span>
                                        <strong>{player.averageChopsPerLeague.toFixed(1)} avg/league</strong>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
