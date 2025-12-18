const getDateString = (dateObj) => {
    const { day, month, year } = dateObj;
    return `${year}-${month}-${day}`;
}
export default getDateString;