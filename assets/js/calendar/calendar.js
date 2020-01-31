function daysInMs(days){
    return days * 24 * 60 * 60 * 1000
}


let today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

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
    let firstDate = new Date(year, month, 1)
    let lastDate = new Date(year, month + 1, 0)
    let firstDay = (firstDate).getDay();
    let lastDay  = lastDate.getDay();
    
    let daysInMonth = 32 - new Date(year, month, 32).getDate();
    let table = []

    // creating all cells
    let date = 1;
    for (let i = 0; i < 6; i++) {
        // creates a table row
        let row = []

        //creating individual cells, filing them up with data.
        for (let j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                
                var cell =  new Date((new Date(year, month) - daysInMs(firstDay - j)))
                var data = {
                    date: cell,
                    day: cell.getDate(),
                    events: [],
                    current: false
                }
                row.push(data)
            }
            // else if (date > daysInMonth) {
            //     // add dates to the last day of the month
            //     var delta = j - lastDate.getDay()
            //     console.log(lastDate.getDay())
            //     console.log(delta)
            //     console.log(new Date(lastDate + daysInMs(delta)))
            // }

            else {
                let cell = date
                cell = new Date(year, month, cell)
                var data = {
                    date: cell,
                    day: cell.getDate(),
                    events: [],
                    current: cell.getMonth() == month
                }
                
                row.push(data)
                date++;
            }
        }
        table.push(row)
    }
    return table
}

function showWeekCalendar(date, month, year){
    var calendar = showCalendar(month, year)
    let selected;
    let week;
    for(week of calendar){
        let day;
        for(day of week){
            if(day.day == date){
                selected = week
            }
        }
    }
    return selected
}

// console.log(showCalendar(11, 2019))

export {showCalendar, showWeekCalendar}
