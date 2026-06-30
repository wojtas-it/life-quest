import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  Dimensions, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import Svg, { Polygon, Line, Circle, Text as SvgText } from 'react-native-svg';
import { skillTreeService } from '../services/skillTreeService';
import COLORS from '../theme/colors';

const SCREEN_WIDTH = Dimensions.get('window').width;

// --- Radar / pajęczyna balansu (4 osie) ---
const BalanceRadar = ({ tree }) => {
  const size = SCREEN_WIDTH - 72;
  const cx = size / 2;
  const cy = size / 2;
  const R = size / 2 - 28; // margines na ikony
  const maxLevel = Math.max(1, ...tree.map((t) => t.level));

  // Osie: góra, prawo, dół, lewo (co 90°)
  const axes = tree.slice(0, 4).map((t, i) => {
    const angle = (-90 + i * 90) * (Math.PI / 180);
    return { ...t, angle, cos: Math.cos(angle), sin: Math.sin(angle) };
  });

  const point = (a, r) => `${cx + r * a.cos},${cy + r * a.sin}`;

  // Siatka tła (100% i 50%)
  const gridOuter = axes.map((a) => point(a, R)).join(' ');
  const gridInner = axes.map((a) => point(a, R * 0.5)).join(' ');

  // Wielokąt danych (poziom znormalizowany do najwyższej kategorii)
  const dataPoly = axes
    .map((a) => point(a, R * (a.level / maxLevel)))
    .join(' ');

  return (
    <Svg width={size} height={size}>
      <Polygon points={gridOuter} fill="none" stroke={COLORS.dark.border} strokeWidth={1} />
      <Polygon points={gridInner} fill="none" stroke={COLORS.dark.border} strokeWidth={1} />
      {axes.map((a) => (
        <Line
          key={`ax-${a.id}`}
          x1={cx} y1={cy}
          x2={cx + R * a.cos} y2={cy + R * a.sin}
          stroke={COLORS.dark.border} strokeWidth={1}
        />
      ))}
      <Polygon points={dataPoly} fill={`${COLORS.dark.primary}55`} stroke={COLORS.dark.primary} strokeWidth={2} />
      {axes.map((a) => (
        <Circle
          key={`pt-${a.id}`}
          cx={cx + R * (a.level / maxLevel) * a.cos}
          cy={cy + R * (a.level / maxLevel) * a.sin}
          r={4} fill={a.color}
        />
      ))}
      {axes.map((a) => (
        <SvgText
          key={`lb-${a.id}`}
          x={cx + (R + 16) * a.cos}
          y={cy + (R + 16) * a.sin + 6}
          fontSize={18}
          textAnchor="middle"
        >
          {a.icon}
        </SvgText>
      ))}
    </Svg>
  );
};

// --- Pojedyncza gałąź kategorii ---
const Branch = ({ branch }) => {
  const remaining = branch.nextTier
    ? branch.nextThreshold - branch.xp
    : null;

  return (
    <View style={styles.branch}>
      <View style={styles.branchHeader}>
        <Text style={styles.branchTitle}>
          {branch.icon} {branch.name}
        </Text>
        <View style={[styles.levelBadge, { backgroundColor: branch.color }]}>
          <Text style={styles.levelBadgeText}>Lvl {branch.level}</Text>
        </View>
      </View>

      <Text style={[styles.currentTitle, { color: branch.color }]}>
        {branch.currentTitle || '—'}
      </Text>

      {/* Pasek XP do następnego poziomu */}
      <View style={styles.xpBarBg}>
        <View
          style={[
            styles.xpBarFill,
            { width: `${branch.progress * 100}%`, backgroundColor: branch.color },
          ]}
        />
      </View>
      <Text style={styles.xpText}>
        {branch.xp} XP{remaining !== null ? `  ·  jeszcze ${remaining} do Lvl ${branch.nextTier.level}` : '  ·  poziom maksymalny'}
      </Text>

      {/* Węzły / kamienie milowe */}
      <View style={styles.nodesRow}>
        {branch.tiers.map((tier, i) => (
          <View key={tier.level} style={styles.node}>
            {i > 0 && (
              <View
                style={[
                  styles.nodeConnector,
                  { backgroundColor: tier.unlocked ? branch.color : COLORS.dark.border },
                ]}
              />
            )}
            <View
              style={[
                styles.nodeCircle,
                tier.unlocked
                  ? { backgroundColor: branch.color, borderColor: branch.color }
                  : { backgroundColor: COLORS.dark.surface, borderColor: COLORS.dark.border },
              ]}
            >
              <Text style={[styles.nodeLevel, { color: tier.unlocked ? '#FFF' : COLORS.dark.textSecondary }]}>
                {tier.unlocked ? '★' : tier.level}
              </Text>
            </View>
            <Text
              style={[
                styles.nodeTitle,
                { color: tier.unlocked ? COLORS.dark.text : COLORS.dark.textSecondary },
              ]}
              numberOfLines={1}
            >
              {tier.title}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const SkillTreeScreen = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    try {
      const res = await skillTreeService.getSkillTree();
      setData(res.data);
    } catch {
      // silent fail
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={COLORS.dark.primary} />
        </View>
      </SafeAreaView>
    );
  }

  const tree = data?.tree || [];
  const topTitle = data?.topTitle;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <Text style={styles.title}>🌳 Drzewko rozwoju</Text>
        {topTitle && (
          <Text style={styles.subtitle}>
            Twój tytuł: <Text style={styles.topTitle}>{topTitle}</Text>
          </Text>
        )}

        {/* Radar balansu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balans rozwoju</Text>
          <View style={{ alignItems: 'center' }}>
            <BalanceRadar tree={tree} />
          </View>
        </View>

        {/* Gałęzie */}
        {tree.map((branch) => (
          <Branch key={branch.id} branch={branch} />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.dark.background },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scroll: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 24, fontWeight: 'bold', color: COLORS.dark.text },
  subtitle: { fontSize: 14, color: COLORS.dark.textSecondary, marginTop: 4, marginBottom: 16 },
  topTitle: { color: COLORS.xp, fontWeight: '700' },
  section: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: COLORS.dark.text, marginBottom: 12 },
  branch: {
    backgroundColor: COLORS.dark.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.dark.border,
  },
  branchHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  branchTitle: { fontSize: 17, fontWeight: '700', color: COLORS.dark.text },
  levelBadge: { paddingHorizontal: 10, paddingVertical: 3, borderRadius: 12 },
  levelBadgeText: { color: '#FFF', fontSize: 12, fontWeight: '700' },
  currentTitle: { fontSize: 14, fontWeight: '600', marginTop: 4, marginBottom: 10 },
  xpBarBg: {
    height: 8,
    backgroundColor: COLORS.dark.border,
    borderRadius: 4,
    overflow: 'hidden',
  },
  xpBarFill: { height: '100%', borderRadius: 4 },
  xpText: { fontSize: 11, color: COLORS.dark.textSecondary, marginTop: 5 },
  nodesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  node: { flex: 1, alignItems: 'center', position: 'relative' },
  nodeConnector: {
    position: 'absolute',
    top: 17,
    right: '50%',
    width: '100%',
    height: 2,
  },
  nodeCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  nodeLevel: { fontSize: 13, fontWeight: '700' },
  nodeTitle: { fontSize: 8, marginTop: 4, textAlign: 'center' },
});

export default SkillTreeScreen;
