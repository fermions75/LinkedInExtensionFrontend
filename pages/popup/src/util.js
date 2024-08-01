const APP_URL='https://algoclan-extension-46b54a91a23b.herokuapp.com';


export const apiLogin = async (email, password) => {
    const response = await fetch(`${APP_URL}/api/auth/login`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    });
    const data = await response.json();
    await chrome.storage.local.set({authInfo: data});

    return data;
}


export const apiGetAllPersonas = async () => {

    const {authInfo} = await chrome.storage.local.get('authInfo');
    const response = await fetch(`${APP_URL}/api/personas`, {
        method: 'GET',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authInfo.token}`,
        },
    });

    const data = await response.json();
    await chrome.storage.local.set({personas: data});
    return data;
}


export const apiRefreshToken = async () => {
    let {authInfo} = await chrome.storage.local.get('authInfo');
    const response = await fetch(`${APP_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authInfo.token}`,
        },
        body: JSON.stringify({ token: authInfo.refreshToken }),
    });

    if(response.status!==200){
        await chrome.storage.local.clear();
        throw new Error('Invalid token');
    }

    const data = await response.json();

    authInfo ={...authInfo, ...data}; 
    await chrome.storage.local.set({authInfo});
    return data;
}