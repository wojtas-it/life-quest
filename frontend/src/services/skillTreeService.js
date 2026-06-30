import api from './api';

export const skillTreeService = {
  getSkillTree: async () => {
    const response = await api.get('/skilltree');
    return response;
  },
};
