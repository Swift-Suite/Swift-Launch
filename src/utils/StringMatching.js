

/**
 * Calculates the score between two characters depending on whether they match. These values can be adjusted.
 * @param {char} a 
 * @param {char} b 
 */
function score(a, b) {
    if (a === b) return 2;
    else if (a.toUpperCase() === b.toUpperCase) return 1;
    else return -1;
}

/**
 * Calculates the Edit distance (Levenshtein Distance) between two strings
 * @param {String} a First string to compare with
 * @param {String} b Second string to compare with
 */
function editDistance(a, b) {
    const dp = new Array(a.length+1);
    dp[0] = new Array(b.length+1);
    for (let j = 0; j <= b.length; ++j) dp[0][j] = -j;

    for (let i = 1; i <= a.length; ++i) {
        dp[i] = new Array(b.length+1);
        dp[i][0] = -i;
        for (let j = 1; j <= b.length; ++j) {
            const option1 = dp[i-1][j-1] + score(a[i-1], b[j-1]);
            const option2 = dp[i-1][j] - 1;
            const option3 = dp[i][j-1] - 1;
            dp[i][j] = Math.max(option1, option2, option3);
        }
    }
    return dp[a.length][b.length];
}

function searchSort(searchTerm, terms) {
    const ratings = new Array(terms.length);
    for (let i = 0; i < terms.length; ++i) {
        ratings[i] = [i,editDistance(searchTerm, terms[i])];
    }

    ratings.sort((a,b) => {
        return b[1] - a[1];
    });

    sortedTerms = new Array(terms.length);
    for (let i = 0; i < terms.length; ++i) {
        sortedTerms[i] = terms[ratings[i][0]];
    }

    return sortedTerms;
}


module.exports = {
    editDistance,
    sortedSort,
};


// FOR TESTING PUPOSES //
// let s = "Industrial Society and Its Future";

// console.log(editDistance(s, "Industal Soietie an its futrue"));
// console.log(editDistance(s, "Has Nothing to do with Industrial Society"));
// console.log(editDistance(s, 'Industrial Society and Its Future'));
// console.log(editDistance(s, "Bad No goodd"));
// console.log(editDistance(s, 'industrial soCiety aD itS fuTure'));
