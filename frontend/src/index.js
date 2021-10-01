import React from 'react';
import ReactDOM from 'react-dom';
import './custom.scss';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

// import { AuthProvider } from './contexts/useAuth';

ReactDOM.render(
	<React.StrictMode>
		{/* <AuthProvider> */}
		<BrowserRouter>
			{/* <UserContextProvider> */}
				<App />
			{/* </UserContextProvider> */}
		</BrowserRouter>
		{/* </AuthProvider> */}
	</React.StrictMode>,
	document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

// Create page showing all available campsites for say, Hurricane River, first see if any sites are available at all, if not, show an alert button to create alert for that campground
// add image
