import React from 'react';
import {useAuth } from '../contexts/useAuth';

const PublicPage = () => {
    const {user} = useAuth();
    console.log('user: ', user);

	return (
		<div>
			<h2> Public Page </h2>
            {user ? (<h2>Hello, {user.firstName}</h2> ) : null}
            
		</div>
	);
};

export default PublicPage;
