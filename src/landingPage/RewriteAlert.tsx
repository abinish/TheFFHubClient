import { Alert } from 'react-bootstrap';
import './Cards.css'



export default function RewriteAlert() {
    return (
		<Alert key='warning' variant={'warning'} dismissible>
            TheFFHub has been completely rewritten to better support the future of the site.  This will allow me to add new features to the site but unfortunately, this means there may be some bugs.  If you notice any issues please reach out to my reddit account justlikepudge.
        </Alert>
    )
}