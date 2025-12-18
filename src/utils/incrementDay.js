
export default function incrementDay(date) {
    const day = parseInt(date.day); // Convert day from string to integer
    let newDay = day + 1; // Increment the day
  
    // Check if the day exceeds the number of days in the current month (e.g., 31 or 30)
    const daysInMonth = new Date(date.year, date.month, 0).getDate();
  
    if (newDay > daysInMonth) {
      newDay = 1; // Reset to 1 (next month)
      let newMonth = parseInt(date.month) + 1;
      
      if (newMonth > 12) {
        newMonth = 1; // Reset to January (next year)
        date.year = (parseInt(date.year) + 1).toString(); // Increment the year
      }
  
      date.month = newMonth.toString().padStart(2, '0'); // Ensure month is two digits
    }
  
    // Ensure day is two digits
    date.day = newDay.toString().padStart(2, '0'); 
}
