//function declarations
function loadDOM(){
  console.log('loadDOM called')
  //reset to default values
  clearDOM()

  //put localStorage into DOM if it exists
  if(localStorage.getItem('subtitle')) {
    document.querySelector('h3').innerText = localStorage.getItem('subtitle')
  }

  if(localStorage.getItem('title')) {
    document.querySelector('h2').innerText = localStorage.getItem('title')
  }

  if(localStorage.getItem('img')) {
    document.querySelector('img').src = localStorage.getItem('img')
  }

  if(localStorage.getItem('url')) {
    document.querySelector('a').href = localStorage.getItem('url')
  }
  
  if(localStorage.getItem('author')) {
    document.querySelector('span').innerText = `By ${localStorage.getItem('author')}`
  }
  
  if(localStorage.getItem('pages')) {
    document.querySelector('h4').innerText = localStorage.getItem('pages')
  }
}

function setStorage(data, objName, ISBN){
  console.log('setStorage called')
  //clear localStorage
  localStorage.clear()

  //put into localStorage
  localStorage.setItem('ISBN', ISBN)

  if (data[objName].title){
    localStorage.setItem('title',data[objName].title)
  }

  if (data[objName].subtitle){
    localStorage.setItem('subtitle', data[objName].subtitle)
  }

  if (data[objName].url){
    localStorage.setItem('url', data[objName].url)
  }
  
  if (data[objName].cover?.large){
    localStorage.setItem('img', data[objName].cover.large)
  } else {
    localStorage.setItem('img', 'img/nopreview.png')
  }
  
  if (data[objName].authors[0]?.name){
    localStorage.setItem('author', data[objName].authors[0].name)
  }
  
  if (data[objName].number_of_pages){
    localStorage.setItem('pages', `Pages: ${data[objName].number_of_pages}`)
  }
}

function getBook(event){
  console.log('getBook called')
  //if no ISBN provided, pull value from input
  let ISBN = ''
  if(event.currentTarget.ISBN){
    console.log(`ISBN provided to function`)
    ISBN = event?.currentTarget?.ISBN
    console.log(ISBN)
  } else {
    ISBN = document.querySelector('input').value
    console.log(`no ISBN passed as parameter`)
  }
  
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${ISBN}&jscmd=data&format=json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        
        //console.log(objName)
        //console.log(data)

        //object name formatting
        let objName = `ISBN:${ISBN}`
        
        //if data returned is not empty, load localstorage and DOM
        //if no data returned, give error and clear stage
        if(data[objName]){
        setStorage(data, objName, ISBN)
        loadDOM()
        } else {
          clearStorage()
          clearDOM()
          alert('No match found.')
        }
        
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function clearStorage(){
  console.log('clearStorage called')
  localStorage.clear()
}

function clearDOM(){
  console.log('clearDOM called')
  document.querySelector('h3').innerText = ''
  document.querySelector('h2').innerText = ''
  document.querySelector('img').src = 'img/nopreview.png'
  document.querySelector('a').href = '#'
  document.querySelector('span').innerText = ''
  document.querySelector('h4').innerText = ''
}

function saveBook(){
  console.log('saveBook called')
  let table = document.querySelector('table')
  let row = table.insertRow(2)
  let cell1 = row.insertCell(0)
  let cell2 = row.insertCell(1)
  cell1.innerHTML = localStorage.getItem('title')
  cell2.innerHTML = `<a href="">${localStorage.getItem('ISBN')}</a>`
  cell2.ISBN = localStorage.getItem('ISBN')
  cell2.onclick = getBook

  //set ISBN as hyperlink to reload book from list onto stage

}

//webpage load
loadDOM()
document.getElementById('getBook').addEventListener('click', getBook)
document.getElementById('saveBook').addEventListener('click', saveBook)


