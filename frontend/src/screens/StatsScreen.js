import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { statsService } from '../services/statsService';
import COLORS from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;
const toDateStr = (date) => new Date(date).toISOString().split('T')[0];

// --- Bar chart (XP over time) ---
const BarChart = ({ data, period }) => {
  const maxVal = Math.max(...data.map((d) => d.xp), 1);
  const barCount = data.length;
  const gap = 3;
  const barWidth = Math.floor((SCREEN_WIDTH - 72 - gap * (barCount - 1)) / barCount);

  return (
    <View>
      <View style={{ flexDirection: 'row', alignItems: 'flex-end', height: 120, gap }}>
        {data.map((d) => {
          const h = Math.max((d.xp / maxVal) * 110, d.xp > 0 ? 4 : 1);
          return (
            <View key={d.date} style={{ alignItems: 'center', width: barWidth }}>
              <View
                style={{
                  width: barWidth,
                  height: h,
                  backgroundColor: d.xp > 0 ? COLORS.dark.primary : COLORS.dark.border,
                  borderRadius: 3,
                }}
              />
            </View>
          );
        })}
      </View>
      <View style={{ flexDirection: 'row', gap, marginTop: 4 }}>
        {data.map((d, i) => {
          const showLabel = period === 7 || i % 5 === 0;
          return (
            <View key={d.date} style={{ width: barWidth, alignItems: 'center' }}>
              <Text style={{ fontSize: 9, color: COLORS.dark.textSecondary }}>
                {showLabel ? d.date.slice(5) : ''}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// --- Category breakdown ---
const CategoryBars = ({ data }) => {
  const total = data.reduce((s, c) => s + c.count, 0) || 1;
  return (
    <View style={{ gap: 10 }}>
      {data.map((cat) => (
        <View key={cat.name}>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
            <Text style={{ color: COLORS.dark.text, fontSize: 14 }}>
              {cat.icon} {cat.name}
            </Text>
            <Text style={{ color: COLORS.dark.textSecondary, fontSize: 13 }}>
              {cat.count} ({Math.round((cat.count / total) * 100)}%)
            </Text>
          </View>
          <View style={{ height: 8, backgroundColor: COLORS.dark.border, borderRadius: 4, overflow: 'hidden' }}>
            <View
              style={{
                height: '100%',
                width: `${(cat.count / total) * 100}%`,
                backgroundColor: cat.color,
                borderRadius: 4,
              }}
            />
          </View>
        </View>
      ))}
    </View>
  );
};

// --- Activity calendar ---
const ActivityCalendar = ({ activityDays }) => {
  const active = new Set(activityDays);
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(toDateStr(d));
  }
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
      {days.map((d) => (
        <View
          key={d}
          style={{
            width: 28, height: 28, borderRadius: 6,
            backgroundColor: active.has(d) ? COLORS.dark.primary : COLORS.dark.border,
          }}
        />
      ))}
    </View>
  );
};

// --- Main screen ---
const StatsScreen = () => {
  const [period, setPeriod] = useState(7);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await statsService.getStats(period);
      setData(res.data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => { load(); }, [load]);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.dark.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const summary = data?.summary || {};
  const xpByDay = data?.xpByDay || [];
  const byCategory = data?.byCategory || [];
  const activityDays = data?.activityDays || [];
  const hasData = xpByDay.some((d) => d.xp > 0);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>📊 Statystyki</Text>

        {/* Summary cards */}
        <View style={styles.cardsRow}>
          <View style={styles.card}>
            <Text style={styles.cardValue}>{summary.level || 1}</Text>
            <Text style={styles.cardLabel}>Poziom</Text>
          </View>
          <View style={styles.card}>
            <Text style={[styles.cardValue, { color: COLORS.xp }]}>{summary.totalXP || 0}</Text>
            <Text style={styles.cardLabel}>Łączne XP</Text>
          </View>
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
        </View>

        {/* XP chart */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>XP w czasie</Text>
            <View style={styles.toggle}>
              <TouchableOpacity
                style={[styles.toggleBtn, period === 7 && styles.toggleBtnActive]}
                onPress={() => setPeriod(7)}
              >
                <Text style={[styles.toggleText, period === 7 && styles.toggleTextActive]}>7 dni</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.toggleBtn, period === 30 && styles.toggleBtnActive]}
                onPress={() => setPeriod(30)}
              >
                <Text style={[styles.toggleText, period === 30 && styles.toggleTextActive]}>30 dni</Text>
              </TouchableOpacity>
            </View>
          </View>
          {hasData ? (
            <BarChart data={xpByDay} period={period} />
          ) : (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>Brak danych — ukończ kilka misji!</Text>
            </View>
          )}
        </View>

        {/* Category breakdown */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Misje per kategoria</Text>
          {byCategory.length > 0 ? (
            <CategoryBars data={byCategory} />
          ) : (
            <View style={styles.noData}>
              <Text style={styles.noDataText}>Brak ukończonych misji</Text>
            </View>
          )}
        </View>

        {/* Activity calendar */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Aktywność — ostatnie 30 dni</Text>
          <ActivityCalendar activityDays={activityDays} />
          <View style={styles.legend}>
            <View style={[styles.legendDot, { backgroundColor: COLORS.dark.border }]} />
            <Text style={styles.legendText}>Brak</Text>
            <View style={[styles.legendDot, { backgroundColor: COLORS.dark.primary, marginLeft: 12 }]} />
            <Text style={styles.legendText}>Aktywny</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark.text, marginBottom: 20 },
  cardsRow: { flexDirection: 'row', gap: 10, marginBottom: 16 },
  card: {
    flex: 1,
    backgroundColor: COLORS.dark.surface,
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  cardValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.dark.text },
  cardLabel: { fontSize: 10, color: COLORS.dark.textSecondary, marginTop: 4, textAlign: 'center' },
  section: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.dark.text, marginBottom: 12 },
  toggle: { flexDirection: 'row', gap: 6 },
  toggleBtn: {
    paddingHorizontal: 12, paddingVertical: 5,
    borderRadius: 20, backgroundColor: COLORS.dark.border,
  },
  toggleBtnActive: { backgroundColor: COLORS.dark.primary },
  toggleText: { fontSize: 12, color: COLORS.dark.textSecondary },
  toggleTextActive: { color: '#FFF', fontWeight: '600' },
  noData: { height: 80, justifyContent: 'center', alignItems: 'center' },
  noDataText: { color: COLORS.dark.textSecondary, fontSize: 13 },
  legend: { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 10 },
  legendDot: { width: 14, height: 14, borderRadius: 4 },
  legendText: { fontSize: 12, color: COLORS.dark.textSecondary },
});

export default StatsScreen;
