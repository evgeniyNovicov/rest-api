const updateCityCard = (card, params) => {
	const keys = Object.keys(params)

	keys.forEach(key => {
		const item = card.querySelector(`[data-card="${toKebabCase(key)}"]`)
		item.textContent = params[key]
	})

	return card
}

const createCityCard = (params) => {
	const cardTemplate = document.querySelector('[data-card="card"]')

	const card = cardTemplate.cloneNode(true)
	card.setAttribute('data-city', 'result')

	const cardImage = card.querySelector('[data-card="image"]')
	cardImage.setAttribute('src', 'image/city-' + Math.round(getRandomArbitrary(1, 6)) + '.jpg')

	return updateCityCard(card, params)
}
