# Reading List App
Create your own personal reading list using the Open Library API. Download your final list as a CSV file for backup.

https://rennacarver.github.io/Reading-List-App/

<img src="https://github.com/rennacarver/rennacarver/blob/main/Reading-List-App_medium.gif?raw=true" alt="Reading List App">

## Features

- Click on books in the book list to bring them back to the stage
- Remove books from the list
- Pickup where you left off with browser local storage
- Download your lists to CSV for backup
- Quick clear for the book list

## How It's Made:

HTML, CSS, JavaScript

This application was built using functional programming primarily in Javascript styling in CSS and markup with HTML.

## Lessons Learned:

Storing arrays and objects in local storage ended up being much more difficult than storing the HTML table directly. This is due to the complexity of creating a HTML table from a data list. This requires reactivating the event listeners in the table each time it is placed into the DOM. If this project is extended to include more features, the backend would need to be updated to store the list data as an array or as objects.
