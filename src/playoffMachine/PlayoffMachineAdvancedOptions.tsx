import React from 'react';
import Accordion from 'react-bootstrap/Accordion';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import { ILeagueDetails, ITeam } from '../models';





export interface IPlayoffMachineAdvancedOptionsProps {
    league: ILeagueDetails;
    handlePointsChange: (team: ITeam, pointsFor: number) => void;
}

export default function PlayoffMachineAdvancedOptions( {league, handlePointsChange}: IPlayoffMachineAdvancedOptionsProps) {

    


    

  return (
    <Accordion defaultActiveKey="1">
        <Accordion.Item eventKey="0">
            <Accordion.Header as={Card.Header}>
            Advanced Options
            </Accordion.Header>
            <Accordion.Body>
                {league.teams.map((team) => (
                    <div>
                        <span style={{marginTop: 100}}>{team.teamName}: </span><br />
                        <input type="number" value={team.pointsFor} onChange={s=> handlePointsChange(team, parseFloat(s.target.value))} name='pointsFor'/> <br />
                    </div>
                ))}
            </Accordion.Body>
        </Accordion.Item>
    </Accordion>
  );
};
