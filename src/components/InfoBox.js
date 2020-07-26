import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';

function InfoBox({ title, cases, total }) {
	return (
		<Card className='info_box'>
			<CardContent>
				<Typography className='info_box__title' color='textSecondary'>
					{title}
				</Typography>
				<h2 className='info_box__cases'>{cases}</h2>
				<Typography className='info_box__total' color='textSecondary'>
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
