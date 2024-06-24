import React, { useEffect, useRef, useState } from 'react';
import search_icon from '../assets/search.png';
import clear_icon from '../assets/clear.png';
import cloud_icon from '../assets/cloud.png';
import drizzle_icon from '../assets/drizzle.png';
import humidity_icon from '../assets/humidity.png';
import rain_icon from '../assets/rain.png';
import snow_icon from '../assets/snow.png';
import wind_icon from '../assets/wind.png';
import './WeatherMain.css';

const api = {
    key: "acb6c6c1fd9f00655e86ad3e2720d862"
};

const WeatherMain = () => {
    const inputRef = useRef();
    const [city, setCity] = useState("");
    const [weatherData, setWeatherData] = useState(null);

    const allIcon = {
        "01d": clear_icon,
        "01n": clear_icon,
        "02d": cloud_icon,
        "02n": cloud_icon,
        "03d": cloud_icon,
        "03n": cloud_icon,
        "04d": drizzle_icon,
        "04n": drizzle_icon,
        "09d": rain_icon,
        "09n": rain_icon,
        "10d": rain_icon,
        "10n": rain_icon,
        "13d": snow_icon,
        "13n": snow_icon,
    };

    const search = async (city) => {
        if (city === "") {
            alert("Enter City Name");
            return;
        }
        if (/\d/.test(city)) {
            alert("City name should not contain digits");
            return;
        }
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${api.key}`;
            const response = await fetch(url);
            const data = await response.json();
            if (data.cod !== 200) {
                alert(data.message);
                return;
            }
            const icon = allIcon[data.weather[0].icon] || clear_icon;
            setWeatherData({
                humidity: data.main.humidity,
                windSpeed: data.wind.speed,
                temperature: (data.main.temp - 273.15).toFixed(1),
                location: data.name,
                icon: icon,
            });
        } catch (error) {
            setWeatherData(null);
            console.error("Error in fetching data", error);
        }
    };

    useEffect(() => {
        search("pune");
    }, []);

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            search(city);
        }
    };

    return (
        <div className="weather">
            <div className="search-bar">
                <input
                    ref={inputRef}
                    type="text"
                    placeholder='Search'
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <img src={search_icon} alt="search" onClick={() => search(city)} />
            </div>
            {weatherData && (
                <>
                    <img src={weatherData.icon} alt="weather icon" className='weather-icon' />
                    <p className='temperature'>{weatherData.temperature}°C</p>
                    <p className='location'>{weatherData.location}</p>
                    <div className="weather-data">
                        <div className="col">
                            <img src={humidity_icon} alt="humidity" />
                            <div>
                                <p>{weatherData.humidity}%</p>
                                <span>Humidity</span>
                            </div>
                        </div>
                        <div className="col">
                            <img src={wind_icon} alt="wind speed" />
                            <div>
                                <p>{weatherData.windSpeed} km/h</p>
                                <span>Wind Speed</span>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default WeatherMain;
