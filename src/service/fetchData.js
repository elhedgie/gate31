// global vars
let data
let container = document.querySelector('.container')
let searchBtn = document.querySelector('.search-block__btn');
let block = document.querySelector('.main-block')
// fetching func
const fetchData = async () => {
  // try-catch for fetching
  loading()
  try {
    data = await fetch('https://jsonplaceholder.typicode.com/posts/?_start=0&_limit=7')
    .then((res) => { return res.json()})
    .then(data => {return data})
  }
  catch {
    // if sth is wrong
    let warning = document.createElement('h2')
    container.append(warning)
    warning.innerText = 'Что-то пошло не так...'
    console.log('Something went wrong, try again')
  }  
  // return the array with data
  if (data) {
    return data;
  }
}
// function for removing a loader
const removeLoader = () => {
  let load = document.querySelector('.loader-wrap')
  // check if a loader exist
  if(load) {
    container.removeChild(load)
    // we dont need this button disabled anymore
    searchBtn.disabled = false
  }
}
// function for setting a loader
const loading = () => {
  let loaderWrap = document.createElement('div')
  let loader = document.createElement('div')
  // setting loader classes
  if (loader && loaderWrap) {
    loader.classList.add('loader-wrap__loader')
    loaderWrap.classList.add('loader-wrap')
    loaderWrap.append(loader)
    container.append(loaderWrap)
  }
  // preventing multiple clicks
  searchBtn.disabled = true
}
// function to start fetching 
const domCreating = async () => {
  await fetchData()
  // getting data
  if(data) {
    setTimeout(() => {
      elementsCreating(data)
    }, 1000);
  }
}
// function for DOM render
const elementsCreating = (array) => {
  // check if data exists
  if (array) {
    // and if the main block exists
    if (block) {
      // delete inner html
      block.innerHTML = ''
      // iteration of an array
      array.forEach(element => {
        // creating vars for elements
        let elem = document.createElement('div')
        let heading = document.createElement('h3')
        let text = document.createElement('p')
        // elements for a custom checkbox
        let label = document.createElement('label')
        let checkbox = document.createElement('input')
        let customCheckbox = document.createElement('span')
        // important check whether elements exist
        if (elem && heading && text && checkbox && label && customCheckbox) {
          // setting the type for the input
          checkbox.type = 'checkbox'
          label.addEventListener('click', function() {
            // if checkbox checked -- we change the style of the element 
            if(checkbox.checked) {
              elem.classList.add('main-block__element--active')
            } else {
              elem.classList.remove('main-block__element--active')
            }
          })
          // setting classes
          elem.classList.add('main-block__element')
          heading.classList.add('main-block__heading')
          text.classList.add('main-block__text')
          label.classList.add('main-block__label')
          customCheckbox.classList.add('main-block__custom-checkbox')
          checkbox.classList.add('main-block__checkbox')
          // inserting text and appending elements
          heading.innerText = element.title
          text.innerText = element.body
          label.append(checkbox, customCheckbox)
          elem.append(heading, text, label)
        }
        // settimeout is for fake loading -- to show how it works
        setTimeout(() => {
          block.append(elem)
          removeLoader()
        }, 1000);
      });
    }
  }
}
// functions for search filter
const searchFilter = () => {
  let searchInput = document.querySelector('.search-block__input')
  let searchBtn = document.querySelector('.search-block__btn')
  // check if elements exist
  if (searchInput && searchBtn) {
    // listener for the search btn
    searchBtn.addEventListener('click', function(e) {
      e.preventDefault();
      let value = searchInput.value
      // check if value is more than ''
      if (value !== '') {
        // filter the array
        let newArray = data.filter(elem => elem.title.includes(value))
        loading()
        if (newArray.length > 0) {
          elementsCreating(newArray)
        } else {
          // if value doesnt fit any element
          setTimeout(() => {
            removeLoader()
            noResult.innerText = 'Ничего не нашли :('
          }, 1000);
          let noResult = document.createElement('h2')
          block.innerHTML = ''
          block.append(noResult)
        }
        // change the url 
        const urlParams = new URLSearchParams(window.location.search)
        urlParams.set('search', value)
        window.location.hash = urlParams
      }
    })
    // listener for the input
    searchInput.addEventListener('input', function() {
      let value = searchInput.value
      // if value is blank - return to the default array
      if(value === '') {
        loading()
        elementsCreating(data)
      }
    })
  }
}

export {domCreating, searchFilter}