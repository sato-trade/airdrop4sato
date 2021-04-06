import ethIcon from '../images/smallIcons/ethIcon.png'
import usdtIcon from '../images/smallIcons/usdtIcon.png'
import sapIcon from '../images/smallIcons/sapIcon.png';
import unknowCoinIcon from '../images/unknowCoinIcon.png';
import 'intl';
import 'intl/locale-data/jsonp/en';

export const FormatNumber = (number) => {
    if (!isNaN(number)) {
        return Intl.NumberFormat().format(number)
    }
}

export function getIcons(name, map, isSmall) {
    if (Object.keys(map).length !== 0 && map[name] !== undefined ) {
        let url = ''
        if (isSmall) {
            url = map[name].smallLogoUrl === undefined || map[name].smallLogoUrl === null ? '' : map[name].smallLogoUrl
        } else {
            url = map[name].bigLogoUrl === undefined || map[name].bigLogoUrl === null? '' : map[name].bigLogoUrl
        }
        return url === '' ? unknowCoinIcon : url
    } else {
        return unknowCoinIcon
    }

    // if (isSmall) {
    //     switch (coinName) {
    //         case "USDT":
    //             return usdtIcon
    //         case "ETH":
    //             return ethIcon
    //         case "SAP":
    //             return sapIcon
    //         default:
    //             return unknowCoinIcon
    //     }
    // } else {
    //     return unknowCoinIcon
    // }
}

export function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

export const convertTimeString = ( timeString ) => {
    let availableTime = new Date((Date.parse(timeString)));
    let minute = availableTime.getUTCMinutes() >= 10 ? availableTime.getUTCMinutes() : '0' + availableTime.getUTCMinutes().toString()
    return availableTime.getUTCFullYear() + '-' + (availableTime.getUTCMonth() + 1) + '-' + availableTime.getUTCDate() + ' ' +
        ('0' + availableTime.getUTCHours()).slice(-2) + ':' + minute;
}

export const formDateString = (timeStamp) => {
    let date = new Date(timeStamp);
    let dateString = date.getUTCFullYear() + '-' + (date.getUTCMonth() + 1) + '-' + date.getUTCDate() + ' ' +
        ('0' + date.getUTCHours()).slice(-2) + ':' + ('0' + date.getUTCMinutes()).slice(-2);
    return dateString
}

export const getChain = (networkId, chainId) => {
    switch (networkId && chainId) {
        case (1 & 1) :
            return 'ETH'
        case (128 & 128):
            return 'HECO'
        case (56 & 56):
            return 'BSC'
        case (3 & 3):
            return 'ETH'
        case (256 & 256):
            return 'HECO'
        case (97 & 97):
            return 'BSC'
    }
}

export const countDecimals = function (num) {
    if (isNumeric(parseFloat(num))) {
        if(Math.floor(num) === num) return 0;
        return num.toString().split(".")[1].length || 0;
    } else {
        return 0
    }

}
