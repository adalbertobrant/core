function getCalendar(year, month){
    //2d array start from first day 
    var date = new Date(year, month, 1)
    var i = 1;
    var dateArray = [];
    while(date.getMonth() == month){
        date = new Date(year, month, i)
        dateArray.push(date)
        i++;
    }
    var currMonth = dateArray.slice(1, dateArray.length)
    var first = currMonth[0]
    var last = currMonth[currMonth.length -1]
    var numPrePages = first.getDate()
    var numPostPages = 7 - last.getDate()

    var prePages = []
    for(j=1; j == numPrePages; j++){
        prePages.push(new Date(first - daysInMs(j)))
    }
    var postPages = []
    var l = 1
    console.log(numPostPages)

    for(l=1; l == numPostPages; l++){
        console.log(l)
        postPages.push(new Date(last + daysInMs(l)))
    }

    console.log(postPages)
    
    return prePages.concat(currMonth.concat(postPages))
}

console.log(getCalendar(2019, 11));


function daysInMs(days){
    return days * 24 * 60 * 60 * 1000
}