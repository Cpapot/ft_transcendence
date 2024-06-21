
export function SetUserStorage(data) {
    if (data.username && data.email && data.avatar) {
        localStorage.setItem('PRODProfile', JSON.stringify({ 
            login: data.username,
            email: data.email,
            avatar: data.avatar
        }));
        window.route.loadView('/');
    }
}

export async function SetAuthStorage(data) {
    localStorage.clear();
    if (data.access && data.refresh) {
        localStorage.setItem('PRODLoginData', data.access);
        localStorage.setItem('PRODRefreshData', data.refresh);
    }
    if (data.double_auth) {
        window.route.loadView('/two_factor_authentication_code');
        return;
    }
    SetUserStorage(data);
}
