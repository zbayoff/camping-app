import { Route, BrowserRouter } from 'react-router-dom';
import './App.css';
// import Navbar from './components/Navbar';
import PrivatePage from './components/PrivatePage';
import PublicPage from './components/PublicPage';
import PrivateRoute from './components/PrivateRoute'
import Alerts from './components/Alerts';

import Home from './components/Home'

function App() {
	return (
		<div className="App">
			<BrowserRouter>
				<Route exact path="/" component={Home} />
				<Route exact path="/alerts" component={Alerts} />
				{/* <Route path="/private" component={PrivatePage} />
				<Route path="/private" component={PrivatePage} /> */}
				{/* <PrivateRoute component={Alerts} path="/alerts" exact /> */}
			</BrowserRouter>
		</div>
	);
}

export default App;
