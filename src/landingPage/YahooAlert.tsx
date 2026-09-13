import { Alert } from 'react-bootstrap';
import './Cards.css'



export default function YahooAlert() {
    return (
		<Alert key='warning' variant={'warning'} dismissible>
            Yahoo leagues are currently unavailable due to a change in Yahoo's API. I am working on getting access restored. If you have any questions please reach out to my reddit account justlikepudge.
        </Alert>
    )
}