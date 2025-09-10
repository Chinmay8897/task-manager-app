// User interface
interface User {
  id: string;
  name: string;
  email: string;
}

// Authentication state interface
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Login credentials interface
interface LoginCredentials {
  email: string;
  password: string;
}

// Register credentials interface
interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

// Export all interfaces
export type { User, AuthState, LoginCredentials, RegisterCredentials };
export { type User as UserType, type AuthState as AuthStateType, type LoginCredentials as LoginCredentialsType, type RegisterCredentials as RegisterCredentialsType };