import api from './api';

export const statsService = {
  getStats: async (period = 7) => {
    const response = await api.get('/stats', { params: { period } });
    return response;
  },
};
