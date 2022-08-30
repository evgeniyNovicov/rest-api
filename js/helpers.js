function changeTempCelsiy(temp) {
	return Math.round(temp - 273)
}

function getRandomArbitrary(min, max) {
	return Math.random() * (max - min) + min;
}

function toKebabCase(string) {
	return string.replace(/([a-z])([A-Z])/g, '$1-$2').replace(/\s+/g, '-').toLowerCase()
}
