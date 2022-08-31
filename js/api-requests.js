const KEY = '37ff6ae81ba997705f327961d284debc'

const getCityWeather = (cityName) => fetch(`http://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${KEY}`)
