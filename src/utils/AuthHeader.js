export function authHeader(user) {
    if (user !== '') {
        return { 'Authorization': 'Bearer ' + user, 'Content-Type': 'application/json' };
    } else {
        return {};
    }
}
