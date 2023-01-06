const sortArray = array => {
    let sortedArray = [];
        sortedArray = [...array].sort((a,b) => +b.price - +a.price) 
    return sortedArray;
};

module.exports = sortArray;