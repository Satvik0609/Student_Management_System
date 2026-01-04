const LOCAL_USERS_KEY = 'sr-local-users';
const ACTIVE_LOCAL_USER_KEY = 'sr-local-active-user';

const encode = (value) => {
  try {
    return btoa(value);
  } catch {
    return value;
  }
};

const decode = (value) => {
  try {
    return atob(value);
  } catch {
    return value;
  }
};

const getLocalUsers = () => {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(LOCAL_USERS_KEY)) || [];
  } catch {
    return [];
  }
};

const saveLocalUsers = (users) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
};

export const registerLocalUser = ({ name, email, password, role = 'student' }) => {
  const users = getLocalUsers();
  if (users.some((user) => user.email === email)) {
    throw new Error('User already exists (local)');
  }
  const user = {
    id: `local-${Date.now()}`,
    name,
    email,
    password: encode(password),
    role
  };
  users.push(user);
  saveLocalUsers(users);
  const { password: _pw, ...publicUser } = user;
  return publicUser;
};

export const loginLocalUser = (email, password) => {
  const users = getLocalUsers();
  const user = users.find((u) => u.email === email);
  if (!user) {
    throw new Error('No account found (local mode)');
  }
  const matches = decode(user.password) === password;
  if (!matches) {
    throw new Error('Invalid credentials (local mode)');
  }
  const { password: _pw, ...publicUser } = user;
  return publicUser;
};

export const storeActiveLocalUser = (user) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACTIVE_LOCAL_USER_KEY, JSON.stringify(user));
};

export const getActiveLocalUser = () => {
  if (typeof window === 'undefined') return null;
  try {
    return JSON.parse(localStorage.getItem(ACTIVE_LOCAL_USER_KEY));
  } catch {
    return null;
  }
};

export const clearActiveLocalUser = () => {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACTIVE_LOCAL_USER_KEY);
};

