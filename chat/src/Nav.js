import React from 'react';
import useCollection from './useCollection';
import { firebase } from './firebase';
import { Link } from '@reach/router';

const Nav = ({ user }) => {
	const channels = useCollection('channels');

	return (
		<div className="Nav">
			<div className="User">
				<img className="UserImage" alt="whatever" src={user.photoUrl} />
				<div>
					<div>{user.dislayName}</div>
					<div>
						<button
							onClick={() => {
								firebase.auth().signOut();
							}}
							className="text-button"
						>
							log out
						</button>
					</div>
				</div>
			</div>
			<nav className="ChannelNav">
				{channels.map(channel => (
					<Link key={channel.id} to={`/channel/${channel.id}`}>
						# {channel.id}
					</Link>
				))}
			</nav>
		</div>
	);
};

export default Nav;
