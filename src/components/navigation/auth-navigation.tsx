import React, { FC, useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { CircularProgress } from '@mui/material';

const AuthNavigation: FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [user, setUser] = useState<{ email: string; image?: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [isAvatarClicked, setIsAvatarClicked] = useState(false);
  const [isEditing, setIsEditing] = useState(false); // To track if the user is editing the profile

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleOpen = (isLoginMode: boolean) => {
    setIsLogin(isLoginMode);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEmail('');
    setPassword('');
    setImage(null);
    setIsEditing(false); // Reset editing state when closing the dialog
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      alert('Please fill out all fields.');
      return;
    }

    setLoading(true);

    if (isLogin) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      if (storedUser.email === email && storedUser.password === password) {
        setUser(storedUser);
        alert('Login successful!');
        handleClose();
      } else {
        alert('Invalid email or password.');
      }
    } else {
      const userInfo = {
        email,
        password,
        image: image ? URL.createObjectURL(image) : undefined,
      };
      localStorage.setItem('user', JSON.stringify(userInfo));
      setUser(userInfo);
      alert('Sign-up successful! Please log in.');
      handleClose();
    }
    
    setLoading(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    setUser(null);
    setIsAvatarClicked(false); // Reset avatar click state on logout
  };

  const toggleAvatarMenu = () => {
    setIsAvatarClicked(!isAvatarClicked);
  };

  const handleEditProfile = () => {
    setIsEditing(true);
    setEmail(user?.email || '');
    setImage(user?.image ? new File([], user.image) : null); // Optionally set the current image if any
  };

  const handleSaveProfile = () => {
    if (!email) {
      alert('Please provide a valid email.');
      return;
    }
    setLoading(true);

    const updatedUser = {
      email,
      image: image ? URL.createObjectURL(image) : user?.image,
    };
    
    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditing(false); // Exit edit mode
    alert('Profile updated successfully!');
    setLoading(false);
  };

  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 2 }}>
      {!user ? (
        <>
          <Button
            variant="contained"
            color="primary"
            onClick={() => handleOpen(true)}
            sx={{
              minWidth: 120,
              borderRadius: 20,
              boxShadow: 2,
              '&:hover': { boxShadow: 3 },
            }}
          >
            Sign In
          </Button>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => handleOpen(false)}
            sx={{
              minWidth: 120,
              borderRadius: 20,
              '&:hover': { backgroundColor: 'primary.main', color: 'white' },
            }}
          >
            Sign Up
          </Button>
        </>
      ) : (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 50,
              height: 50,
              borderRadius: '50%',
              backgroundColor: 'primary.main',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              border: '2px solid white',
              cursor: 'pointer',
            }}
            onClick={toggleAvatarMenu} // Toggle visibility of the menu on avatar click
          >
            {user.image ? (
              <img
                src={user.image}
                alt="User"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ color: 'white', fontWeight: 'bold', fontSize: '20px' }}>
                {user.email[0].toUpperCase()}
              </span>
            )}
          </Box>

          {/* Show Edit Profile and Logout buttons if avatar is clicked */}
          {isAvatarClicked && (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Button
                variant="outlined"
                color="primary"
                sx={{
                  borderRadius: 20,
                  minWidth: 120,
                  boxShadow: 2,
                  '&:hover': { backgroundColor: 'primary.main', color: 'white' },
                }}
                onClick={handleEditProfile}
              >
                Edit Profile
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                sx={{
                  borderRadius: 20,
                  minWidth: 120,
                  boxShadow: 2,
                  '&:hover': { backgroundColor: 'secondary.main', color: 'white' },
                }}
                onClick={handleLogout}
              >
                Logout
              </Button>
            </Box>
          )}
        </Box>
      )}

      <Dialog
        open={open || isEditing}
        onClose={handleClose}
        sx={{
          '& .MuiDialog-paper': {
            borderRadius: 16,
            padding: 3,
            boxShadow: 4,
            minWidth: 400,
          },
        }}
      >
        <DialogTitle sx={{ textAlign: 'center', fontWeight: 'bold', color: 'primary.main' }}>
          {isLogin ? 'Sign In' : isEditing ? 'Edit Profile' : 'Sign Up'}
        </DialogTitle>
        <DialogContent>
          <Box
            component="form"
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: 10,
                },
              }}
            />
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              variant="outlined"
              sx={{
                '& .MuiInputBase-root': {
                  borderRadius: 10,
                },
              }}
              disabled={isEditing} // Disable password input when editing profile
            />
            {!isLogin && !isEditing && (
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImage(e.target.files?.[0] || null)}
                style={{ marginTop: 8 }}
              />
            )}
            <Button
              variant="contained"
              color="primary"
              onClick={isEditing ? handleSaveProfile : handleSubmit}
              sx={{
                minWidth: 120,
                borderRadius: 20,
                height: 45,
                fontSize: '16px',
                mt: 2,
                boxShadow: 3,
                '&:hover': { boxShadow: 4 },
              }}
            >
              {loading ? <CircularProgress size={24} color="secondary" /> : isEditing ? 'Save Profile' : isLogin ? 'Sign In' : 'Sign Up'}
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default AuthNavigation;
