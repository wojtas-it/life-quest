import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { createQuest, fetchCategories } from '../redux/slices/questSlice';
import COLORS from '../theme/colors';

const NewQuestScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.quest);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [difficulty, setDifficulty] = useState(2);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (categories.length === 0) {
      dispatch(fetchCategories());
    }
  }, []);

  const handleCreate = async () => {
    if (!title.trim()) {
      Alert.alert('Błąd', 'Podaj tytuł questa');
      return;
    }

    if (!selectedCategory) {
      Alert.alert('Błąd', 'Wybierz kategorię');
      return;
    }

    setIsLoading(true);

    try {
      await dispatch(
        createQuest({
          title: title.trim(),
          description: description.trim(),
          categoryId: selectedCategory._id,
          difficulty,
        })
      ).unwrap();

      Alert.alert('✅ Sukces', 'Quest został dodany!');
      navigation.goBack();
    } catch (err) {
      Alert.alert('Błąd', 'Nie udało się dodać questa');
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
        <Text style={styles.headerTitle}>Nowy Quest</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <Text style={styles.label}>Tytuł *</Text>
          <TextInput
            style={styles.input}
            placeholder="Np. Przeczytać 20 stron książki"
            placeholderTextColor={COLORS.dark.textSecondary}
            value={title}
            onChangeText={setTitle}
            maxLength={100}
          />
        </View>

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

        <View style={styles.section}>
          <Text style={styles.label}>Trudność</Text>
          <View style={styles.difficultyContainer}>
            {[1, 2, 3, 4, 5].map((level) => (
              <TouchableOpacity
                key={level}
                style={[
                  styles.difficultyButton,
                  difficulty === level && styles.difficultyButtonActive,
                ]}
                onPress={() => setDifficulty(level)}
              >
                <Text
                  style={[
                    styles.difficultyText,
                    difficulty === level && styles.difficultyTextActive,
                  ]}
                >
                  {level}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.difficultyLabel}>
            {difficulty === 1 && 'Łatwy'}
            {difficulty === 2 && 'Średni'}
            {difficulty === 3 && 'Normalny'}
            {difficulty === 4 && 'Trudny'}
            {difficulty === 5 && 'Ekstremalny'}
          </Text>
        </View>

        <View style={styles.rewardContainer}>
          <Text style={styles.rewardLabel}>💎 Nagroda:</Text>
          <Text style={styles.rewardValue}>{baseXP} XP</Text>
        </View>

        <TouchableOpacity
          style={[styles.createButton, isLoading && styles.createButtonDisabled]}
          onPress={handleCreate}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.createButtonText}>Dodaj Quest</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.dark.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.border,
  },
  backButton: {
    color: COLORS.dark.primary,
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.dark.text,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: COLORS.dark.text,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  textArea: {
    minHeight: 80,
    textAlignVertical: 'top',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  categoryCard: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    width: '47%',
    borderWidth: 2,
    borderColor: COLORS.dark.border,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: COLORS.dark.text,
  },
  difficultyContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 8,
  },
  difficultyButton: {
    flex: 1,
    backgroundColor: COLORS.dark.surface,
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.dark.border,
  },
  difficultyButtonActive: {
    backgroundColor: COLORS.dark.primary,
    borderColor: COLORS.dark.primary,
  },
  difficultyText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark.textSecondary,
  },
  difficultyTextActive: {
    color: '#FFFFFF',
  },
  difficultyLabel: {
    fontSize: 14,
    color: COLORS.dark.textSecondary,
    textAlign: 'center',
  },
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
  rewardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.dark.text,
  },
  rewardValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: COLORS.xp,
  },
  createButton: {
    backgroundColor: COLORS.dark.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    opacity: 0.6,
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NewQuestScreen;
