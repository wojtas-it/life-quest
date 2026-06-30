import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { questService } from '../../services/questService';
import { categoryService } from '../../services/categoryService';

export const fetchQuests = createAsyncThunk('quest/fetchQuests', async () => {
  const response = await questService.getQuests();
  return response.data;
});

export const fetchCategories = createAsyncThunk('quest/fetchCategories', async () => {
  const response = await categoryService.getCategories();
  return response.data;
});

export const createQuest = createAsyncThunk('quest/createQuest', async (questData) => {
  const response = await questService.createQuest(questData);
  return response.data;
});

export const completeQuest = createAsyncThunk('quest/completeQuest', async (questId) => {
  const response = await questService.completeQuest(questId);
  return { ...response.data, questId };
});

export const updateQuest = createAsyncThunk('quest/updateQuest', async ({ questId, questData }) => {
  const response = await questService.updateQuest(questId, questData);
  return response.data;
});

export const deleteQuest = createAsyncThunk('quest/deleteQuest', async (questId) => {
  await questService.deleteQuest(questId);
  return questId;
});

export const fetchQuestLog = createAsyncThunk('quest/fetchQuestLog', async (date) => {
  const response = await questService.getQuestLog(date);
  return { date, logs: response.data };
});

const questSlice = createSlice({
  name: 'quest',
  initialState: {
    quests: [],
    categories: [],
    questLog: [],
    isLoading: false,
    isLogLoading: false,
    error: null,
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchQuests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.quests = action.payload;
      })
      .addCase(fetchQuests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      .addCase(createQuest.fulfilled, (state, action) => {
        state.quests.unshift(action.payload);
      })
      .addCase(completeQuest.fulfilled, (state, action) => {
        // Mark quest as completedToday in local state
        const quest = state.quests.find((q) => q._id === action.payload.questId);
        if (quest) quest.completedToday = true;
      })
      .addCase(updateQuest.fulfilled, (state, action) => {
        const idx = state.quests.findIndex((q) => q._id === action.payload._id);
        if (idx !== -1) {
          state.quests[idx] = { ...action.payload, completedToday: state.quests[idx].completedToday };
        }
      })
      .addCase(deleteQuest.fulfilled, (state, action) => {
        state.quests = state.quests.filter((q) => q._id !== action.payload);
      })
      .addCase(fetchQuestLog.pending, (state) => {
        state.isLogLoading = true;
      })
      .addCase(fetchQuestLog.fulfilled, (state, action) => {
        state.isLogLoading = false;
        state.questLog = action.payload.logs;
      })
      .addCase(fetchQuestLog.rejected, (state) => {
        state.isLogLoading = false;
      });
  },
});

export const { clearError } = questSlice.actions;
export default questSlice.reducer;
