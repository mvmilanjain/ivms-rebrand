const signIn = (username, password) => ({
    baseURL: process.env.REACT_APP_AUTH_API_BASE_URL,
    url: '/token', method: 'post', params: {grant_type: 'password'},
    data: {username, password, client_id: process.env.REACT_APP_CLIENT_ID}
});

const refreshAuthorization = (refresh_token) => ({
    baseURL: process.env.REACT_APP_AUTH_API_BASE_URL,
    url: '/token', method: 'post', params: {grant_type: 'refresh_token'},
    data: {refresh_token, client_id: process.env.REACT_APP_CLIENT_ID}
});

export {signIn, refreshAuthorization};