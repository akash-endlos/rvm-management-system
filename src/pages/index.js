import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '@/redux/reducers/authSlice';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import {
  Box,
  Button,
  CircularProgress,
  Container,
  TextField,
  Typography,
} from '@mui/material';

export default function Home() {
  const token = useSelector(state => state?.auth?.user?.token?.accessToken);
  const dispatch = useDispatch();
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (token) {
      router.push('/dashboard');
    }
  }, [token, router]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await dispatch(loginUser(data)).unwrap();
      router.push('/dashboard');
      reset();
      toast.success('Logged in successfully');
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="bg-gray-50">
      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          py: 8,
        }}
      >
        <Box
          sx={{
            width: '100%',
            backgroundColor: 'white',
            borderRadius: 'lg',
            boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
            my: 8,
            p: 4,
          }}
        >
          <Box sx={{ mb: 6 }}>
            <Typography
              variant="h5"
              component="h1"
              sx={{ fontWeight: 'bold', mb: 2 }}
            >
              Sign in
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                id="email"
                label="Email"
                variant="outlined"
                {...register('email', { required: 'Email is required' })}
                error={!!errors.email}
                helperText={errors.email?.message}
                fullWidth
                sx={{ mb: 3 }}
              />
              <TextField
                id="password"
                label="Password"
                type="password"
                variant="outlined"
                {...register('password', { required: 'Password is required' })}
                error={!!errors.password}
                helperText={errors.password?.message}
                fullWidth
                sx={{ mb: 3 }}
              />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Sign in'
                )}
              </Button>
            </form>
          </Box>
        </Box>
      </Container>
    </section>
  );
}
