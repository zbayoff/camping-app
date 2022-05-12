import React from 'react';
import ReactDOM from 'react-dom';
import App from './containers/App/App';
import { BrowserRouter } from 'react-router-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { datadogRum } from '@datadog/browser-rum';

console.log('process.env.HEROKU_RELEASE_VERSION: ', process.env.HEROKU_RELEASE_VERSION)

datadogRum.init({
	applicationId: '8431fa34-0dc3-4da0-bc0e-8e32c50a3418',
	clientToken: 'pub5d2ec4cb918f9309a6a4153f7e943fb6',
	site: 'datadoghq.com',
	service: 'camping_app',
	// Specify a version number to identify the deployed version of your application in Datadog
	version: process.env.HEROKU_RELEASE_VERSION,
	sampleRate: 100,
	trackInteractions: true,
	defaultPrivacyLevel: 'mask-user-input',
});

datadogRum.startSessionReplayRecording();

ReactDOM.render(
	<React.StrictMode>
		<CssBaseline />
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById('root')
);
