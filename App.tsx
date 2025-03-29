import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import StatisticsScreen from './screens/StatisticsScreen';
import MonthSelector from './components/MonthSelector';
import ChatWithSummaryScreen from './screens/ChatWithSummaryScreen';
import CustomDrawerContent from './components/CustomDrawerContent';
import { Expense } from './types';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Drawer = createDrawerNavigator();

export default function App() {
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [income, setIncome] = useState<Expense[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [messages, setMessages] = useState<{ role: 'user' | 'system'; content: string }[]>([
    { role: 'system', content: 'Welcome to your expense tracker! You can add expenses by typing or using the voice button.' },
  ]);

  const addExpense = (description: string, amount: number, category: string = 'General', isIncome: boolean = false) => {
    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount,
      category,
      date: new Date(),
      isIncome
    };

    if (isIncome) {
      setIncome(prev => [newExpense, ...prev]);
    } else {
      setExpenses(prev => [newExpense, ...prev]);
    }
  };

  const handleChatSubmit = async (message: string) => {
    setMessages((prev) => [...prev, { role: 'user', content: message }]);

    try {
      const res = await fetch("https://allen-api-service.onrender.com/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await res.json();

      if (data.reply) {
        setMessages((prev) => [...prev, { role: 'system', content: data.reply }]);
      }

      if (data.parsedExpense) {
        const { description, amount, category } = data.parsedExpense;
        addExpense(description, amount, category);
      }
    } catch (err) {
      setMessages((prev) => [...prev, { role: 'system', content: 'Error talking to server 😢' }]);
      console.error(err);
    }
  };

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Home"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={({ navigation, route }) => ({
            headerStyle: { backgroundColor: '#1E1E1E' },
            headerTintColor: '#fff',
            drawerStyle: { backgroundColor: '#1E1E1E' },
            drawerLabelStyle: { color: '#fff' },
            drawerActiveTintColor: '#FF5252',
            headerTitleStyle: { color: '#fff' },
            sceneContainerStyle: { backgroundColor: '#121212' },
            headerLeft: () => (
              route.name !== 'Home' ? (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 16 }}>
                  <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => navigation.openDrawer()} style={{ paddingLeft: 16 }}>
                  <Ionicons name="menu" size={24} color="white" />
                </TouchableOpacity>
              )
            ),
          })}
        >
          <Drawer.Screen
            name="Home"
            options={{
              title: '',
              headerTitle: () => (
                <MonthSelector currentMonth={currentMonth} onMonthChange={setCurrentMonth} />
              ),
            }}
          >
            {(props) => (
              <ChatWithSummaryScreen
                {...props}
                expenses={expenses}
                income={income}
                messages={messages}
                onSendMessage={handleChatSubmit}
                currentMonth={currentMonth}
              />
            )}
          </Drawer.Screen>
          <Drawer.Screen name="Statistics" options={{ title: '統計報表' }}>
            {(props) => (
              <StatisticsScreen
                {...props}
                expenses={expenses}
                income={income}
                currentMonth={currentMonth}
              />
            )}
          </Drawer.Screen>
        </Drawer.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}


const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    padding: 8,
  },
  monthText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});


import { AppRegistry } from 'react-native';
AppRegistry.registerComponent('main', () => App);



