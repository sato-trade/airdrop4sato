import bigDecimal from 'js-big-decimal';
export const roundingDown = (number, places) => {
    if (number === null) {
        number = 0
    }
    if (!isNaN(number)) {
        if (Math.abs(number) < 0.000001 && number > 0) {
            let bd = new bigDecimal(number)
            return bd.round(places, bigDecimal.RoundingModes.DOWN).value
        }
        let numString = number.toString();
        let strLen = numString.length;
        let dotIndex = numString.indexOf('.');

        if (dotIndex === -1) {
            return numString;
        } else {
            if (dotIndex + places + 1 > strLen) {
                return numString;
            } else {
                return numString.substring(0, dotIndex + places + 1);
            }
        }
    } else {
        // console.log('roundingDown failed ! Invalid number: ', number, places)

    }

};

