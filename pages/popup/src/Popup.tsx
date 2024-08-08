import { CircularProgress, Stack } from '@mui/material';
import '@src/Popup.css';
import { useRecoilState } from 'recoil';
import { navigationAtom, PAGES } from './atoms';
import Login from './pages/Login';
import Home from './pages/Home';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useEffect } from 'react';
import { apiGetAllCommentTypes, apiGetAllPersonas, apiGetUser, apiRefreshToken } from './util';

const Popup = () => {
  const [navState, setNav] = useRecoilState(navigationAtom);

  useEffect(() => {
    const asyncCheck = async () => {
      const localData = await chrome.storage.local.get('authInfo');
      if (!localData.authInfo) return setNav(PAGES.LOGIN);
      try {
        await apiRefreshToken();
        await apiGetAllPersonas();
        await apiGetAllCommentTypes();
        await apiGetUser()
        return setNav(PAGES.HOME);
      } catch (e) {
        console.log(e);
        toast.info('Login expired, please login again.');
      }

      return setNav(PAGES.LOGIN);
    };
    asyncCheck();
  }, []);

  return (
    <Stack width="100%" height="100%" justifyContent="center" alignItems="center">
      <ToastContainer />
      {navState === PAGES.LOADING && <CircularProgress color="primary" size={24} />}
      {navState === PAGES.LOGIN && <Login />}
      {navState === PAGES.HOME && <Home />}
    </Stack>
  );
};

export default Popup;
