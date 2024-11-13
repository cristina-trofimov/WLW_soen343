import React, { useState } from 'react';
import classes from '../routes/Layout.module.css';
import {
  Drawer,
  TextInput,
  PasswordInput,
  Button,
  Tabs,
  Box,
  Text,
  Alert,
} from '@mantine/core';
import axiosClient from '../axiosClient';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface DrawerProps {
  opened: boolean;
  onClose: () => void;
}

const LoginRegisterDrawer: React.FC<DrawerProps> = ({ opened, onClose }) => {
  const [activeTab, setActiveTab] = useState<string | null>('login');

  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerConfirmPassword, setRegisterConfirmPassword] = useState('');

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [registerError, setRegisterError] = useState<string | null>(null);
  const [emailError, setEmailError] = useState<string | null>(null);

  const navigate = useNavigate();

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailValidator(loginEmail);

    try {
        await axiosClient.post('/login', { loginEmail, loginPassword })
        sessionStorage.setItem("isLogged", "true");
        navigate("/home")
        onClose();
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const response = error.response;
            if (response?.status === 401) {
                const errorMessage = (response.data as { error?: string }).error;
                setSubmitError(errorMessage ? errorMessage : null);
            }
        }
    }
  };

  const handleEmailValidator = (email: string) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    setEmailError(!emailPattern.test(email) ? "This email isn't valid" : null);
    return;
  };

  const handleRegisterPassword = () => {
    setRegisterError((registerPassword !== registerConfirmPassword) ? 'Passwords do not match' : null);
    return;
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    handleEmailValidator(registerEmail);
    handleRegisterPassword();

    try {
        const response = await axiosClient.post('/register', { registerEmail, registerPassword })
        if(response.status === 201) {
            console.log('Register submitted:', { email: registerEmail, password: registerPassword });
            // navigate somewhere else or login immediatly?
            onClose();
        } else {
            setSubmitError(response.data.error);
        }
    } catch (error) {
        if (axios.isAxiosError(error)) {
            const response = error.response;
            if (response?.status === 409) {
                const errorMessage = (response.data as { error?: string }).error;
                setSubmitError(errorMessage ? errorMessage : null);
            }
        }
    }
  };

  const resetErrors = (tab: string | null) => {
    setActiveTab(tab);
    if (tab) {
        setSubmitError(null)
        setRegisterError(null)
        setEmailError(null)
    }
  };

  return (
    <Drawer opened={opened} onClose={onClose} title="loginRegister" padding="xl" size="md">
    {/* position="right" => for drawer to open from the right */}
      <Tabs value={activeTab} onChange={resetErrors}>
        <Tabs.List>
          <Tabs.Tab value="login">Login</Tabs.Tab>
          <Tabs.Tab value="register">Register</Tabs.Tab>
        </Tabs.List>

        {submitError && (
            <Alert color="red" variant='filled'>
                <Text color='red.9'>{submitError}</Text>
            </Alert>
        )}

        <Tabs.Panel value="login">
          <form onSubmit={handleLoginSubmit}>
          
            <Box mt="md">
              <TextInput
                required
                label="Email"
                placeholder="your@email.com"
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.currentTarget.value)}
                error={emailError}
                onBlur={(e) => handleEmailValidator(e.currentTarget.value)}
              />
            </Box>
            <Box mt="md">
              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.currentTarget.value)}
              />
            </Box>
            <Box mt="xl">
              <Button type="submit" fullWidth>
                Login
              </Button>
            </Box>
          </form>
        </Tabs.Panel>

        <Tabs.Panel value="register">
          <form onSubmit={handleRegisterSubmit}>
            <Box mt="md">
              <TextInput
                required
                label="Email"
                placeholder="your@email.com"
                value={registerEmail}
                onChange={(e) => setRegisterEmail(e.currentTarget.value)}
                error={emailError}
                onBlur={(e) => handleEmailValidator(e.currentTarget.value)}
              />
            </Box>
            <Box mt="md">
              <PasswordInput
                required
                label="Password"
                placeholder="Your password"
                value={registerPassword}
                error={registerError}
                onChange={(e) => setRegisterPassword(e.currentTarget.value)}
              />
            </Box>
            <Box mt="md">
              <PasswordInput
                required
                label="Confirm Password"
                placeholder="Confirm your password"
                value={registerConfirmPassword}
                error={registerError}
                onChange={(e) => setRegisterConfirmPassword(e.currentTarget.value)}
                onBlur={handleRegisterPassword}
              />
            </Box>
            <Box mt="xl">
              <Button type="submit" fullWidth>
                Register
              </Button>
            </Box>
          </form>
        </Tabs.Panel>
      </Tabs>
    </Drawer>
  );
};

const LoginRegister = () => {
  const [drawerOpened, setDrawerOpened] = useState(false);

  return (
    <div>
      <Button className={classes.loginButton} ml="xl" onClick={() => setDrawerOpened(true)}>Login/Register</Button>
      <LoginRegisterDrawer opened={drawerOpened} onClose={() => setDrawerOpened(false)} />
    </div>
  );
};

export default LoginRegister;