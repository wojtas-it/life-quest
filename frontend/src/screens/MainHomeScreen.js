import React, { useEffect, useState, useCallback, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  Animated,
  Modal,
  Easing,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchQuests,
  fetchCategories,
  completeQuest,
  deleteQuest,
  fetchQuestLog,
} from '../redux/slices/questSlice';
import { logout, updateUser } from '../redux/slices/authSlice';
import { statsService } from '../services/statsService';
import COLORS from '../theme/colors';

const toDateString = (date) => date.toISOString().split('T')[0];

const getDateLabel = (date) => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);

  const d = toDateString(date);
  if (d === toDateString(today)) return 'Dziś';
  if (d === toDateString(yesterday)) return 'Wczoraj';
  if (d === toDateString(tomorrow)) return 'Jutro';

  return date.toLocaleDateString('pl-PL', { day: 'numeric', month: 'short' });
};

const isToday = (date) => toDateString(date) === toDateString(new Date());
const isPast = (date) => date < new Date(new Date().setHours(0, 0, 0, 0));

const MainHomeScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { quests, questLog, isLoading } = useSelector((state) => state.quest);

  const [selectedDate, setSelectedDate] = useState(new Date());
  const [combo, setCombo] = useState({ streak: 0, multiplier: 1 });

  // Animacje
  const xpBarAnim = useRef(new Animated.Value(0)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const [floatText, setFloatText] = useState('');
  const levelUpScale = useRef(new Animated.Value(0)).current;
  const [levelUpVisible, setLevelUpVisible] = useState(false);
  const [levelUpValue, setLevelUpValue] = useState(1);

  const loadCombo = useCallback(async () => {
    try {
      const res = await statsService.getStats(7);
      setCombo({
        streak: res.data?.summary?.currentStreak || 0,
        multiplier: res.data?.summary?.comboMultiplier || 1,
      });
    } catch {
      // silent
    }
  }, []);

  const loadData = useCallback(() => {
    dispatch(fetchQuests());
    dispatch(fetchCategories());
    dispatch(fetchQuestLog(toDateString(selectedDate)));
    loadCombo();
  }, [selectedDate, loadCombo]);

  useEffect(() => {
    loadData();
  }, [selectedDate]);

  const changeDate = (delta) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + delta);
    setSelectedDate(newDate);
  };

  const completedQuestIds = new Set(questLog.map((l) => l.questId?._id || l.questId));

  const triggerXpFloat = (text) => {
    setFloatText(text);
    floatAnim.setValue(0);
    Animated.timing(floatAnim, {
      toValue: 1,
      duration: 1300,
      easing: Easing.out(Easing.quad),
      useNativeDriver: true,
    }).start();
  };

  const triggerLevelUp = (level) => {
    setLevelUpValue(level);
    setLevelUpVisible(true);
    levelUpScale.setValue(0);
    Animated.spring(levelUpScale, {
      toValue: 1,
      friction: 5,
      tension: 80,
      useNativeDriver: true,
    }).start();
  };

  const handleComplete = async (questId) => {
    try {
      const result = await dispatch(completeQuest(questId)).unwrap();
      dispatch(updateUser({ totalXP: result.totalXP, level: result.newLevel }));
      setCombo({ streak: result.streak, multiplier: result.multiplier });

      const comboTag = result.multiplier > 1 ? `  🔥${result.multiplier}×` : '';
      triggerXpFloat(`+${result.xpEarned} XP${comboTag}`);

      if (result.leveledUp) {
        triggerLevelUp(result.newLevel);
      }
    } catch (err) {
      const msg = err?.message || '';
      if (msg === 'Quest already completed today') {
        Alert.alert('Już zrobione', 'Ten quest masz już zaliczony na dziś!');
      } else {
        Alert.alert('Błąd', 'Nie udało się ukończyć questa');
      }
    }
  };

  const handleDelete = (questId, title) => {
    Alert.alert('Usuń quest', `Usunąć "${title}"?`, [
      { text: 'Anuluj', style: 'cancel' },
      {
        text: 'Usuń',
        style: 'destructive',
        onPress: () => dispatch(deleteQuest(questId)),
      },
    ]);
  };

  const xpForNextLevel = Math.floor(100 * Math.pow(1.5, (user?.level || 1)));
  const xpProgress = Math.min(((user?.totalXP || 0) / xpForNextLevel) * 100, 100);

  // Płynna animacja paska XP przy zmianie XP/poziomu
  useEffect(() => {
    Animated.timing(xpBarAnim, {
      toValue: xpProgress,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
  }, [xpProgress]);

  const renderQuestItem = ({ item }) => {
    const doneToday = isToday(selectedDate) ? item.completedToday : completedQuestIds.has(item._id);
    const viewing = isToday(selectedDate);
    const viewingPast = isPast(selectedDate) && !isToday(selectedDate);

    return (
      <TouchableOpacity
        style={[styles.questCard, doneToday && styles.questCardDone]}
        onLongPress={() => handleDelete(item._id, item.title)}
        activeOpacity={0.8}
      >
        <View style={styles.questHeader}>
          <View style={styles.questTitleRow}>
            <Text style={styles.questIcon}>{item.categoryId?.icon || '📋'}</Text>
            <View style={styles.questInfo}>
              <Text style={[styles.questText, doneToday && styles.questTextDone]}>
                {item.title}
              </Text>
              {item.description ? (
                <Text style={styles.questDesc}>{item.description}</Text>
              ) : null}
            </View>
          </View>
          <View style={[styles.categoryBadge, { backgroundColor: item.categoryId?.color || '#6BA3C7' }]}>
            <Text style={styles.categoryName}>{item.categoryId?.name}</Text>
          </View>
        </View>

        <View style={styles.questFooter}>
          <Text style={styles.xpReward}>⭐ {item.xpReward} XP</Text>
          {viewing && !doneToday && (
            <TouchableOpacity style={styles.completeBtn} onPress={() => handleComplete(item._id)}>
              <Text style={styles.completeBtnText}>Zrób ✓</Text>
            </TouchableOpacity>
          )}
          {doneToday && (
            <View style={styles.doneBadge}>
              <Text style={styles.doneBadgeText}>✓ Zrobione</Text>
            </View>
          )}
          {viewingPast && !doneToday && (
            <View style={styles.missedBadge}>
              <Text style={styles.missedBadgeText}>✗ Pominięte</Text>
            </View>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  const dayOfWeek = selectedDate.getDay();
  const questsForDay = quests.filter(
    (q) => !q.schedule || q.schedule.length === 0 || q.schedule.includes(dayOfWeek)
  );

  const doneCount = questsForDay.filter((q) =>
    isToday(selectedDate) ? q.completedToday : completedQuestIds.has(q._id)
  ).length;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>{user?.username}</Text>
          <Text style={styles.levelText}>Poziom {user?.level || 1}</Text>
        </View>
        <View style={styles.headerRight}>
          {combo.streak > 0 && (
            <View style={styles.comboBadge}>
              <Text style={styles.comboText}>🔥 {combo.streak} dni</Text>
              {combo.multiplier > 1 && (
                <Text style={styles.comboMult}>{combo.multiplier}× XP</Text>
              )}
            </View>
          )}
          <TouchableOpacity onPress={() => dispatch(logout())}>
            <Text style={styles.logoutText}>Wyloguj</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* XP Bar */}
      <View style={styles.xpContainer}>
        <View style={styles.xpBar}>
          <Animated.View
            style={[
              styles.xpFill,
              { width: xpBarAnim.interpolate({ inputRange: [0, 100], outputRange: ['0%', '100%'] }) },
            ]}
          />
        </View>
        <Text style={styles.xpText}>{user?.totalXP || 0} / {xpForNextLevel} XP</Text>

        {/* Lecące "+XP" */}
        <Animated.View
          pointerEvents="none"
          style={[
            styles.xpFloat,
            {
              opacity: floatAnim.interpolate({ inputRange: [0, 0.15, 0.8, 1], outputRange: [0, 1, 1, 0] }),
              transform: [
                { translateY: floatAnim.interpolate({ inputRange: [0, 1], outputRange: [0, -50] }) },
              ],
            },
          ]}
        >
          <Text style={styles.xpFloatText}>{floatText}</Text>
        </Animated.View>
      </View>

      {/* Date navigation */}
      <View style={styles.dateNav}>
        <TouchableOpacity onPress={() => changeDate(-1)} style={styles.dateArrow}>
          <Text style={styles.dateArrowText}>‹</Text>
        </TouchableOpacity>
        <View style={styles.dateLabelContainer}>
          <Text style={styles.dateLabel}>{getDateLabel(selectedDate)}</Text>
          <Text style={styles.dateProgress}>{doneCount}/{questsForDay.length} wykonanych</Text>
        </View>
        <TouchableOpacity onPress={() => changeDate(1)} style={styles.dateArrow}>
          <Text style={styles.dateArrowText}>›</Text>
        </TouchableOpacity>
      </View>

      {/* Quest list */}
      <FlatList
        data={questsForDay}
        renderItem={renderQuestItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.list}
        refreshControl={<RefreshControl refreshing={isLoading} onRefresh={loadData} />}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>🎯</Text>
            <Text style={styles.emptyText}>Brak misji</Text>
            <Text style={styles.emptySubtext}>Dodaj swoją pierwszą misję!</Text>
          </View>
        }
      />

      {/* Modal LEVEL UP */}
      <Modal visible={levelUpVisible} transparent animationType="fade" onRequestClose={() => setLevelUpVisible(false)}>
        <View style={styles.modalOverlay}>
          <Animated.View
            style={[
              styles.levelUpCard,
              {
                transform: [
                  { scale: levelUpScale },
                  {
                    rotate: levelUpScale.interpolate({
                      inputRange: [0, 1],
                      outputRange: ['-8deg', '0deg'],
                    }),
                  },
                ],
              },
            ]}
          >
            <Text style={styles.levelUpEmoji}>🎉</Text>
            <Text style={styles.levelUpTitle}>LEVEL UP!</Text>
            <Text style={styles.levelUpLevel}>Poziom {levelUpValue}</Text>
            <TouchableOpacity style={styles.levelUpBtn} onPress={() => setLevelUpVisible(false)}>
              <Text style={styles.levelUpBtnText}>Świetnie!</Text>
            </TouchableOpacity>
          </Animated.View>
        </View>
      </Modal>

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
    paddingTop: 10,
    paddingBottom: 8,
  },
  greeting: { fontSize: 22, fontWeight: 'bold', color: COLORS.dark.text },
  levelText: { fontSize: 14, color: COLORS.dark.primary, marginTop: 2 },
  logoutText: { color: COLORS.dark.danger, fontSize: 14 },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  comboBadge: {
    backgroundColor: COLORS.streak + '22',
    borderColor: COLORS.streak,
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignItems: 'center',
  },
  comboText: { color: COLORS.streak, fontSize: 13, fontWeight: '700' },
  comboMult: { color: COLORS.xp, fontSize: 10, fontWeight: '600', marginTop: 1 },
  xpContainer: { paddingHorizontal: 20, marginBottom: 16 },
  xpBar: {
    height: 8,
    backgroundColor: COLORS.dark.surface,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpFill: { height: '100%', backgroundColor: COLORS.xp },
  xpText: { color: COLORS.dark.textSecondary, fontSize: 11, marginTop: 4, textAlign: 'right' },
  xpFloat: { position: 'absolute', right: 20, top: -6 },
  xpFloatText: { color: COLORS.xp, fontSize: 18, fontWeight: 'bold' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  levelUpCard: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 24,
    paddingVertical: 32,
    paddingHorizontal: 48,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.level,
  },
  levelUpEmoji: { fontSize: 64, marginBottom: 8 },
  levelUpTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.level, letterSpacing: 1 },
  levelUpLevel: { fontSize: 20, fontWeight: '600', color: COLORS.dark.text, marginTop: 6 },
  levelUpBtn: {
    marginTop: 20,
    backgroundColor: COLORS.level,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 12,
  },
  levelUpBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
    backgroundColor: COLORS.dark.surface,
    marginHorizontal: 20,
    borderRadius: 12,
    paddingVertical: 10,
  },
  dateArrow: { padding: 8 },
  dateArrowText: { fontSize: 28, color: COLORS.dark.primary, lineHeight: 30 },
  dateLabelContainer: { alignItems: 'center' },
  dateLabel: { fontSize: 18, fontWeight: '700', color: COLORS.dark.text },
  dateProgress: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 2 },
  list: { paddingHorizontal: 20, paddingBottom: 100 },
  questCard: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  questCardDone: {
    borderColor: COLORS.dark.success,
    opacity: 0.75,
  },
  questHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  questTitleRow: { flexDirection: 'row', flex: 1, marginRight: 8 },
  questIcon: { fontSize: 22, marginRight: 10 },
  questInfo: { flex: 1 },
  questText: { fontSize: 16, fontWeight: '600', color: COLORS.dark.text },
  questTextDone: { textDecorationLine: 'line-through', color: COLORS.dark.textSecondary },
  questDesc: { fontSize: 13, color: COLORS.dark.textSecondary, marginTop: 3 },
  categoryBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  categoryName: { color: '#FFF', fontSize: 11, fontWeight: '600' },
  questFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  xpReward: { color: COLORS.xp, fontSize: 14, fontWeight: '600' },
  completeBtn: {
    backgroundColor: COLORS.dark.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  completeBtnText: { color: '#FFF', fontSize: 14, fontWeight: '600' },
  doneBadge: {
    backgroundColor: COLORS.dark.success + '33',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.dark.success,
  },
  doneBadgeText: { color: COLORS.dark.success, fontSize: 13, fontWeight: '600' },
  missedBadge: {
    backgroundColor: COLORS.dark.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  missedBadgeText: { color: COLORS.dark.textSecondary, fontSize: 13 },
  emptyState: { alignItems: 'center', paddingVertical: 60 },
  emptyIcon: { fontSize: 60, marginBottom: 16 },
  emptyText: { fontSize: 18, fontWeight: '600', color: COLORS.dark.text, marginBottom: 8 },
  emptySubtext: { fontSize: 14, color: COLORS.dark.textSecondary },
});

export default MainHomeScreen;
