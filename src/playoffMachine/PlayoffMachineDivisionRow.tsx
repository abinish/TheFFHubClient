import * as React from 'react';
import { ITeam } from '../models';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfo } from '@fortawesome/free-solid-svg-icons';
import './PlayoffMachine.css';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

export interface IPlayoffMachineDivisionRowProps {
    team: ITeam;
    isPlayoffTeam: boolean;
}

export default function PlayoffMachineDivisionRow( {team, isPlayoffTeam}: IPlayoffMachineDivisionRowProps) {


    const renderTooltip = (team: ITeam) => {
        if(team.tiebreakers.length === 0) return (<></>)

        return (
            <OverlayTrigger overlay={(props)=> (
                <Tooltip  className='tooltip' id={`tooltip-${team.teamName}`} {...props}>
                        {team.tiebreakers.map((t, i) => 
                            <div  key={i}>
                                {t.map((x,y)=> 
                                    <div key={y} style={{fontSize: 12, whiteSpace: 'nowrap', textAlign:'left'}}>
                                        {x}
                                    </div>)}
                                    <br/>
                                </div>)}
                </Tooltip>
            )}>
                <FontAwesomeIcon icon={faInfo} size='sm' className='tiebreakerIcon' />
            </OverlayTrigger>
        )
    }   

    const getStyle = (isPlayoffTeam: boolean) => {
        if(isPlayoffTeam)
            return 'playoffTeam'
        
        return ''
    }

    return (
        <tr className={getStyle(isPlayoffTeam)}>
            <td>{team.teamName}{renderTooltip(team)}</td>
            <td>{team.wins}</td>
            <td>{team.losses}</td>
            <td>{team.ties}</td>
		</tr>
    )
}