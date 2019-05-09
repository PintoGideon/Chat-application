import React, { useEffect } from 'react';
import ChannelInfo from './ChannelInfo';
import Messages from './Messages';
import ChatInput from './ChatInput';
import Members from './Members';
import { db } from './firebase';

const Channel = ({ user, channelId }) => {
	useEffect(() => {
		db.doc(`users/${user.uid}`).update({
			[`channels.${channelId}`]: true
		});
	}, [user.uid, channelId]);

	return (
		<div className="Channel">
			<div className="ChannelMain">
				<ChannelInfo channelId={channelId} />
				<Messages channelId={channelId} />
				<ChatInput channelId={channelId} user={user} />
			</div>
			<div className="Members">
				<Members channelId={channelId} />
			</div>
		</div>
	);
};

export default Channel;
