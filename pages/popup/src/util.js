const APP_URL = 'https://algoclan-extension-46b54a91a23b.herokuapp.com';

export const apiLogin = async (email, password) => {
  const response = await fetch(`${APP_URL}/api/auth/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await response.json();
  await chrome.storage.local.set({ authInfo: data });

  return data;
};

export const apiGetAllPersonas = async () => {
  const { authInfo } = await chrome.storage.local.get('authInfo');
  const response = await fetch(`${APP_URL}/api/personas`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authInfo.token}`,
    },
  });

  const data = await response.json();
  await chrome.storage.local.set({ personas: data });
  return data;
};

export const apiGetAllCommentTypes = async () => {
  const data = [
    {
      _id: "1",
      name: 'Positive',
      prompt: 'Make a positive comment',
    },
    {
      _id: "2",
      name: 'Negative',
      prompt: 'Make a negative comment',
    },
    {
      _id: "3",
      name: 'Happy',
      prompt: 'Make a happy comment',
    },
    {
      _id: "4",
      name: 'Sad',
      prompt: 'Make a sad comment',
    },
  ];

  await chrome.storage.local.set({ commentTypes: data });

  return data;
};

export const apiRefreshToken = async () => {
  let { authInfo } = await chrome.storage.local.get('authInfo');
  const response = await fetch(`${APP_URL}/api/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${authInfo.token}`,
    },
    body: JSON.stringify({ token: authInfo.refreshToken }),
  });

  if (response.status !== 200) {
    await chrome.storage.local.clear();
    throw new Error('Invalid token');
  }

  const data = await response.json();

  authInfo = { ...authInfo, ...data };
  await chrome.storage.local.set({ authInfo });
  return data;
};

export const apiGetUser = async () => {
  let { authInfo } = await chrome.storage.local.get('authInfo');
  const email = authInfo?.user?.email;
  const response = await fetch(`${APP_URL}/api/auth/getUser`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });
  
  const data = await response.json();

  authInfo = { ...authInfo, ...data };
  await chrome.storage.local.set({ authInfo });
  return data;
};