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
import { sortData, prettyPrintStat } from './services/utils';
import LineGraph from './components/LineGraph';
import { BASE_URL } from './constants';
import 'leaflet/dist/leaflet.css';

function App() {
	const [countries, setCountries] = useState([]);
	const [country, setCountry] = useState('worldwide');
	const [countryInfo, setCountryInfo] = useState({});
	const [tableData, setTableData] = useState([]);
	const [mapZoom, setMapZoom] = useState(3);
	const [mapCountries, setMapCountries] = useState([]);
	const [mapCenter, setMapCenter] = useState({ lat: 34.80746, lng: -40.4796 });
	const [casesType, setCasesType] = useState('cases');

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
					setMapCountries(data);
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
				if (countryCode === 'worldwide') {
					setMapCenter({ lat: 34.80746, lng: -40.4796 });
					setMapZoom(3);
				} else {
					setMapCenter([data.countryInfo.lat, data.countryInfo.long]);
					setMapZoom(4);
				}
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
						isRed
						active={casesType === 'cases'}
						onClick={() => setCasesType('cases')}
						title='Corona Virus Cases'
						total={prettyPrintStat(countryInfo.cases)}
						cases={prettyPrintStat(countryInfo.todayCases)}
					/>
					<InfoBox
						active={casesType === 'recovered'}
						onClick={() => setCasesType('recovered')}
						title='Recovered'
						total={prettyPrintStat(countryInfo.recovered)}
						cases={prettyPrintStat(countryInfo.todayRecovered)}
					/>
					<InfoBox
						isRed
						active={casesType === 'deaths'}
						onClick={() => setCasesType('deaths')}
						title='Deaths'
						total={prettyPrintStat(countryInfo.deaths)}
						cases={prettyPrintStat(countryInfo.todayDeaths)}
					/>
				</div>

				<Map
					casesType={casesType}
					countries={mapCountries}
					center={mapCenter}
					zoom={mapZoom}
				/>
			</div>
			<Card className='app__right'>
				<CardContent>
					<h3>Live Cases By Country</h3>
					<Table countries={tableData} />
					<h3 className='app__graphTitle'>Worldwide new {casesType}</h3>
					<LineGraph className='app__graph' casesType={casesType} />
				</CardContent>
			</Card>
		</div>
	);
}

export default App;
