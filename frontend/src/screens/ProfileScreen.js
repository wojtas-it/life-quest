import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Switch, ActivityIndicator, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { statsService } from '../services/statsService';
import { skillTreeService } from '../services/skillTreeService';
import {
  getNotificationsEnabled, setNotificationsEnabled, syncReminders,
} from '../services/notifications';
import COLORS from '../theme/colors';

const formatJoinDate = (iso) => {
  if (!iso) return '';
  try {
    return new Date(iso).toLocaleDateString('pl-PL', { month: 'long', year: 'numeric' });
  } catch {
    return '';
  }
};

const buildAchievements = (summary, tree) => {
  const completed = summary.totalCompleted || 0;
  const longest = summary.longestStreak || 0;
  const level = summary.level || 1;
  const maxCatLevel = Math.max(0, ...(tree || []).map((t) => t.level));
  return [
    { icon: '🎯', label: 'Pierwszy krok', desc: 'Ukończ 1 misję', unlocked: completed >= 1 },
    { icon: '🔥', label: 'Tydzień ognia', desc: 'Streak 7 dni', unlocked: longest >= 7 },
    { icon: '🌟', label: 'Miesiąc mocy', desc: 'Streak 30 dni', unlocked: longest >= 30 },
    { icon: '💯', label: 'Setka', desc: '100 ukończonych', unlocked: completed >= 100 },
    { icon: '⭐', label: 'Weteran', desc: 'Poziom 10', unlocked: level >= 10 },
    { icon: '🏆', label: 'Mistrz', desc: 'Kategoria Lvl 10', unlocked: maxCatLevel >= 10 },
  ];
};

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const quests = useSelector((state) => state.quest.quests);

  const [summary, setSummary] = useState({});
  const [tree, setTree] = useState([]);
  const [topTitle, setTopTitle] = useState(null);
  const [notifEnabled, setNotifEnabled] = useState(true);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const [stats, skill, notif] = await Promise.all([
        statsService.getStats(7),
        skillTreeService.getSkillTree(),
        getNotificationsEnabled(),
      ]);
      setSummary(stats.data?.summary || {});
      setTree(skill.data?.tree || []);
      setTopTitle(skill.data?.topTitle || null);
      setNotifEnabled(notif);
    } catch {
      // silent
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));

  const toggleNotifications = async (value) => {
    setNotifEnabled(value);
    await setNotificationsEnabled(value);
    await syncReminders(quests);
    if (!value) {
      Alert.alert('Powiadomienia wyłączone', 'Przypomnienia o misjach nie będą wysyłane.');
    }
  };

  const handleLogout = () => {
    Alert.alert('Wyloguj', 'Na pewno chcesz się wylogować?', [
      { text: 'Anuluj', style: 'cancel' },
      { text: 'Wyloguj', style: 'destructive', onPress: () => dispatch(logout()) },
    ]);
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.dark.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const initials = (user?.username || '?').slice(0, 2).toUpperCase();
  const achievements = buildAchievements({ ...summary, level: user?.level || summary.level }, tree);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.username}>{user?.username}</Text>
          {topTitle && <Text style={styles.title}>{topTitle}</Text>}
          <Text style={styles.level}>Poziom {user?.level || 1}</Text>
          <Text style={styles.joined}>Dołączył: {formatJoinDate(user?.createdAt)}</Text>
        </View>

        {/* Summary cards */}
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={[styles.cardValue, { color: COLORS.dark.success }]}>
              {summary.totalCompleted || 0}
            </Text>
            <Text style={styles.cardLabel}>Ukończone</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardValue, { color: COLORS.streak }]}>
              {summary.currentStreak || 0}
            </Text>
            <Text style={styles.cardLabel}>🔥 Streak</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardValue, { color: COLORS.xp }]}>
              {summary.longestStreak || 0}
            </Text>
            <Text style={styles.cardLabel}>Rekord</Text>
          </View>
        </View>

        {/* Mini skill tree */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rozwój</Text>
          {tree.map((cat) => (
            <View key={cat.id} style={styles.skillRow}>
              <Text style={styles.skillName}>{cat.icon} {cat.name}</Text>
              <View style={styles.skillBarBg}>
                <View
                  style={[styles.skillBarFill, { width: `${cat.progress * 100}%`, backgroundColor: cat.color }]}
                />
              </View>
              <Text style={styles.skillLevel}>Lvl {cat.level}</Text>
            </View>
          ))}
        </View>

        {/* Achievements */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Osiągnięcia</Text>
          <View style={styles.achGrid}>
            {achievements.map((a) => (
              <View
                key={a.label}
                style={[styles.achCard, !a.unlocked && styles.achCardLocked]}
              >
                <Text style={[styles.achIcon, !a.unlocked && styles.achLockedDim]}>
                  {a.unlocked ? a.icon : '🔒'}
                </Text>
                <Text style={[styles.achLabel, !a.unlocked && styles.achLockedDim]} numberOfLines={1}>
                  {a.label}
                </Text>
                <Text style={styles.achDesc} numberOfLines={1}>{a.desc}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ustawienia</Text>
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>⏰ Powiadomienia</Text>
            <Switch
              value={notifEnabled}
              onValueChange={toggleNotifications}
              trackColor={{ false: COLORS.dark.border, true: COLORS.dark.primary }}
              thumbColor="#FFF"
            />
          </View>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Wyloguj się</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 40 },
  profileHeader: { alignItems: 'center', marginBottom: 20 },
  avatar: {
    width: 84, height: 84, borderRadius: 42,
    backgroundColor: COLORS.dark.primary,
    alignItems: 'center', justifyContent: 'center',
    marginBottom: 12,
  },
  avatarText: { color: '#FFF', fontSize: 30, fontWeight: 'bold' },
  username: { fontSize: 22, fontWeight: 'bold', color: COLORS.dark.text },
  title: { fontSize: 15, fontWeight: '600', color: COLORS.xp, marginTop: 2 },
  level: { fontSize: 14, color: COLORS.dark.primary, marginTop: 4 },
  joined: { fontSize: 12, color: COLORS.dark.textSecondary, marginTop: 4 },
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: {
    flex: 1, backgroundColor: COLORS.dark.surface, borderRadius: 12,
    padding: 14, alignItems: 'center', borderWidth: 1, borderColor: COLORS.dark.border,
  },
  cardValue: { fontSize: 22, fontWeight: 'bold', color: COLORS.dark.text },
  cardLabel: { fontSize: 11, color: COLORS.dark.textSecondary, marginTop: 4 },
  section: {
    backgroundColor: COLORS.dark.surface, borderRadius: 16, padding: 16,
    marginBottom: 16, borderWidth: 1, borderColor: COLORS.dark.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.dark.text, marginBottom: 12 },
  skillRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 10 },
  skillName: { fontSize: 13, color: COLORS.dark.text, width: 110 },
  skillBarBg: {
    flex: 1, height: 8, backgroundColor: COLORS.dark.border,
    borderRadius: 4, overflow: 'hidden',
  },
  skillBarFill: { height: '100%', borderRadius: 4 },
  skillLevel: { fontSize: 12, color: COLORS.dark.textSecondary, width: 44, textAlign: 'right' },
  achGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  achCard: {
    width: '30%', backgroundColor: COLORS.dark.background, borderRadius: 12,
    padding: 10, alignItems: 'center', borderWidth: 1, borderColor: COLORS.dark.border,
  },
  achCardLocked: { opacity: 0.5 },
  achIcon: { fontSize: 26, marginBottom: 4 },
  achLockedDim: { opacity: 0.7 },
  achLabel: { fontSize: 11, fontWeight: '600', color: COLORS.dark.text, textAlign: 'center' },
  achDesc: { fontSize: 9, color: COLORS.dark.textSecondary, textAlign: 'center', marginTop: 2 },
  settingRow: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
  },
  settingLabel: { fontSize: 15, color: COLORS.dark.text },
  logoutBtn: {
    backgroundColor: COLORS.dark.danger + '22', borderRadius: 12, padding: 16,
    alignItems: 'center', borderWidth: 1, borderColor: COLORS.dark.danger,
  },
  logoutText: { color: COLORS.dark.danger, fontSize: 16, fontWeight: '600' },
});

export default ProfileScreen;
