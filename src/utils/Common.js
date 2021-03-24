import ethIcon from '../images/smallIcons/ethIcon.png'
import usdtIcon from '../images/smallIcons/usdtIcon.png'
import sapIcon from '../images/smallIcons/sapIcon.png';

import unknowCoinIcon from '../images/unknowCoinIcon.png';



export function getIcons(coinName, map, isSmall) {
    if (Object.keys(map).length !== 0 && map[coinName] !== undefined ) {
        let url = ''
        if (isSmall) {
            url = map[coinName].smallLogoUrl === undefined || map[coinName].smallLogoUrl === null ? '' : map[coinName].smallLogoUrl
        } else {
            url = map[coinName].bigLogoUrl === undefined || map[coinName].bigLogoUrl === null? '' : map[coinName].bigLogoUrl
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
