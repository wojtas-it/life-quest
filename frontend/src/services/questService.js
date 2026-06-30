import api from './api';

export const questService = {
  getQuests: async () => {
    const response = await api.get('/quests');
    return response;
  },

  createQuest: async (questData) => {
    const response = await api.post('/quests', questData);
    return response;
  },

  completeQuest: async (questId) => {
    const response = await api.patch(`/quests/${questId}/complete`);
    return response;
  },

  updateQuest: async (questId, questData) => {
    const response = await api.put(`/quests/${questId}`, questData);
    return response;
  },

  deleteQuest: async (questId) => {
    const response = await api.delete(`/quests/${questId}`);
    return response;
  },

  getQuestLog: async (date) => {
    const response = await api.get('/questlog', { params: { date } });
    return response;
  },
};
