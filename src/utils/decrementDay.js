export default function decrementDay(date) {
    let day = parseInt(date.day); // Convert day from string to integer
    let newDay = day - 1;
  
    if (newDay < 1) {
      // Move to previous month
      let newMonth = parseInt(date.month) - 1;
  
      if (newMonth < 1) {
        newMonth = 12; // Go to December of previous year
        date.year = (parseInt(date.year) - 1).toString();
      }
  
      // Set day to last day of the new month
      const daysInPreviousMonth = new Date(date.year, newMonth, 0).getDate();
      newDay = daysInPreviousMonth;
      date.month = newMonth.toString().padStart(2, '0');
    }
  
    // Update day
    date.day = newDay.toString().padStart(2, '0');
  }