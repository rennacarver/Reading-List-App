
loadDOM()
document.querySelector('button').addEventListener('click', getBook)

function getBook(){
  const ISBN = document.querySelector('input').value
  //console.log(ISBN)
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${ISBN}&jscmd=data&format=json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {
        
        //console.log(objName)
        console.log(data)

        //object name formatting
        let objName = `ISBN:${ISBN}`
        
        //if data returned is not empty, load localstorage and DOM
        if(data[objName]){
        loadStorage(data, objName)
        loadDOM()
        }
        
      })
      .catch(err => {
          console.log(`error ${err}`)
      });
}

function loadDOM(){
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

function loadStorage(data, objName){
  //put into localStorage
  
  if (data[objName].title){
    localStorage.setItem('title',data[objName].title)
  }

  if (data[objName].subtitle){
    localStorage.setItem('subtitle', data[objName].subtitle)
  }

  if (data[objName].url){
    localStorage.setItem('url', data[objName].url)
  }
  
  if (data[objName].cover.large){
    localStorage.setItem('img', data[objName].cover.large)
  }
  
  if (data[objName].authors[0].name){
    localStorage.setItem('author', data[objName].authors[0].name)
  }
  
  if (data[objName].pagination){
    localStorage.setItem('pages', data[objName].pagination)
  }
}