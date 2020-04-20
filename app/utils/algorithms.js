/*
Params : range : JSON {left, right} 
        tester : Boolean
Return new range or the founded value
*/
exports.bisect = (left, right, mid, tester) => {

    if (left + 1 < right) {

        if (tester) {
            right = mid;
        }
        else {
            left = mid;
        }

        if (left + 1 >= right) {
            return {
                'finish': true,
                'value': left
            }
        }
        else {
            return {
                'finish': false,
                'left': left,
                'right': right,
                'mid': mid
            }
        }
    }
    else {
        return {
            'finish': true,
            'value': left
        }
    }
}
