import { Alert } from 'react-bootstrap';

export default function DataShortageAlert() {
    return (
		<Alert key='warning' variant={'warning'} dismissible>
            Playoff odds may not have enough data to be accurate.  Expect high variances week to week until more weeks are completed.
        </Alert>
    )
}