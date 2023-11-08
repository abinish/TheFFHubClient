import { useNavigate, useLocation } from 'react-router';
//import * as queryString from 'query-string';

export function AboutContainer() {
	let location = useLocation();
	const history = useNavigate();


	// if (loading) {
	// 	return <LoadingView />;
	// } else if (hasError) {
	// 	return <ErrorView />;
	// }
	return (
		<div>
			<h2>About TheFFHub</h2>
            <p>
                Welcome to The Fantasy Football Hub! Our mission is to provide a platform for free fantasy football stats. 
                We believe that everyone should have access to comprehensive and up-to-date statistics to make informed decisions 
                for their fantasy football teams. We're dedicated to continuously expanding our features to prevent anyone from needing to pay for fantasy football statistics.  I will NEVER ask for your password.  
				Any site that asks for a password to get data from ESPN, MFL, etc. without directing you to that site could be stealing your information.
            </p>

			<h2>Support</h2>
			<p>
				While we don't plan to charge for any features, you are welcome to support the site if you want at my <a href="https://www.buymeacoffee.com/hqzkyro">buy me a coffee</a> page.
			</p>

			<h2>Planned Features (with no timeline)</h2>
			<ul>
				<li>Login support</li>
				<li>Quick select playoff machine winners</li>
				<li>List all playoff scenarios</li>
				<li>Full fleaflicker support (need them to add api support for playoff teams and regular season weeks)</li>
				<li>MFL support (need MFL to improve security or public access to data)</li>
			</ul>
        </div>
	);
}
