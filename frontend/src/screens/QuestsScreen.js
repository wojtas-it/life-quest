import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { fetchQuests, fetchCategories, deleteQuest } from '../redux/slices/questSlice';
import COLORS from '../theme/colors';

const DAYS_SHORT = ['Nd', 'Pon', 'Wt', 'Śr', 'Czw', 'Pt', 'Sob'];

const getScheduleLabel = (schedule) => {
  if (!schedule || schedule.length === 7) return 'Codziennie';
  if (schedule.length === 0) return 'Brak dni';
  const sorted = [...schedule].sort((a, b) => {
    const order = [1, 2, 3, 4, 5, 6, 0];
    return order.indexOf(a) - order.indexOf(b);
  });
  return sorted.map((d) => DAYS_SHORT[d]).join(', ');
};

const QuestsScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { quests, isLoading } = useSelector((state) => state.quest);

  useEffect(() => {
    dispatch(fetchQuests());
    dispatch(fetchCategories());
  }, []);

  const handleDelete = (quest) => {
    Alert.alert('Usuń misję', `Usunąć "${quest.title}"?\nHistoria wykonań zostanie zachowana.`, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => dispatch(deleteQuest(quest._id)),
      },
    ]);
  };

  const handleEdit = (quest) => {
    navigation.navigate('QuestForm', { quest });
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.cardLeft}>
        <Text style={styles.cardIcon}>{item.categoryId?.icon || '📋'}</Text>
        <View style={styles.cardInfo}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <View style={styles.cardMeta}>
            <View style={[styles.catBadge, { backgroundColor: item.categoryId?.color || '#6BA3C7' }]}>
              <Text style={styles.catBadgeText}>{item.categoryId?.name}</Text>
            </View>
            <Text style={styles.scheduleText}>{getScheduleLabel(item.schedule)}</Text>
            {item.reminderEnabled && item.reminderTime && (
              <Text style={styles.reminderBadge}>⏰ {item.reminderTime}</Text>
            )}
          </View>
          <Text style={styles.xpText}>⭐ {item.xpReward} XP za wykonanie</Text>
        </View>
      </View>
      <View style={styles.cardActions}>
        <TouchableOpacity style={styles.editBtn} onPress={() => handleEdit(item)}>
          <Text style={styles.editBtnText}>✏️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteBtn} onPress={() => handleDelete(item)}>
          <Text style={styles.deleteBtnText}>🗑️</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>⚔️ Misje</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => navigation.navigate('QuestForm')}
        >
          <Text style={styles.addBtnText}>+ Nowa</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={quests}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={() => dispatch(fetchQuests())} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>⚔️</Text>
            <Text style={styles.emptyText}>Brak misji</Text>
            <Text style={styles.emptySubtext}>Dodaj swoją pierwszą misję!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.dark.border,
  },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark.text },
  addBtn: {
    backgroundColor: COLORS.dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  addBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  list: { padding: 16, paddingBottom: 80 },
  card: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  cardLeft: { flex: 1, flexDirection: 'row', alignItems: 'flex-start' },
  cardIcon: { fontSize: 28, marginRight: 12, marginTop: 2 },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600', color: COLORS.dark.text, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4, flexWrap: 'wrap' },
  catBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  catBadgeText: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  scheduleText: { fontSize: 12, color: COLORS.dark.textSecondary },
  reminderBadge: { fontSize: 12, color: COLORS.streak, fontWeight: '600' },
  xpText: { fontSize: 12, color: COLORS.xp, marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 8, marginLeft: 8 },
  editBtn: {
    backgroundColor: COLORS.dark.border,
    borderRadius: 8,
    padding: 8,
  },
  editBtnText: { fontSize: 16 },
  deleteBtn: {
    backgroundColor: COLORS.dark.danger + '22',
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: COLORS.dark.danger + '44',
  },
  deleteBtnText: { fontSize: 16 },
  empty: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.dark.text, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: COLORS.dark.textSecondary },
});

export default QuestsScreen;
