import { Button, CircularProgress, Stack, TextField, Typography } from '@mui/material';
import { navigationAtom, PAGES } from '@src/atoms';
import { apiGetAllCommentTypes, apiGetAllPersonas, apiLogin } from '@src/util';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const setNav = useSetRecoilState(navigationAtom);

  const login = async () => {
    setLoading(true);

    try {
      await apiLogin(email, password);
      await apiGetAllPersonas();
      await apiGetAllCommentTypes();
      setNav(PAGES.HOME);
    } catch (e) {
      console.log(e);
      toast.error('Invalid email or password');
    }
    setLoading(false);
  };
  return (
    <Stack
      width="100%"
      height="100%"
      display="flex"
      justifyContent="center"
      alignItems="center"
      className="popup"
      gap={2}>
      <Typography variant="h6">Login</Typography>
      <TextField label="Email" value={email} onChange={e => setEmail(e.target.value)} size="small" />
      <TextField
        label="Password"
        type="password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        size="small"
      />

      <Button variant="contained" color="primary" onClick={login} sx={{ minWidth: '200px' }}>
        {loading ? <CircularProgress color="inherit" size={18} /> : 'Login'}
      </Button>
    </Stack>
  );
};

export default Login;
