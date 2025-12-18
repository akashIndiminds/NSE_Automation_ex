function getDatesBetween(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate); // Create a copy of the startDate
  
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate)); // Add a new Date object to the array
      currentDate.setDate(currentDate.getDate() + 1); // Increment by one day
    }
    return dates;
  }
  
  export default getDatesBetween;
 
  



  
 
  