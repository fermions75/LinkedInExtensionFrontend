import { Box, Button, CircularProgress, Stack, styled, TextField, Typography } from '@mui/material';
import { navigationAtom, PAGES } from '@src/atoms';
import { apiGetAllCommentTypes, apiGetAllPersonas, apiGetUser, apiLogin } from '@src/util';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useSetRecoilState } from 'recoil';
import {
  AutoAwesomeRounded as AutoAwesomeRoundedIcon,
  Email as EmailIcon,
  Lock as LockIcon,
} from '@mui/icons-material';

const CustomTextField = styled(TextField)(() => ({
  '& .MuiInputBase-root': {
    backgroundColor: '#f5edeb',
    borderRadius: '12px',
    height: '30px',
    padding: '0 14px',
    '&:hover fieldset': {
      borderColor: 'transparent',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'transparent',
    },
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'transparent',
    },
  },
  '& .MuiInputBase-input': {
    color: 'black',
    height: 'inherit',
    padding: '10px 0',
  },
}));

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
      await apiGetUser();
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
      gap={2}
      px={2}>
      <Box display="flex" alignItems="center" gap={1} width="100%">
        <AutoAwesomeRoundedIcon sx={{ color: 'blue' }} />
        <Typography variant="h6">AlgoClan AI</Typography>
      </Box>

      <Box width="100%">
        <Typography fontSize="12px" display="flex" alignItems="center">
          <EmailIcon fontSize="small" style={{ marginRight: '4px' }} />
          Email
        </Typography>
        <CustomTextField
          autoComplete="off"
          type="email"
          fullWidth
          value={email}
          onChange={e => setEmail(e.target.value)}
          size="small"
        />
        <Typography fontSize="12px" display="flex" alignItems="center" mt={1}>
          <LockIcon fontSize="small" style={{ marginRight: '4px' }} />
          Password
        </Typography>
        <CustomTextField
          fullWidth
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          size="small"
        />
      </Box>

      <Button
        fullWidth
        variant="contained"
        onClick={login}
        sx={{
          minWidth: '200px',
          backgroundColor: '#0097b4',
          textTransform: 'none',
          '&:hover': {
            backgroundColor: '#21879a',
          },
        }}>
        {loading ? <CircularProgress color="inherit" size={18} /> : 'Login'}
      </Button>
      <Typography variant="text" fontSize="12px" mb={1}>
        Do not have an account?{' '}
        <a href="https://algoclanai.vercel.app/auth/signup" target="_blank" style={{ color: 'blue' }} rel="noreferrer">
          Sign Up
        </a>
      </Typography>
    </Stack>
  );
};

export default Login;
