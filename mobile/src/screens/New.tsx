import { useState } from 'react';
import { Alert, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Feather } from '@expo/vector-icons';
import colors from 'tailwindcss/colors';

import { api } from '../lib/axios';

import { BackButton } from '../components/BackButton';
import { Checkbox } from '../components/Checkbox';

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function New() {
  const [title, setTitle] = useState('');
  const [weekDays, setWeekDays] = useState<number[]>([]);

  function handleToggleWeekDay(weekDayIndex: number) {
    setWeekDays(prevState => {
      if (prevState.includes(weekDayIndex)) {
        return prevState.filter(weekDay => weekDay !== weekDayIndex);
      }
      return [...prevState, weekDayIndex];
    });
  }

  async function createNewHabit() {
    try {
      if (!title.trim() || !weekDays.length) {
        return Alert.alert('Criar Hábito', 'Informe qual o seu comprometimento e a recorrência.');
      }

      await api.post('/habits', { title, weekDays });

      setTitle('');
      setWeekDays([]);

      Alert.alert('Criar Hábito', 'Hábito criado com sucesso!');
    }
    catch (error) {
      Alert.alert('Erro', 'Não foi possível criar o novo hábito.');
      console.log(error);
    }
  }

  return (
    <View className='flex-1 bg-background px-8 pt-16'>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        <BackButton />

        <Text className='mt-6 text-white font-extrabold text-3xl'>
          Criar Hábito
        </Text>

        <Text className='mt-6 text-white font-semibold text-base'>
          Qual seu comprometimento?
        </Text>

        <TextInput
          className='h-12 pl-4 rounded-lg mt-3 bg-zinc-900 text-white border-2 border-zinc-800 focus:border-green-600'
          placeholder='Exercícios, dormir bem, etc...'
          placeholderTextColor={colors.zinc[400]}
          value={title}
          onChangeText={setTitle}
        />

        <Text className='font-semibold mt-4 mb-3 text-white text-base'>
          Qual a recorrência?
        </Text>

        {
          availableWeekDays.map((availableWeekDay, index) => (
            <Checkbox
              key={availableWeekDay}
              title={availableWeekDay}
              checked={weekDays.includes(index)}
              onPress={() => handleToggleWeekDay(index)}
            />
          ))
        }

        <TouchableOpacity
          activeOpacity={0.7}
          className='w-full h-14 flex-row items-center justify-center bg-green-600 rounded-md mt-6'
          onPress={createNewHabit}
        >
          <Feather
            name='check'
            size={20}
            color={colors.white}
          />
          <Text className='font-semibold text-base text-white ml-2'>
            Confirmar
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}