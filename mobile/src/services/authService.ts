export const authService = {
  login: async (email, password) => {
    return { user: { uid: '123', email, displayName: 'CareDose User' } };
  },
  logout: async () => {
    return true;
  }
};
