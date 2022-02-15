    // let city = 'пекин'
    // fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${key}`)
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log(data)
    //     })

    const KEY = '37ff6ae81ba997705f327961d284debc'
    let buttonSearch = document.querySelector('.search__button')
    let inputSearch = document.querySelector('.search__input')
    let search = document.querySelector('.search')
    let previosBlock = document.querySelector('.previos-block')

    previosBlock.addEventListener('click', showSearchBlock)

    function showSearchBlock() {
        search.classList.add('js-show')
    }

    buttonSearch.addEventListener('click', createCardCity)

    function createCardCity() {
        let city = inputSearch.value
        fetch(`http://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${KEY}`)
            .then(response => response.json())
            .then(data => {
                console.log(data.name)
                if (data.name) {
                    previosBlock.classList.add('js-hidden')
                }
                let table = document.querySelector('.table-grid')

                function changeTempCelsiy(temp) {
                    return Math.round(temp - 273)
                }

                function getRandomArbitrary(min, max) {
                    return Math.random() * (max - min) + min;
                }
                table.insertAdjacentHTML('afterbegin', `
                <div class="grid-item">
                    <div class="grid-item__image_wrap">
                        <img class="grid-item__image" src="image/city-${Math.round(getRandomArbitrary(1,6))}.jpg" alt="image">
                        <div class="remove-city-block">
                            <div class="remove-city-block__inner">
                                <div class="plus plus-horizontal"></div>
                                <div class="plus plus-vertical"></div>
                            </div>
                        </div>
                    </div>
                    <h2 class="grid-item__city-name">${data.name}</h2>
                    <div class="grid-item__block">
                        <div class="grid-item__text">
                            Минимальная температура:<span id="temp-min">${changeTempCelsiy (data.main.temp_min)}</span>
                        </div>
                        <div class="grid-item__text">
                            Средняя температура:<span id="temp-average">${changeTempCelsiy (data.main.temp)}</span>
                        </div>
                        <div class="grid-item__text">
                            Максимальная температура:<span id="temp-max">${changeTempCelsiy (data.main.temp_max)}</span>
                        </div>
                    </div>
                    <div class="grid-item__block">
                        <div class="grid-item__text">
                            Описание:<span id="description">${data.weather[0].description}</span>
                        </div>
                        <div class="grid-item__text">
                            Давление:<span id="pressure">${data.main.pressure}</span>
                        </div>
                    </div>
                </div>
            `)
                let btnRemoveCity = document.querySelector('.remove-city-block')
                btnRemoveCity.addEventListener('click', removeCity)

                function removeCity(e) {
                    let cityCard = e.target.closest('.grid-item')
                    cityCard.remove()
                    let carddsCity = document.querySelectorAll('.grid-item')
                    if (carddsCity.length === 0) {
                        previosBlock.classList.remove('js-hidden')
                    }
                }
            })
            .catch(error => {
                //обрабатываем ошибку
                console.log(error);
            })
    }