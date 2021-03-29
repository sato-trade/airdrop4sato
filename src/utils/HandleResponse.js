import { authService } from '../redux/services/authServices';

export function handleResponse(response) {
    return response.text().then(text => {
        const data = text && JSON.parse(text);
        if (!response.ok) {
            if (response.status === 401) {
                authService.logOut();
                // eslint-disable-next-line no-restricted-globals
                location.reload();
            }
            const error = (data && data.message) || response.statusText;
            return Promise.reject(data);
        }
        return data;
    });
}
