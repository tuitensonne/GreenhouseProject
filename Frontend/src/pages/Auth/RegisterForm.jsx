import React from 'react'
import {
  Box,
  Button,
  Checkbox,
  Container,
  Divider,
  FormControlLabel,
  Grid,
  Paper,
  TextField,
  Typography
} from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import { Link } from 'react-router-dom'
const RegisterForm = () => {
  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Paper
        stroke="black"
        sx={{
          p: 5,
          borderRadius: 12,
          width: '100%',
          backdropFilter: 'blur(5px)',
          backgroundColor: 'rgba(255, 255, 255, 0.3)'
        }}>
        <Typography variant="h4" component="h1" gutterBottom textAlign="center">
                Sign Up Free
        </Typography>

        <Box component="form" noValidate sx={{ mt: 2 }}>

          {/* Username */}
          <TextField fullWidth label="Username" variant="outlined" margin="normal" />

          {/* Email */}
          <TextField fullWidth label="Email" type="email" variant="outlined" margin="normal" />

          {/* Phone Number */}
          <TextField fullWidth label="Phone Number" type="tel" variant="outlined" margin="normal" />

          {/* Password */}
          <TextField fullWidth label="Password" type="password" variant="outlined" margin="normal" />

          {/* Confirm Password */}
          <TextField fullWidth label="Confirm Password" type="password" variant="outlined" margin="normal" />

          {/* Terms & Conditions */}
          <FormControlLabel control={<Checkbox color="success" />} label="I agree to the Terms and Conditions" sx={{ display: 'flex', justifyContent: 'center', width: '100%' }} />

          {/* Register Button */}
          <Button type="submit" fullWidth variant="contained" color="success" sx={{ mt: 2, py: 1.5 }}>
                    Register
          </Button>
        </Box>

        {/* Divider */}
        <Divider sx={{ my: 3 }} color='black'></Divider>

        {/* Login Link */}
        <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Already have an account?{' '}
          <Typography
            component={Link} // Bọc Link trong Typography
            to="/Login"
            color="primary"
            sx={{ fontWeight: 'bold', textDecoration: 'none', cursor: 'pointer' }}
          >
            Login
          </Typography>
        </Typography>
      </Paper>
    </Container>
  )
}

export default RegisterForm