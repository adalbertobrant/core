// function getCalendar(year, month){
//     //2d array start from first day 
//     var date = new Date(year, month, 1)
//     var i = 1;
//     var dateArray = [];
//     while(date.getMonth() == month){
//         date = new Date(year, month, i)
//         dateArray.push(date)
//         i++;
//     }
//     var currMonth = dateArray.slice(1, dateArray.length)
//     var first = currMonth[0]
//     var last = currMonth[currMonth.length -1]
//     var numPrePages = first.getDate()
//     var numPostPages = 7 - last.getDate()

//     var prePages = []
//     for(j=1; j == numPrePages; j++){
//         prePages.push(new Date(first - daysInMs(j)))
//     }
//     var postPages = []
//     var l = 1
//     console.log(numPostPages)

//     for(l=1; l == numPostPages; l++){
//         console.log(l)
//         postPages.push(new Date(last + daysInMs(l)))
//     }

//     console.log(postPages)
    
//     return prePages.concat(currMonth.concat(postPages))
// }

// console.log(getCalendar(2019, 11));


function daysInMs(days){
    return days * 24 * 60 * 60 * 1000
}


let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();
// let selectYear = document.getElementById("year");
// let selectMonth = document.getElementById("month");

let months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// let monthAndYear = document.getElementById("monthAndYear");
showCalendar(currentMonth, currentYear);


function next() {
    currentYear = (currentMonth === 11) ? currentYear + 1 : currentYear;
    currentMonth = (currentMonth + 1) % 12;
    // showCalendar(currentMonth, currentYear);
}

function previous() {
    currentYear = (currentMonth === 0) ? currentYear - 1 : currentYear;
    currentMonth = (currentMonth === 0) ? 11 : currentMonth - 1;
    // showCalendar(currentMonth, currentYear);
}

// function jump() {
//     currentYear = parseInt(selectYear.value);
//     currentMonth = parseInt(selectMonth.value);
//     showCalendar(currentMonth, currentYear);
// }

function showCalendar(month, year) {

    let firstDay = (new Date(year, month)).getDay();
    console.log('first day')
    console.log(firstDay)
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let table = []
    // let tbl = document.getElementById("calendar-body"); // body of the calendar

    // clearing all previous cells
    // tbl.innerHTML = "";

    // filing data about month and in the page via DOM.
    // monthAndYear.innerHTML = months[month] + " " + year;
    // selectYear.value = year;
    // selectMonth.value = month;

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        // let row = document.createElement("tr");
        let row = []

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                // let cell = document.createElement("td");
                // let cellText = document.createTextNode("");
                // cell.appendChild(cellText);
                // row.appendChild(cell);
                console.log(j)
                let cell = ""
                row.push(cell)
            }
            else if (date > daysInMonth) {
                break;
            }

            else {
                let cell = date
                // let cell = document.createElement("td");
                // let cellText = document.createTextNode(date);
                if (date === today.getDate() && year === today.getFullYear() && month === today.getMonth()) {
                    // cell.classList.add("bg-info");
                    cell = date + '*'
                } // color today's date
                // cell.appendChild(cellText);
                // row.appendChild(cell);
                row.push(cell)
                date++;
            }


        }

        // tbl.appendChild(row); // appending each row into calendar body.
        table.push(row)
    }
    console.log(table)
}

showCalendar(5,2019)