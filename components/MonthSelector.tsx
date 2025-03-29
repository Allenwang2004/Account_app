import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface MonthSelectorProps {
  currentMonth: Date;
  onMonthChange: (date: Date) => void;
}

export default function MonthSelector({ currentMonth, onMonthChange }: MonthSelectorProps) {
  const [showModal, setShowModal] = useState(false);
  const [tempYear, setTempYear] = useState(currentMonth.getFullYear());

  const formatMonth = (date: Date) => `${date.getFullYear()}年${date.getMonth() + 1}月`;

  const selectMonth = (month: number) => {
    const newDate = new Date(tempYear, month - 1);
    onMonthChange(newDate);
    setShowModal(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.header} onPress={() => setShowModal(true)}>
        <Text style={styles.headerText}>{formatMonth(currentMonth)}</Text>
        <Ionicons name="chevron-down" size={20} color="white" style={{ marginLeft: 4 }} />
      </TouchableOpacity>

      <Modal visible={showModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.yearRow}>
              <TouchableOpacity onPress={() => setTempYear(tempYear - 1)}>
                <Ionicons name="chevron-back" size={20} color="white" />
              </TouchableOpacity>
              <Text style={styles.yearText}>{tempYear} 年</Text>
              <TouchableOpacity onPress={() => setTempYear(tempYear + 1)}>
                <Ionicons name="chevron-forward" size={20} color="white" />
              </TouchableOpacity>
            </View>
            <View style={styles.monthGrid}>
              {Array.from({ length: 12 }, (_, i) => i + 1).map((month) => {
                const isSelected =
                  tempYear === currentMonth.getFullYear() && month === currentMonth.getMonth() + 1;
                return (
                  <TouchableOpacity
                    key={month}
                    style={[styles.monthButton, isSelected && styles.selectedMonth]}
                    onPress={() => selectMonth(month)}
                  >
                    <Text style={[styles.monthText, isSelected && styles.selectedText]}>{month} 月</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setShowModal(false)}>
              <Text style={{ color: 'white' }}>關閉</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1E1E1E',
    padding: 20,
    borderRadius: 12,
    width: 300,
  },
  yearRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  yearText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  monthGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  monthButton: {
    width: '30%',
    paddingVertical: 10,
    marginVertical: 6,
    backgroundColor: '#333',
    borderRadius: 8,
    alignItems: 'center',
  },
  monthText: {
    color: 'white',
    fontSize: 16,
  },
  selectedMonth: {
    backgroundColor: '#facc15',
  },
  selectedText: {
    color: '#000',
    fontWeight: 'bold',
  },
  closeBtn: {
    marginTop: 20,
    alignSelf: 'center',
  },
});
