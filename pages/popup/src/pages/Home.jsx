import { Button } from '@mui/material';
import { navigationAtom } from '@src/atoms';
import { useSetRecoilState } from 'recoil';

const Home = () => {
  const setNav = useSetRecoilState(navigationAtom);

  

  const logout = async () => {
    await chrome.storage.session.clear();
    await chrome.storage.local.clear();
    setNav('LOGIN');
  };


  return (
    <div>
      <h1>Home</h1>
      <Button onClick={logout}>logout</Button>
    </div>
  );
};

export default Home;
