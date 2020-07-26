import React, { useEffect, useState } from 'react';
import {
	FormControl,
	Select,
	MenuItem,
	Card,
	CardContent,
} from '@material-ui/core';
import './App.css';
import InfoBox from './components/InfoBox';
import Map from './components/Map';
import Table from './components/Table';
import { sortData } from './services/utils';
const BASE_URL = 'https://disease.sh/v3';

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	useEffect(() => {
		fetch(BASE_URL + '/covid-19/all')
			.then((response) => response.json())
			.then((data) => setCountryInfo(data));
	}, []);

	useEffect(() => {
		const getCountriesData = async () => {
			await fetch(BASE_URL + '/covid-19/countries')
				.then((response) => response.json())
				.then((data) => {
					const countries = data.map((country) => ({
						name: country.country,
						value: country.countryInfo.iso2,
						id: country.countryInfo._id,
					}));
					const sortedData = sortData(data);
					setTableData(sortedData);
					setCountries(countries);
				});
		};
		getCountriesData();
	}, []);

	const onCountryChange = async (event) => {
		const countryCode = event.target.value;

		const url =
			countryCode === 'worldwide'
				? `${BASE_URL}/covid-19/all`
				: `${BASE_URL}/covid-19/countries/${countryCode}`;

		await fetch(url)
			.then((response) => response.json())
			.then((data) => {
				setCountry(countryCode);
				setCountryInfo(data);
			});
	};

	return (
		<div className='app'>
			<div className='app__left'>
				<div className='app__header'>
					<h1>COIVD-19 TRACKER</h1>
					<FormControl className='app__dropdown'>
						<Select
							variant='outlined'
							value={country}
							onChange={onCountryChange}
						>
							<MenuItem key='worldwide' value='worldwide'>
								Worldwide
							</MenuItem>
							{countries.map((country) => (
								<MenuItem key={country.id} value={country.value}>
									{country.name}
								</MenuItem>
							))}
						</Select>
					</FormControl>
				</div>
				<div className='app__stats'>
					<InfoBox
						title='Corona Virus Cases'
						total={countryInfo.cases}
						cases={countryInfo.todayCases}
					/>
					<InfoBox
						title='Recovered'
						total={countryInfo.recovered}
						cases={countryInfo.todayRecovered}
					/>
					<InfoBox
						title='Deaths'
						total={countryInfo.deaths}
						cases={countryInfo.todayDeaths}
					/>
				</div>
				<Map />
			</div>
			<Card className='app__right'>
				<CardContent>
					<h3>Live Cases by Country</h3>
					<Table countries={tableData} />
					<h3>Worldwide New Cases</h3>
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
