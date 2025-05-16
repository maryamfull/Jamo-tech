import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Login from '../src/components/pages/Login';


beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test('renders login form elements', () => {
  renderWithRouter(<Login />);
  expect(screen.getByLabelText(/Username:/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/Passowrd:/i)).toBeInTheDocument(); // Typo from original code
  expect(screen.getByText(/Login/i)).toBeInTheDocument();
});

test('shows username error when username is empty', async () => {
  renderWithRouter(<Login />);
  fireEvent.change(screen.getByLabelText(/Passowrd:/i), {
    target: { value: 'password123' },
  });
  fireEvent.click(screen.getByText(/Login/i));
  expect(await screen.findByText(/Username is required/i)).toBeInTheDocument();
});

test('shows password error when password is empty', async () => {
  renderWithRouter(<Login />);
  fireEvent.change(screen.getByLabelText(/Username:/i), {
    target: { value: 'user1' },
  });
  fireEvent.click(screen.getByText(/Login/i));
  expect(await screen.findByText(/Passowrd is required/i)).toBeInTheDocument();
});

test('redirects if already logged in', () => {
  localStorage.setItem('isLoggedIn', 'true');
  renderWithRouter(<Login />);
  expect(mockNavigate).toHaveBeenCalledWith('/');
});
