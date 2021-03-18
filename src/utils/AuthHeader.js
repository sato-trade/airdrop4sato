export function authHeader() {
    let user = localStorage.getItem('user');

    if (user) {
        return { 'Authorization': 'Bearer ' + user, 'Content-Type': 'application/json' };
    } else {
        return {};
    }
}
