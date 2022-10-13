// Get Data
const getData = (endpoint) => {
	return fetch(endpoint).then((r) => r.json()).catch((e) => console.error(e));
}

// _ = helper functions
function _parseMillisecondsIntoReadableTime(timestamp) {
	//Get hours from milliseconds
	const date = new Date(timestamp * 1000);
	// Hours part from the timestamp
	const hours = '0' + date.getHours();
	// Minutes part from the timestamp
	const minutes = '0' + date.getMinutes();
	// Seconds part from the timestamp (gebruiken we nu niet)
	// const seconds = '0' + date.getSeconds();

	// Will display time in 10:30(:23) format
	return hours.substr(-2) + ':' + minutes.substr(-2); //  + ':' + s
}

const getTotalMinutes = function(time1, time2) {
	const totalSeconds = time2 - time1;
	const totalMinutes = totalSeconds / 60;
	return totalMinutes;
}

// 5 TODO: maak updateSun functie

const updateSun = function(percentage, sunElement) {
	percentage = 0;
	let bottomPercentage;
	if (percentage < 50) { 
		bottomPercentage = 50 - percentage;
	} else { 
		bottomPercentage = percentage + 50;
	}
	bottomPercentage = Math.round(bottomPercentage);
	bottomPercentage = parseInt(bottomPercentage);
	console.log(bottomPercentage);
	sunElement.setAttribute('style', `left: ${percentage}%; bottom: ${bottomPercentage}%;`);

}

// 4 Zet de zon op de juiste plaats en zorg ervoor dat dit iedere minuut gebeurt.
let placeSunAndStartMoving = (totalMinutes, sunrise) => {
	// In de functie moeten we eerst wat zaken ophalen en berekenen.
	// Haal het DOM element van onze zon op en van onze aantal minuten resterend deze dag.
	const sunElement = document.querySelector('.js-sun');
	const minutesLeftElement = document.querySelector('.js-time-left');
	// Bepaal het aantal minuten dat de zon al op is.
	const now = new Date();
	const upTimeMinutes = getTotalMinutes(sunrise, (now / 1000).toFixed(0));
	// console.log(upTimeMinutes);
	const restingMinutes = (totalMinutes - upTimeMinutes).toFixed(0);
	const restingMinutesMessage = `${restingMinutes} minutes`;
	minutesLeftElement.innerHTML = restingMinutesMessage;
	// Nu zetten we de zon op de initiële goede positie ( met de functie updateSun ). Bereken hiervoor hoeveel procent er van de totale zon-tijd al voorbij is.
	let percentage = (upTimeMinutes / totalMinutes) * 100;
	percentage = Math.round(percentage);
	// console.log(percentage);
	updateSun(percentage, sunElement);
	// We voegen ook de 'is-loaded' class toe aan de body-tag.
	// Vergeet niet om het resterende aantal minuten in te vullen.
	// Nu maken we een functie die de zon elke minuut zal updaten
	// Bekijk of de zon niet nog onder of reeds onder is
	// Anders kunnen we huidige waarden evalueren en de zon updaten via de updateSun functie.
	// PS.: vergeet weer niet om het resterend aantal minuten te updaten en verhoog het aantal verstreken minuten.
};

// 3 Met de data van de API kunnen we de app opvullen
let showResult = queryResponse => {
	// We gaan eerst een paar onderdelen opvullen
	console.log(queryResponse);
	// Zorg dat de juiste locatie weergegeven wordt, volgens wat je uit de API terug krijgt.
	document.querySelector('.js-location').innerHTML = `${queryResponse.city.name}, ${queryResponse.city.country}`;
	// Toon ook de juiste tijd voor de opkomst van de zon en de zonsondergang.
	let sunriseDate = queryResponse.city.sunrise;
	let sunsetDate = queryResponse.city.sunset;

	const sunriseTime = _parseMillisecondsIntoReadableTime(sunriseDate);
	const sunsetTime = _parseMillisecondsIntoReadableTime(sunsetDate);

	document.querySelector('.js-sunrise').innerHTML = sunriseTime;
	document.querySelector('.js-sunset').innerHTML = sunsetTime;
	// Hier gaan we een functie oproepen die de zon een bepaalde positie kan geven en dit kan updaten.
	const totalMinutes = getTotalMinutes(sunriseDate, sunsetDate);
	console.log(totalMinutes);
	placeSunAndStartMoving(totalMinutes, sunriseDate);
	// Geef deze functie de periode tussen sunrise en sunset mee en het tijdstip van sunrise.
};

document.addEventListener('DOMContentLoaded', async function() {
	// 1 We will query the API with longitude and latitude.
	const lat = 50.8027841;
	const lon = 3.2097454;
	// Eerst bouwen we onze url op
	const url = `http://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=f521e55c82e9611038d6dea79fc95a63&units=metric&lang=nl`;
	// Met de fetch API proberen we de data op te halen.
	const data = await getData(url);
	// Als dat gelukt is, gaan we naar onze showResult functie.
	showResult(data);
});
