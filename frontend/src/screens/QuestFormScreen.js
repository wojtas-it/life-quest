import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, Alert, ActivityIndicator, Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { createQuest, updateQuest } from '../redux/slices/questSlice';
import COLORS from '../theme/colors';

const DAYS = [
  { label: 'Pon', value: 1 },
  { label: 'Wt',  value: 2 },
  { label: 'Śr',  value: 3 },
  { label: 'Czw', value: 4 },
  { label: 'Pt',  value: 5 },
  { label: 'Sob', value: 6 },
  { label: 'Nd',  value: 0 },
];

const QuestFormScreen = ({ navigation, route }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.quest);
  const editQuest = route.params?.quest || null;
  const isEditing = !!editQuest;

  const [title, setTitle] = useState(editQuest?.title || '');
  const [description, setDescription] = useState(editQuest?.description || '');
  const [selectedCategory, setSelectedCategory] = useState(
    editQuest?.categoryId ? categories.find((c) => c._id === editQuest.categoryId._id) : null
  );
  const [difficulty, setDifficulty] = useState(editQuest?.difficulty || 2);
  const [schedule, setSchedule] = useState(
    editQuest?.schedule || [0, 1, 2, 3, 4, 5, 6]
  );

  // Przypomnienie
  const parseTime = (t) => {
    if (!t) return { hour: 8, minute: 0 };
    const [h, m] = t.split(':');
    return { hour: parseInt(h, 10) || 0, minute: parseInt(m, 10) || 0 };
  };
  const [reminderEnabled, setReminderEnabled] = useState(!!editQuest?.reminderEnabled);
  const [reminder, setReminder] = useState(parseTime(editQuest?.reminderTime));

  const [isLoading, setIsLoading] = useState(false);

  const pad = (n) => String(n).padStart(2, '0');
  const adjustHour = (delta) =>
    setReminder((r) => ({ ...r, hour: (r.hour + delta + 24) % 24 }));
  const adjustMinute = (delta) =>
    setReminder((r) => ({ ...r, minute: (r.minute + delta + 60) % 60 }));

  const toggleDay = (day) => {
    setSchedule((prev) =>
      prev.includes(day) ? prev.filter((d) => d !== day) : [...prev, day]
    );
  };

  const toggleAll = () => {
    setSchedule(schedule.length === 7 ? [] : [0, 1, 2, 3, 4, 5, 6]);
  };

  const handleSave = async () => {
    if (!title.trim()) {
      Alert.alert('Błąd', 'Podaj tytuł misji');
      return;
    }
    if (!selectedCategory) {
      Alert.alert('Błąd', 'Wybierz kategorię');
      return;
    }
    if (schedule.length === 0) {
      Alert.alert('Błąd', 'Wybierz przynajmniej jeden dzień');
      return;
    }

    setIsLoading(true);
    try {
      const data = {
        title: title.trim(),
        description: description.trim(),
        categoryId: selectedCategory._id,
        difficulty,
        schedule,
        reminderEnabled,
        reminderTime: reminderEnabled ? `${pad(reminder.hour)}:${pad(reminder.minute)}` : null,
      };

      if (isEditing) {
        await dispatch(updateQuest({ questId: editQuest._id, questData: data })).unwrap();
        Alert.alert('✅ Zapisano', 'Misja została zaktualizowana');
      } else {
        await dispatch(createQuest(data)).unwrap();
        Alert.alert('✅ Dodano', 'Nowa misja została dodana');
      }
      navigation.goBack();
    } catch {
      Alert.alert('Błąd', 'Nie udało się zapisać misji');
    } finally {
      setIsLoading(false);
    }
  };

  const baseXP = 30 * difficulty;

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Wstecz</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{isEditing ? 'Edytuj misję' : 'Nowa misja'}</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {/* Title */}
        <View style={styles.section}>
          <Text style={styles.label}>Tytuł *</Text>
          <TextInput
            style={styles.input}
            placeholder="Np. Trening na siłowni"
            placeholderTextColor={COLORS.dark.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={styles.label}>Opis (opcjonalnie)</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Dodaj szczegóły..."
            placeholderTextColor={COLORS.dark.textSecondary}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            maxLength={500}
          />
        </View>

        {/* Category */}
        <View style={styles.section}>
          <Text style={styles.label}>Kategoria *</Text>
          <View style={styles.categoriesGrid}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat._id}
                style={[
                  styles.categoryCard,
                  selectedCategory?._id === cat._id && {
                    borderColor: cat.color,
                    borderWidth: 3,
                  },
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text style={styles.categoryIcon}>{cat.icon}</Text>
                <Text style={styles.categoryLabel}>{cat.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Schedule */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>Harmonogram *</Text>
            <TouchableOpacity onPress={toggleAll}>
              <Text style={styles.toggleAllText}>
                {schedule.length === 7 ? 'Odznacz wszystko' : 'Codziennie'}
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.daysRow}>
            {DAYS.map((d) => (
              <TouchableOpacity
                key={d.value}
                style={[styles.dayBtn, schedule.includes(d.value) && styles.dayBtnActive]}
                onPress={() => toggleDay(d.value)}
              >
                <Text style={[styles.dayText, schedule.includes(d.value) && styles.dayTextActive]}>
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Reminder */}
        <View style={styles.section}>
          <View style={styles.labelRow}>
            <Text style={styles.label}>⏰ Przypomnienie</Text>
            <Switch
              value={reminderEnabled}
              onValueChange={setReminderEnabled}
              trackColor={{ false: COLORS.dark.border, true: COLORS.dark.primary }}
              thumbColor="#FFF"
            />
          </View>
          {reminderEnabled && (
            <>
              <View style={styles.timePicker}>
                <View style={styles.timeUnit}>
                  <TouchableOpacity style={styles.timeBtn} onPress={() => adjustHour(1)}>
                    <Text style={styles.timeBtnText}>▲</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>{pad(reminder.hour)}</Text>
                  <TouchableOpacity style={styles.timeBtn} onPress={() => adjustHour(-1)}>
                    <Text style={styles.timeBtnText}>▼</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.timeColon}>:</Text>
                <View style={styles.timeUnit}>
                  <TouchableOpacity style={styles.timeBtn} onPress={() => adjustMinute(5)}>
                    <Text style={styles.timeBtnText}>▲</Text>
                  </TouchableOpacity>
                  <Text style={styles.timeValue}>{pad(reminder.minute)}</Text>
                  <TouchableOpacity style={styles.timeBtn} onPress={() => adjustMinute(-5)}>
                    <Text style={styles.timeBtnText}>▼</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <Text style={styles.reminderHint}>
                Powiadomienie w wybrane dni o {pad(reminder.hour)}:{pad(reminder.minute)}
              </Text>
            </>
          )}
        </View>

        {/* Difficulty */}
        <View style={styles.section}>
          <Text style={styles.label}>Trudność</Text>
          <View style={styles.difficultyContainer}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[styles.difficultyButton, difficulty === level && styles.difficultyButtonActive]}
                onPress={() => setDifficulty(level)}
              >
                <Text style={[styles.difficultyText, difficulty === level && styles.difficultyTextActive]}>
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.difficultyLabel}>
            {['', 'Łatwy', 'Średni', 'Normalny', 'Trudny', 'Ekstremalny'][difficulty]}
          </Text>
        </View>

        {/* XP reward */}
        <View style={styles.rewardContainer}>
          <Text style={styles.rewardLabel}>💎 Nagroda za wykonanie:</Text>
          <Text style={styles.rewardValue}>{baseXP} XP</Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.saveButtonText}>{isEditing ? 'Zapisz zmiany' : 'Dodaj misję'}</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.border,
  },
  backButton: { color: COLORS.dark.primary, fontSize: 16 },
  headerTitle: { fontSize: 20, fontWeight: '600', color: COLORS.dark.text },
  content: { flex: 1 },
  contentContainer: { padding: 20 },
  section: { marginBottom: 24 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  label: { fontSize: 16, fontWeight: '600', color: COLORS.dark.text, marginBottom: 8 },
  toggleAllText: { fontSize: 14, color: COLORS.dark.primary },
  input: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.dark.text,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  textArea: { minHeight: 80, textAlignVertical: 'top' },
  categoriesGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  categoryCard: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    borderWidth: 2,
    borderColor: COLORS.dark.border,
  },
  categoryIcon: { fontSize: 32, marginBottom: 8 },
  categoryLabel: { fontSize: 14, fontWeight: '600', color: COLORS.dark.text },
  daysRow: { flexDirection: 'row', gap: 8 },
  dayBtn: {
    flex: 1,
    backgroundColor: COLORS.dark.surface,
    borderRadius: 8,
    paddingVertical: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.dark.border,
  },
  dayBtnActive: { backgroundColor: COLORS.dark.primary, borderColor: COLORS.dark.primary },
  dayText: { fontSize: 11, fontWeight: '600', color: COLORS.dark.textSecondary },
  dayTextActive: { color: '#FFF' },
  difficultyContainer: { flexDirection: 'row', gap: 12, marginBottom: 8 },
  difficultyButton: {
    flex: 1,
    backgroundColor: COLORS.dark.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.dark.border,
  },
  difficultyButtonActive: { backgroundColor: COLORS.dark.primary, borderColor: COLORS.dark.primary },
  difficultyText: { fontSize: 16, fontWeight: '600', color: COLORS.dark.textSecondary },
  difficultyTextActive: { color: '#FFF' },
  difficultyLabel: { fontSize: 14, color: COLORS.dark.textSecondary, textAlign: 'center' },
  timePicker: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 4,
  },
  timeUnit: { alignItems: 'center' },
  timeBtn: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  timeBtnText: { color: COLORS.dark.primary, fontSize: 16 },
  timeValue: {
    fontSize: 32,
    fontWeight: 'bold',
    color: COLORS.dark.text,
    marginVertical: 6,
    minWidth: 56,
    textAlign: 'center',
  },
  timeColon: { fontSize: 32, fontWeight: 'bold', color: COLORS.dark.text },
  reminderHint: { fontSize: 13, color: COLORS.dark.textSecondary, textAlign: 'center', marginTop: 10 },
  rewardContainer: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.xp,
  },
  rewardLabel: { fontSize: 16, fontWeight: '600', color: COLORS.dark.text },
  rewardValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.xp },
  saveButton: { backgroundColor: COLORS.dark.primary, borderRadius: 12, padding: 16, alignItems: 'center' },
  saveButtonDisabled: { opacity: 0.6 },
  saveButtonText: { color: '#FFF', fontSize: 18, fontWeight: '600' },
});

export default QuestFormScreen;
