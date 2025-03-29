import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import ChatScreen from './ChatScreen';
import { Expense } from '../types';
import { Ionicons } from '@expo/vector-icons';

interface ChatWithSummaryProps {
  expenses: Expense[];
  income: Expense[];
  messages: { role: 'user' | 'system'; content: string }[];
  onSendMessage: (message: string) => void;
  currentMonth: Date;
}

export default function ChatWithSummaryScreen({
  expenses,
  income,
  messages,
  onSendMessage,
  currentMonth,
}: ChatWithSummaryProps) {
  const totalExpenses = expenses
    .filter((e) => new Date(e.date).getMonth() === currentMonth.getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  const totalIncome = income
    .filter((e) => new Date(e.date).getMonth() === currentMonth.getMonth())
    .reduce((sum, e) => sum + e.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <View style={styles.container}>
      <View style={styles.summaryRow}>
        <TouchableOpacity style={styles.summaryBoxLeft}>
          <Text style={styles.expenseLabel}>月支出 <Ionicons name="chevron-forward" size={14} color="#facc15" /></Text>
          <Text style={styles.amount}>${totalExpenses.toFixed(0)}</Text>
        </TouchableOpacity>

        <View style={styles.balanceCircleContainer}>
          <View style={styles.balanceCircle}>
            <Ionicons name="cash-outline" size={32} color="white" style={{ marginBottom: 4 }} />
            <Text style={styles.balanceLabel}>月結餘</Text>
            <Text style={styles.balanceAmount}>${balance.toFixed(0)}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.summaryBoxRight}>
          <Text style={styles.incomeLabel}>月收入 <Ionicons name="chevron-forward" size={14} color="#0ea5e9" /></Text>
          <Text style={styles.amount}>${totalIncome.toFixed(0)}</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.chatContainer}>
        <ChatScreen messages={messages} onSendMessage={onSendMessage} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 20,
    backgroundColor: '#1E1E1E',
  },
  summaryBoxLeft: {
    flex: 1,
  },
  summaryBoxRight: {
    flex: 1,
    alignItems: 'flex-end',
  },
  balanceCircleContainer: {
    flex: 1,
    alignItems: 'center',
  },
  balanceCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#3d3d3d',
    justifyContent: 'center',
    alignItems: 'center',
  },
  balanceLabel: {
    color: '#aaa',
    fontSize: 12,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  expenseLabel: {
    color: '#facc15',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  incomeLabel: {
    color: '#0ea5e9',
    fontWeight: 'bold',
    marginBottom: 4,
  },
  amount: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  chatContainer: {
    flex: 1,
  },
});