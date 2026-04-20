export type MockUser = {
  id: string;
  email: string;
  password: string;
  fullName: string;
};

export const MOCK_USERS: MockUser[] = [
  {
    id: 'u1',
    email: 'demo@unica.vn',
    password: '123456',
    fullName: 'Demo User',
  },
];

