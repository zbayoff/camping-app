import React from 'react';
import {useAuth } from '../contexts/useAuth';


const PrivatePage = () => {

    const {user} = useAuth();
    console.log('user: ', user);


	return (
		<div>
			<h2>Private Page</h2>
            
            {user ? (<h2>Hello, {user.firstName}</h2> ) : null}
            User Alerts: 

            fetch alerts
		</div>
	);
};

export default PrivatePage;
