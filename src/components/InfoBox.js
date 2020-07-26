import React from 'react';
import { Card, CardContent, Typography } from '@material-ui/core';
import './InfoBox.css';

function InfoBox({ title, cases, total, active, onClick, isRed }) {
	return (
		<Card
			className={`infoBox ${active && 'infoBox--selected'} ${
				isRed && active && 'infoBox--red'
			} `}
			onClick={onClick}
		>
			<CardContent>
				<Typography className='infoBox__title' color='textSecondary'>
					{title}
				</Typography>
				<h2 className={`infoBox__cases ${!isRed && 'infoBox__cases--green'}`}>
					{cases}
				</h2>
				<Typography className='infoBox__total' color='textSecondary'>
					{total} Total
				</Typography>
			</CardContent>
		</Card>
	);
}

export default InfoBox;
