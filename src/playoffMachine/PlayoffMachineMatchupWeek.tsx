import * as React from 'react';
import { IWeek } from '../models';
import PlayoffMachineMatchupRow from './PlayoffMachineMatchupRow';
import { Container } from 'react-bootstrap';

export interface IPlayoffMachineMatchupWeekProps {
    week: IWeek;
}

export default function PlayoffMachineMatchupWeek( {week}: IPlayoffMachineMatchupWeekProps) {
    return (
        
                <Container fluid>
                    {week.matchups.map((m, i) => <PlayoffMachineMatchupRow key={i} matchup={m}/>)}
                </Container>

    );
}