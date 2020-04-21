/*
Params : range : JSON {left, right} 
        tester : Boolean
Return new range or the founded value
*/
/**
 * Do one step of a dichotomic research
 *
 * @param  {Number} left left border of the possible values
 * @param  {Number} right right border of the possible values
 * @param  {Number} right middle value
 * @param  {Boolean} tester test value, true if the value is bigger than middle value, else false
 * @return {Object} if the algorithm has finised, return the end value, else return the new borders values
 */
exports.bisectFunction = (left, right, mid, tester) => {

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
                'right': right
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
