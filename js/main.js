const buttonSearch = document.querySelector('#button-search')
const buttonUpdate = document.querySelector('#button-update')

const inputSearch = document.querySelector('.search__input')
const search = document.querySelector('.search')
const previosBlock = document.querySelector('.previos-block')

let cardsCity
let isCurrentRequest = true

function showSearchBlock() {
	let searchHeight = search.scrollHeight
	search.style.height = searchHeight + 'px'
	setTimeout(function () {
		search.style.opacity = '1'
	}, 100)
}

previosBlock.addEventListener('click', showSearchBlock)

let cityCollection = []
const cityListWrapper = document.querySelector('.list')
const cityList = document.querySelectorAll('.city')
const cityListInnerHtml = cityList.innerHTML

function createSearchList() {
	cityListWrapper.innerHTML = ''
	const currentCityList = [...cityList].filter((city) => !cityCollection.includes(city.innerHTML))
	const cuurentMapCityList = currentCityList.map((item) => `
    <li class="list__item" tabindex="0">
        <p class="city list__item-text">${item.textContent}</p>
    </li>`)
	const currentCityListElement = cuurentMapCityList.join('')
	cityListWrapper.insertAdjacentHTML('afterbegin', currentCityListElement)
}


function removeCity(e) {
	let cityCard = e.target.closest('.grid-item')
	cityCard.remove()
	cardsCity = document.querySelectorAll('[data-city="result"]')
	if (cardsCity.length === 0) {
		previosBlock.classList.remove('js-hidden')
	}
	const cityNameText = cityCard.querySelector('.grid-item__city-name').textContent
	const currentCityIndex = cityCollection.findIndex((item) => item === cityNameText)
	if (currentCityIndex !== -1) {
		cityCollection.splice(currentCityIndex, 1)
		createSearchList()
	}
}

function createCardCity(e) {
	if (e.type === 'click' || e.key === 'Enter' && !e.shiftKey) {
		let city = inputSearch.value
		if (city) {
			if (isCurrentRequest) {
				getCityWeather(city)
					.then(response => response.json())
					.then(data => {
						if (cityCollection) {
							cityCollection.forEach(cityItem => {
								if (cityItem === inputSearch.value) {
									isCurrentRequest = false
								}
							})
						}
						if (isCurrentRequest) {
							if (data.name) {
								cityCollection.push(data.name)
								createSearchList()
								previosBlock.classList.add('js-hidden')

								const resultCard = createCityCard({
									name: data.name,
									tempMin: changeTempCelsiy(data.main.temp_min),
									tempAverage: changeTempCelsiy(data.main.temp),
									tempMax: changeTempCelsiy(data.main.temp_max),
									description: data.weather[0].description,
									pressure: data.main.pressure
								})
								const table = document.querySelector('.table-grid')
								table.insertAdjacentElement('afterbegin', resultCard)
							}
						}
						let btnRemoveCity = document.querySelector('.remove-city-block')
						btnRemoveCity.addEventListener('click', removeCity)
						isCurrentRequest = true
						cardsCity = document.querySelectorAll('.grid-item')
					})
					.catch(error => {
						alert('Такой город не найден');
					})
			}
			inputSearch.value = ''
		}
	}
}

buttonSearch.addEventListener('click', createCardCity)
document.addEventListener('keyup', createCardCity)

function updateTemperature(cityCard, data) {
	let tempMin = cityCard.querySelector('[data-card="temp-min"]')
	tempMin.textContent = data.main.temp_min
	let tempAverage = cityCard.querySelector('[data-card="temp-average"]')
	tempAverage.textContent = data.main.temp
	let tempMax = cityCard.querySelector('[data-card="temp-max"]')
	tempMax.textContent = data.main.temp_max
}

function updateDescription(cityCard, data) {
	let description = cityCard.querySelector('#description')
	description.textContent = data.weather[0].description
}

function updatePressure(cityCard, data) {
	let pressure = cityCard.querySelector('#pressure')
	pressure.textContent = data.main.pressure
}

function updateDataCard(cityCard, data) {
	updateTemperature(cityCard, data)
	updateDescription(cityCard, data)
	updatePressure(cityCard, data)
}

function updateCardCity() {

	const allCitiesWeatherPromises = cityCollection.map(city => getCityWeather(city))

	Promise.all(allCitiesWeatherPromises)

	if (cityCollection.length) {
		cityCollection.forEach((city) => {
			getCityWeather(city)
				.then(response => response.json())
				.then(data => {
					let citiesName = document.querySelectorAll('.grid-item__city-name')
					citiesName.forEach((cityName) => {
						if (cityName.textContent === city) {
							let cityCard = cityName.closest('.grid-item')
							cityCard.classList.remove('loaded');
							setTimeout(() => {
								cityCard.classList.add('loaded_hiding');
								setTimeout(() => {
									cityCard.classList.add('loaded');
									cityCard.classList.remove('loaded_hiding');
								}, 500);
								cityCard.classList.remove('loaded');

								updateCityCard(cityCard, {
									name: data.name,
									tempMin: changeTempCelsiy(data.main.temp_min),
									tempAverage: changeTempCelsiy(data.main.temp),
									tempMax: changeTempCelsiy(data.main.temp_max),
									description: data.weather[0].description,
									pressure: data.main.pressure
								})

								// updateDataCard(cityCard, data)
							}, 1000)
						}
					})
					let btnRemoveCity = document.querySelector('.remove-city-block')
					btnRemoveCity.addEventListener('click', removeCity)
					cardsCity = document.querySelectorAll('.grid-item')
				})
				.catch(error => {
					console.log(error)
				})
		})
	} else {
		alert('Нет выбранных городов');
	}
}

buttonUpdate.addEventListener('click', updateCardCity)


const searchResultCityItemTemplate = document.querySelector('.search-result__item')
const searchResult = document.querySelector('.search-result')

function onCreateSearchCity() {
	const inputValue = inputSearch.value.trim().toLowerCase();
	const updateCityList = document.querySelectorAll('.city')
	updateCityList.forEach((city) => {
		const itemValue = city.innerHTML.trim().toLowerCase();
		const parentItem = city.closest('.list__item');
		if (itemValue.indexOf(inputValue) === -1) {
			parentItem.style.display = 'none';
		} else {
			parentItem.style.display = null;
		}
	});
}

inputSearch.addEventListener('input', onCreateSearchCity)
inputSearch.addEventListener('onchange', onCreateSearchCity)

function onShowListCity(e) {
	if (e.type === 'click' || e.code === 'Enter' && e.shiftKey) {
		const parent = e.target.closest('.search__input_wrapper')
		parent.classList.add('js-active');
	}
}

inputSearch.addEventListener('keydown', onShowListCity)
inputSearch.addEventListener('click', onShowListCity)

function onChooseCItyItem(e) {
	if (e.code === 'Enter' || e.type === 'click') {
		if (e.target.closest('.list__item')) {
			const target = e.target.closest('.list__item')
			const targetElementText = target.querySelector('.list__item-text').textContent
			inputSearch.value = targetElementText
			target.style.display = "none"
			createCardCity(e)
		}
	}
}

document.addEventListener('click', onChooseCItyItem)
document.addEventListener('keydown', onChooseCItyItem)

function onHiddenListCity(e) {
	const parentInput = e.target.closest('.search__input_wrapper')
	if (!parentInput) {
		const inputWrapper = document.querySelector('.search__input_wrapper')
		inputWrapper.classList.remove('js-active');
	}
}

document.addEventListener('click', onHiddenListCity)

setInterval(() => {
	if (cityCollection.length) {
		updateCardCity()
	}
}, 300000)





