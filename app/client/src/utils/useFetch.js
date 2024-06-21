export default async function useFetch(url, method, body) {
    const API_URL = import.meta.env.VITE_API_URL;

    if (!API_URL || !url || !method)
        throw new Error('Invalid parameters');

    const headers = {
        'Content-Type': 'application/json',
    };

    if (body.requireToken) {
        const token = localStorage.getItem('PRODLoginData');
        if (!token)
            throw new Error('No token found (Unauthorized)');
        headers['Authorization'] = 'Bearer ' + token;
    }

    try {
        const options = {
            method: method,
            headers: headers
        };

        if (body.input)
            options.body = JSON.stringify(body.input);

        return (await fetch(API_URL + url, options));
    } catch (error) {
        throw new Error('Error fetching data');
    }
}
