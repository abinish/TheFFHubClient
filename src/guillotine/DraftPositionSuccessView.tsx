import React from 'react';
import { IDraftPositionResponse, IDraftPositionByLeagueSize } from '../models';
import { Row, Col, Form, Table, Badge } from 'react-bootstrap';

interface IDraftPositionSuccessViewProps {
    data: IDraftPositionResponse;
}

export function DraftPositionSuccessView({ data }: IDraftPositionSuccessViewProps) {
    const [selectedLeagueSize, setSelectedLeagueSize] = React.useState<number | 'all'>('all');
    const [sortBy, setSortBy] = React.useState<'position' | 'avg' | 'median' | 'survivors'>('avg');
    const [sortOrder, setSortOrder] = React.useState<'asc' | 'desc'>('desc');

    // Get available league sizes
    const availableLeagueSizes = Object.keys(data.leagueSizes).map(size => parseInt(size)).sort((a, b) => a - b);

    // Get filtered data based on selected league size
    const getFilteredData = (): IDraftPositionByLeagueSize[] => {
        if (selectedLeagueSize === 'all') {
            // Combine all league sizes
            const combinedData = new Map<number, IDraftPositionByLeagueSize>();
            
            Object.values(data.leagueSizes).forEach(sizeData => {
                sizeData.forEach(positionData => {
                    const existing = combinedData.get(positionData.draftPosition);
                    if (existing) {
                        // Combine the data
                        existing.totalTeams += positionData.totalTeams;
                        existing.fullSeasonSurvivors += positionData.fullSeasonSurvivors;
                        
                        // Weighted average for survival stats
                        const totalWeight = existing.totalTeams + positionData.totalTeams;
                        existing.averageWeeksSurvived = 
                            (existing.averageWeeksSurvived * existing.totalTeams + 
                             positionData.averageWeeksSurvived * positionData.totalTeams) / totalWeight;
                        existing.medianWeeksSurvived = 
                            (existing.medianWeeksSurvived * existing.totalTeams + 
                             positionData.medianWeeksSurvived * positionData.totalTeams) / totalWeight;
                        
                        // Combine deaths by week
                        Object.entries(positionData.deathsByWeek).forEach(([week, count]) => {
                            existing.deathsByWeek[parseInt(week)] = (existing.deathsByWeek[parseInt(week)] || 0) + count;
                        });
                        
                        existing.shortestSurvival = Math.min(existing.shortestSurvival, positionData.shortestSurvival);
                        existing.longestSurvival = Math.max(existing.longestSurvival, positionData.longestSurvival);
                    } else {
                        combinedData.set(positionData.draftPosition, { ...positionData });
                    }
                });
            });
            
            return Array.from(combinedData.values());
        } else {
            return data.leagueSizes[selectedLeagueSize] || [];
        }
    };

    const filteredData = getFilteredData();

    // Sort filtered data
    const sortedData = React.useMemo(() => {
        const sorted = [...filteredData];
        sorted.sort((a, b) => {
            let aValue: number;
            let bValue: number;

            switch (sortBy) {
                case 'position':
                    aValue = a.draftPosition;
                    bValue = b.draftPosition;
                    break;
                case 'avg':
                    aValue = a.averageWeeksSurvived;
                    bValue = b.averageWeeksSurvived;
                    break;
                case 'median':
                    aValue = a.medianWeeksSurvived;
                    bValue = b.medianWeeksSurvived;
                    break;
                case 'survivors':
                    aValue = a.fullSeasonSurvivors;
                    bValue = b.fullSeasonSurvivors;
                    break;
                default:
                    aValue = a.averageWeeksSurvived;
                    bValue = b.averageWeeksSurvived;
            }

            if (sortOrder === 'desc') {
                return bValue - aValue;
            } else {
                return aValue - bValue;
            }
        });
        return sorted;
    }, [filteredData, sortBy, sortOrder]);

    // Handle sort
    const handleSort = (column: 'position' | 'avg' | 'median' | 'survivors') => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(column);
            setSortOrder('desc');
        }
    };

    const getSortIcon = (column: 'position' | 'avg' | 'median' | 'survivors') => {
        if (sortBy !== column) return ' ↕️';
        return sortOrder === 'asc' ? ' ↑' : ' ↓';
    };

    if (filteredData.length === 0) {
        return (
            <div>
                <h3>Draft Position Success Analysis</h3>
                <div className="alert alert-info">
                    No draft position data available.
                </div>
            </div>
        );
    }

    return (
        <div>
            <h3>Draft Position Success Analysis</h3>
            <p className="text-muted">
                Analysis of how draft position affects survival in guillotine leagues.
                {selectedLeagueSize !== 'all' && ` Showing data for ${selectedLeagueSize}-team leagues.`}
            </p>

            {/* Metadata Summary */}
            <Row className="mb-4">
                <Col>
                    <div className="alert alert-light">
                        <strong>Data Summary:</strong> {data.metadata.totalTeams} teams across {data.metadata.totalLeagues} leagues
                        <br />
                        <strong>League Sizes:</strong> {data.metadata.leagueSizes.join(', ')} teams
                        <br />
                        <small className="text-muted">Last updated: {new Date(data.metadata.lastUpdated).toLocaleDateString()}</small>
                    </div>
                </Col>
            </Row>

            {/* Filters */}
            <Row className="mb-4">
                <Col md={6}>
                    <Form.Label><strong>League Size:</strong></Form.Label>
                    <Form.Select 
                        value={selectedLeagueSize} 
                        onChange={(e) => setSelectedLeagueSize(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
                    >
                        <option value="all">All League Sizes</option>
                        {availableLeagueSizes.map(size => (
                            <option key={size} value={size}>{size} Teams</option>
                        ))}
                    </Form.Select>
                </Col>
                <Col md={6}>
                    <Form.Label><strong>Showing:</strong></Form.Label>
                    <div className="mt-2">
                        <span className="text-muted">
                            Draft position survival data for {selectedLeagueSize !== 'all' ? `${selectedLeagueSize}-team` : 'all'} leagues
                        </span>
                    </div>
                </Col>
            </Row>

            {/* Data Table */}
            <div className="table-responsive">
                <Table striped hover>
                    <thead>
                        <tr>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('position')}
                            >
                                Draft Position{getSortIcon('position')}
                            </th>
                            <th>Total Teams</th>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('avg')}
                            >
                                Avg Weeks Survived{getSortIcon('avg')}
                            </th>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('median')}
                            >
                                Median Weeks Survived{getSortIcon('median')}
                            </th>
                            <th>Survival Range</th>
                            <th 
                                style={{ cursor: 'pointer' }} 
                                onClick={() => handleSort('survivors')}
                            >
                                Full Season Survivors{getSortIcon('survivors')}
                            </th>
                            <th>Survival Rate</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((positionData) => {
                            const survivalRate = positionData.totalTeams > 0 ? 
                                (positionData.fullSeasonSurvivors / positionData.totalTeams) * 100 : 0;
                            
                            return (
                                <tr key={positionData.draftPosition}>
                                    <td>
                                        <strong>{positionData.draftPosition}</strong>
                                    </td>
                                    <td>{positionData.totalTeams}</td>
                                    <td>
                                        <strong>{positionData.averageWeeksSurvived.toFixed(1)}</strong>
                                    </td>
                                    <td>{positionData.medianWeeksSurvived.toFixed(1)}</td>
                                    <td>
                                        <small className="text-muted">
                                            {positionData.shortestSurvival} - {positionData.longestSurvival} weeks
                                        </small>
                                    </td>
                                    <td>
                                        <strong>{positionData.fullSeasonSurvivors}</strong>
                                    </td>
                                    <td>
                                        <Badge bg={survivalRate >= 20 ? 'success' : survivalRate >= 10 ? 'warning' : 'danger'}>
                                            {survivalRate.toFixed(1)}%
                                        </Badge>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </Table>
            </div>

            {/* Quick Stats */}
            <Row className="mt-4">
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Best Average Survival</h6>
                            {sortedData
                                .sort((a, b) => b.averageWeeksSurvived - a.averageWeeksSurvived)
                                .slice(0, 5)
                                .map((position, index) => (
                                    <div key={position.draftPosition} className="d-flex justify-content-between align-items-center mb-1">
                                        <span>
                                            {index + 1}. Position {position.draftPosition}
                                        </span>
                                        <strong>{position.averageWeeksSurvived.toFixed(1)} weeks</strong>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Most Full Season Survivors</h6>
                            {sortedData
                                .sort((a, b) => b.fullSeasonSurvivors - a.fullSeasonSurvivors)
                                .slice(0, 5)
                                .map((position, index) => (
                                    <div key={position.draftPosition} className="d-flex justify-content-between align-items-center mb-1">
                                        <span>
                                            {index + 1}. Position {position.draftPosition}
                                        </span>
                                        <strong>{position.fullSeasonSurvivors} survivors</strong>
                                    </div>
                                ))
                            }
                        </div>
                    </div>
                </Col>
                <Col md={4}>
                    <div className="card">
                        <div className="card-body">
                            <h6 className="card-title">Best Survival Rates</h6>
                            {sortedData
                                .sort((a, b) => {
                                    const aRate = a.totalTeams > 0 ? (a.fullSeasonSurvivors / a.totalTeams) * 100 : 0;
                                    const bRate = b.totalTeams > 0 ? (b.fullSeasonSurvivors / b.totalTeams) * 100 : 0;
                                    return bRate - aRate;
                                })
                                .slice(0, 5)
                                .map((position, index) => {
                                    const survivalRate = position.totalTeams > 0 ? 
                                        (position.fullSeasonSurvivors / position.totalTeams) * 100 : 0;
                                    return (
                                        <div key={position.draftPosition} className="d-flex justify-content-between align-items-center mb-1">
                                            <span>
                                                {index + 1}. Position {position.draftPosition}
                                            </span>
                                            <Badge bg={survivalRate >= 20 ? 'success' : 'warning'}>
                                                {survivalRate.toFixed(1)}%
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

