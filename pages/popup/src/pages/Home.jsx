import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  IconButton,
  LinearProgress,
  linearProgressClasses,
  Menu,
  MenuItem,
  Stack,
  styled,
  Typography,
} from '@mui/material';
import {
  AutoAwesomeRounded as AutoAwesomeRoundedIcon,
  MoreHoriz as MoreHorizIcon,
  Sync as SyncIcon,
  GroupsOutlined as GroupsOutlinedIcon,
  AddOutlined as AddOutlinedIcon,
  OpenInNew as OpenInNewIcon,
  Diversity2Outlined as Diversity2OutlinedIcon,
} from '@mui/icons-material';
import { navigationAtom, PAGES } from '@src/atoms';
import { useSetRecoilState } from 'recoil';
import { apiGetAllCommentTypes, apiGetAllPersonas, apiGetUser, apiRefreshToken } from '@src/util';
import { toast } from 'react-toastify';

const BorderLinearProgress = styled(LinearProgress)(() => ({
  height: 12,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: '#f2f2f2',
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: '#0097b4',
  },
}));

const Home = () => {
  const setNav = useSetRecoilState(navigationAtom);

  const [authInfo, setAuthInfo] = useState([]);

  const logout = async () => {
    await chrome.storage.session.clear();
    await chrome.storage.local.clear();
    setNav('LOGIN');
    handleClose();
  };

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = () => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  useEffect(() => {
    chrome.storage.local.get(['authInfo']).then(({ authInfo }) => {
      setAuthInfo(authInfo || []);
    });
  }, []);

  const value = (authInfo?.availableRequest / 1000) * 100;

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
      <Box width="100%" display="flex" alignItems="center" justifyContent="space-between">
        <Box display="flex" alignItems="center" gap={1} width="100%">
          <AutoAwesomeRoundedIcon sx={{ color: 'blue' }} />
          <Typography variant="h6">AlgoClan AI</Typography>
        </Box>
        <Box>
          <IconButton
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            <MoreHorizIcon />
          </IconButton>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}>
            <MenuItem onClick={handleClose}>View Dashboard</MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </Menu>
        </Box>
      </Box>

      <Box width="100%">
        <Typography fontSize="14px">Credits: {value}</Typography>
        <BorderLinearProgress variant="determinate" value={value} />
      </Box>
      <Box
        sx={{
          background: '#f5edeb',
          height: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '12px',
          width: '100%',
        }}>
        <Typography fontSize="12px" display="flex" alignItems="center" ml={1}>
          <GroupsOutlinedIcon fontSize="small" style={{ marginRight: '8px' }} />
          Personas: {authInfo?.personaCount}
        </Typography>
        <IconButton sx={{ p: 0, mr: 1 }}>
          <AddOutlinedIcon />
        </IconButton>
      </Box>
      <Box
        sx={{
          background: '#f5edeb',
          height: '30px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderRadius: '12px',
          width: '100%',
        }}>
        <Typography fontSize="12px" display="flex" alignItems="center" ml={1} textTransform='capitalize'>
          <Diversity2OutlinedIcon fontSize="small" style={{ marginRight: '8px' }} />
          Plan: {authInfo?.status}
        </Typography>
        <IconButton sx={{ p: 0, mr: 1 }}>
          <OpenInNewIcon sx={{ fontSize: '18px' }} />
        </IconButton>
      </Box>

      <Button
        fullWidth
        startIcon={<SyncIcon sx={{ color: '#000' }} />}
        variant="contained"
        onClick={asyncCheck}
        sx={{
          minWidth: '200px',
          height: '35px',
          backgroundColor: '#D9D9D9',
          color: '#000',
          textTransform: 'none',
          borderRadius: '12px',
          fontWeight: 600,
          '&:hover': {
            backgroundColor: '#D9D9D960',
          },
        }}>
        Synchronize
      </Button>
    </Stack>
  );
};

export default Home;
