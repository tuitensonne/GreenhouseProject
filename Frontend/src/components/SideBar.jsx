import React, { useState } from 'react'
import { Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Toolbar, Typography, TextField, InputAdornment, Box, Button} from '@mui/material'
import { Home, Storage, Devices, CalendarToday, History, Search} from '@mui/icons-material'
import { useLocation, useNavigate } from 'react-router-dom'
const drawerWidth = 240;

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const menuItems = [
    {
      text: 'Home',
      icon: <Home sx={{ color: 'black' }} />,
      path: '/'
    },
    { text: 'Data', icon: <Storage sx={{ color: 'black' }} />, path: '/data' },
    { text: 'Devices', icon: <Devices sx={{ color: 'black' }} />, path: '/devices' },
    { text: 'Schedule', icon: <CalendarToday sx={{ color: 'black' }} />, path: '/schedule' },
    { text: 'History', icon: <History sx={{ color: 'black' }} />, path: '/history' }
  ]

  const filteredItems = menuItems.filter(item => item.text.toLowerCase().includes(searchTerm.toLowerCase()))
  const isAuthenticated = !!localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/Login');
  }

  console.log(isAuthenticated);
  return (
    <Drawer
      variant='permanent'
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#84FB9D',
          color: 'black',
          padding: 2
        }
      }}
    >
      <Toolbar>
        <Typography variant='h5' sx={{ fontWeight: 'bold', width: '100%' }} textAlign={'center'}>
          Green House
        </Typography>
      </Toolbar>
      <TextField
        fullWidth
        variant='outlined'
        placeholder='Search...'
        size='small'
        sx={{ marginBottom: 2, backgroundColor: 'white', borderRadius: 1 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position='start'>
              <Search />
            </InputAdornment>
          )
        }}
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <List>
        {filteredItems.map((item, index) => (
          <ListItem key={index} disablePadding>
            <ListItemButton
              sx={{ backgroundColor: location.pathname === item.path ? 'white' : 'transparent' }}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon sx={{ color: 'white' }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      {!isAuthenticated ?
        (
          <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            <Button variant='outlined' color='primary' fullWidth onClick={() => navigate('/Login')}>
              Log In
            </Button>
            <Button variant='contained' color='primary' fullWidth onClick={() => navigate('/Signup')}>
              Sign Up
            </Button>
          </Box>
        ):(
          <Box sx={{ marginTop: 'auto', display: 'flex', flexDirection: 'column', gap: 1, p: 2 }}>
            <Button variant='outlined' color='primary' fullWidth onClick={handleLogout}>
              Log out
            </Button>
          </Box>
        )
      }
      
    </Drawer>
  );
};

export default Sidebar;
