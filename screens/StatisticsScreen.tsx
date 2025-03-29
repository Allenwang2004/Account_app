import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Expense } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface StatisticsScreenProps {
  expenses: Expense[];
  income: Expense[];
  currentMonth: Date;
}

export default function StatisticsScreen({ expenses, income, currentMonth }: StatisticsScreenProps) {
  // Filter expenses and income for the current month
  const currentMonthExpenses = expenses.filter(expense => {
    const expenseDate = new Date(expense.date);
    return expenseDate.getMonth() === currentMonth.getMonth() && 
           expenseDate.getFullYear() === currentMonth.getFullYear();
  });

  const currentMonthIncome = income.filter(inc => {
    const incomeDate = new Date(inc.date);
    return incomeDate.getMonth() === currentMonth.getMonth() && 
           incomeDate.getFullYear() === currentMonth.getFullYear();
  });

  const totalExpenses = currentMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  const totalIncome = currentMonthIncome.reduce((sum, inc) => sum + inc.amount, 0);
  const balance = totalIncome - totalExpenses;

  // Group expenses by category
  const expensesByCategory = currentMonthExpenses.reduce((acc, expense) => {
    if (!acc[expense.category]) {
      acc[expense.category] = 0;
    }
    acc[expense.category] += expense.amount;
    return acc;
  }, {} as Record<string, number>);

  // Group income by source
  const incomeBySource = currentMonthIncome.reduce((acc, inc) => {
    if (!acc[inc.category]) {
      acc[inc.category] = 0;
    }
    acc[inc.category] += inc.amount;
    return acc;
  }, {} as Record<string, number>);

  // Format month
  const formatMonth = (date: Date) => {
    return `${date.getFullYear()}年${date.getMonth() + 1}月`;
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>{formatMonth(currentMonth)}統計報表</Text>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.cardTitle}>月度概覽</Text>
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>總支出</Text>
              <Text style={[styles.summaryAmount, styles.expenseAmount]}>${totalExpenses}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>總收入</Text>
              <Text style={[styles.summaryAmount, styles.incomeAmount]}>${totalIncome}</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryLabel}>結餘</Text>
              <Text style={[styles.summaryAmount, balance >= 0 ? styles.incomeAmount : styles.expenseAmount]}>
                ${balance}
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.categoryCard}>
          <Text style={styles.cardTitle}>支出分類</Text>
          {Object.entries(expensesByCategory).length > 0 ? (
            Object.entries(expensesByCategory).map(([category, amount]) => (
              <View key={category} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(category) }]} />
                  <Text style={styles.categoryName}>{category}</Text>
                </View>
                <Text style={styles.categoryAmount}>${amount}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>本月無支出記錄</Text>
          )}
        </View>

        <View style={styles.categoryCard}>
          <Text style={styles.cardTitle}>收入來源</Text>
          {Object.entries(incomeBySource).length > 0 ? (
            Object.entries(incomeBySource).map(([source, amount]) => (
              <View key={source} style={styles.categoryRow}>
                <View style={styles.categoryInfo}>
                  <View style={[styles.categoryDot, { backgroundColor: getSourceColor(source) }]} />
                  <Text style={styles.categoryName}>{source}</Text>
                </View>
                <Text style={styles.categoryAmount}>${amount}</Text>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>本月無收入記錄</Text>
          )}
        </View>

        <View style={styles.tipsCard}>
          <View style={styles.tipsHeader}>
            <Ionicons name="bulb-outline" size={20} color="#FFD700" />
            <Text style={styles.tipsTitle}>理財小貼士</Text>
          </View>
          <Text style={styles.tipsText}>
            建議將月收入的20%存入儲蓄帳戶，30%用於必要開支，50%用於生活和娛樂。
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Helper function to get a color for a category
function getCategoryColor(category: string): string {
  const colors = ['#FF5252', '#FF7043', '#FFCA28', '#66BB6A', '#26C6DA', '#5C6BC0', '#AB47BC'];
  let hash = 0;
  for (let i = 0; i < category.length; i++) {
    hash = category.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

// Helper function to get a color for an income source
function getSourceColor(source: string): string {
  const colors = ['#4FC3F7', '#4DB6AC', '#7986CB', '#9575CD', '#4DD0E1', '#81C784', '#DCE775'];
  let hash = 0;
  for (let i = 0; i < source.length; i++) {
    hash = source.charCodeAt(i) + ((hash << 5) - hash);
  }
  return colors[Math.abs(hash) % colors.length];
}

const { width } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  scrollContent: {
    padding: 16,
  },
  header: {
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  summaryCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryItem: {
    alignItems: 'center',
  },
  summaryLabel: {
    color: '#888',
    fontSize: 14,
    marginBottom: 4,
  },
  summaryAmount: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  expenseAmount: {
    color: '#FF5252',
  },
  incomeAmount: {
    color: '#4FC3F7',
  },
  categoryCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  categoryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  categoryName: {
    color: 'white',
    fontSize: 16,
  },
  categoryAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  emptyText: {
    color: '#888',
    textAlign: 'center',
    paddingVertical: 16,
  },
  tipsCard: {
    backgroundColor: '#1E1E1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  tipsTitle: {
    color: '#FFD700',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  tipsText: {
    color: 'white',
    lineHeight: 20,
  },
});