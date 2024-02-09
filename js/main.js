//function declarations
function loadDOM(){
  //console.log('loadDOM called')
  //reset to default values
  clearDOM()

  //put localStorage into DOM if it exists
  if(localStorage.getItem('bookList')){
    document.querySelector('table').innerHTML = localStorage.getItem('bookList')
    let table = document.querySelector('table')
    //if books in list, activate listeners on book actions
    if(table.getElementsByTagName('tr')[2] && table.getElementsByTagName('tr')[2]){
      activateTable()
    }
  }

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
  //console.log('setStorage called')
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
  //console.log('getBook called')
  //if no ISBN provided, pull value from input
  let ISBN = ''
  //if function is called from book list, there will be a parentNode
  //if function is called from input, there will not be a parentNode
  if(event.target.parentElement.ISBN){
    console.log(`ISBN provided to function`)
    ISBN = event.target.innerText
  } else {
    ISBN = document.querySelector('input').value
    console.log(`no ISBN passed as parameter`)
  }

  //console.log(ISBN)
  
  const url = `https://openlibrary.org/api/books?bibkeys=ISBN:${ISBN}&jscmd=data&format=json`

  fetch(url)
      .then(res => res.json()) // parse response as JSON
      .then(data => {

        //formatting to access object properties
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
  //console.log('clearStorage called')
  localStorage.clear()
}

function clearDOM(){
  //console.log('clearDOM called')
  //document.querySelector('table').innerHTML = ''
  document.querySelector('h3').innerText = ''
  document.querySelector('h2').innerText = ''
  document.querySelector('img').src = 'img/nopreview.png'
  document.querySelector('a').href = '#'
  document.querySelector('span').innerText = ''
  document.querySelector('h4').innerText = ''
}

function saveBook(){
  //console.log('saveBook called')
  //load current book into HTML table
  unshiftTable()

  saveTableToLocal()
}

function unshiftTable(){
  //console.log('loadTable called')
  let table = document.querySelector('table')
  let row = table.insertRow(2)
  let cell0 = row.insertCell(0)
  let cell1 = row.insertCell(1)
  let cell2 = row.insertCell(2)
  let cell3 = row.insertCell(3)
  cell0.innerHTML = `<img src="${localStorage.getItem('img')}">`
  cell1.innerHTML = localStorage.getItem('title')

  //on click, loads book back to stage
  cell2.ISBN = localStorage.getItem('ISBN')
  cell2.innerHTML = `<p id="tableISBN" style="text-decoration: underline;">${cell2.ISBN}</p>`
  //cell2.onclick = getBook;
  
  //on click, deletes row from table
  cell3.innerHTML = `<p id="tableX" style="text-decoration: underline;">X</p>`
  cell3.rowIndex = cell3.parentNode.rowIndex
  //cell3.onclick = removeBook

  activateTable()
}

function removeBook(event){
  //console.log('removeBook called')
  //console.log(event.currentTarget.parentNode.parentNode)
  document.querySelector("table").deleteRow(event.currentTarget.parentNode.parentNode.rowIndex);
  saveTableToLocal()
}

function saveTableToLocal(){
  //console.log('saveTableToLocal called')
  //save table to localStorage
  localStorage.setItem('bookList', document.querySelector('table').innerHTML)
}

function clearList(){
  //console.log('clearList called')
  document.querySelector('table').innerHTML = `<tr>
  <th colspan="4">Book List</th>
</tr>
<tr>
  <th></th>
  <th>Title</th>
  <th>ISBN</th>
  <th></th>
</tr>`
  saveTableToLocal()
}

function activateTable(){
  //console.log('activateTable called')
  //after loading table into DOM, add event listeners to ISBN and remove buttons
  document.getElementById('tableISBN').addEventListener('click', getBook)
  document.getElementById('tableX').addEventListener('click', removeBook)
}

function download_table_as_csv(table_id, separator = ',') {
  // Select rows from table_id
  var rows = document.querySelectorAll('table#' + table_id + ' tr');
  // Construct csv
  var csv = [];
  for (var i = 0; i < rows.length; i++) {
      var row = [], cols = rows[i].querySelectorAll('td, th');
      for (var j = 0; j < cols.length; j++) {
          // Clean innertext to remove multiple spaces and jumpline (break csv)
          var data = cols[j].innerText.replace(/(\r\n|\n|\r)/gm, '').replace(/(\s\s)/gm, ' ')
          // Escape double-quote with double-double-quote (see https://stackoverflow.com/questions/17808511/properly-escape-a-double-quote-in-csv)
          data = data.replace(/"/g, '""');
          // Push escaped string
          row.push('"' + data + '"');
      }
      csv.push(row.join(separator));
  }
  var csv_string = csv.join('\n');
  // Download it
  var filename = 'export_' + table_id + '_' + new Date().toLocaleDateString() + '.csv';
  var link = document.createElement('a');
  link.style.display = 'none';
  link.setAttribute('target', '_blank');
  link.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv_string));
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  //source: https://stackoverflow.com/questions/15547198/export-html-table-to-csv-using-vanilla-javascript
}

//webpage load
loadDOM()
document.getElementById('getBook').addEventListener('click', getBook)
document.getElementById('saveBook').addEventListener('click', saveBook)
document.getElementById('clearList').addEventListener('click', clearList)


