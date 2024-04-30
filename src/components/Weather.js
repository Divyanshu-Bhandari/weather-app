import { Typography, Box, TextField, IconButton, CircularProgress } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import React, { useState } from 'react';

function Weather() {
    const limit = 1;
    const [cityName, setCityName] = useState("");
    const [geocodingResult, setGeocodingResult] = useState(null);
    const [weatherData, setWeatherData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    async function fetchData() {
        const apiKey = 'a77d025149b70afb2cec512e1ffd02cf';
        try {
            setLoading(true);
            const res = await fetch(`http://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=${limit}&appid=${apiKey}`);
            const data = await res.json();

            if (res.ok) {
                setGeocodingResult(data);
                if (data && data.length > 0) {
                    const { lat, lon } = data[0];
                    const res2 = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`);
                    const data2 = await res2.json();
                    if (res2.ok) {
                        setWeatherData(data2);
                        setLoading(false);
                        setError(null);
                    } else {
                        setLoading(false);
                        setError("Failed to fetch weather data: " + data2.message);
                    }
                } else {
                    setLoading(false);
                    setError("Location not found");
                }
            } else {
                throw new Error('Failed to fetch geocoding data: ' + data.message);
            }
        } catch (error) {
            setError("Error: " + error.message);
        }
    }

    const handleIconClick = () => {
        fetchData();
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            fetchData();
        }
    };

    return (
        <div style={{ width: "50rem", backgroundColor: "rgb(213, 255, 231)" }}>
            <Box
                display="flex"
                justifyContent="center"
                sx={{
                    marginTop: "20px",
                    marginBottom: "20px"
                }}
            >
                <Typography
                    variant="h4"
                    mb={2}
                    sx={{
                        color: "green",
                        marginTop: "10px",
                        marginLeft: "20px",
                    }}
                >
                    Weather App
                </Typography>
                <Box
                    display="flex"
                    alignItems="center"
                    width="100%"
                    maxWidth="500px"
                    borderRadius="30px"
                    boxShadow={1}
                    bgcolor="background.paper"
                    sx={{
                        marginLeft: "40px",
                    }}
                >
                    <TextField
                        id="standard-basic"
                        label="City name"
                        variant="standard"
                        type="text"
                        value={cityName}
                        placeholder="Enter city name"
                        fullWidth
                        required
                        onChange={(e) => setCityName(e.target.value)}
                        onKeyPress={handleKeyPress}
                        sx={{
                            flexGrow: 1,
                            marginLeft: "20px",
                            marginBottom: "10px"
                        }}
                        InputProps={{
                            disableUnderline: true,
                        }}
                    />
                    <IconButton
                        onClick={handleIconClick}
                        sx={{
                            marginRight: "10px",
                        }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : <SearchIcon />}
                    </IconButton>
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                alignItems="center"
                minHeight="100vh"
                p={2}
                bgcolor="#f0f0f0"
            >
                {error && <Typography variant="body1">{error}</Typography>}

                {geocodingResult && weatherData && (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        mt={2}
                        width="100%"
                        maxWidth="750px"
                        borderRadius="30px"
                        boxShadow={1}
                        bgcolor="background.paper"
                        p={2}
                    >
                        <Typography variant="h5" style={{ color: "green" }}>Weather in {weatherData.name}</Typography>
                        <Typography variant="body1">Temperature: {parseFloat((weatherData.main.temp - 273.15).toFixed(2))}° Celsius</Typography>
                        <Typography variant="body1">Description: {weatherData.weather[0].description}</Typography>
                        <img
                            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
                            alt="Weather Icon"
                        />
                    </Box>
                )}
            </Box>
        </div>
    );
}

export default Weather;
