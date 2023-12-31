import { FormEvent, useState } from 'react';
import * as Checkbox from '@radix-ui/react-checkbox';
import { Check } from 'phosphor-react';
import { api } from '../lib/axios';

const availableWeekDays = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];

export function NewHabitForm() {
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

  async function createNewHabit(event: FormEvent) {
    try {
      event.preventDefault();

      if (!title.trim() || !weekDays.length) {
        return alert('Informe qual o seu comprometimento e a recorrência.');
      }

      await api.post('/habits', { title, weekDays });

      setTitle('');
      setWeekDays([]);

      alert('Hábito criado com sucesso!');
    }
    catch (error) {
      alert('Não foi possível criar o novo hábito.');
      console.log(error);
    }
  }

  return (
    <form onSubmit={createNewHabit} className='w-full flex flex-col mt-6'>
      <label htmlFor='title' className='font-semibold leading-tight'>
        Qual seu comprometimento?
      </label>

      <input
        type='text'
        id='title'
        placeholder='ex.: Exercícios, dormir bem, etc...'
        className='p-4 rounded-lg mt-3 bg-zinc-800 text-white placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-violet-600 focus:ring-offset-2 focus:ring-offset-zinc-900'
        autoFocus
        value={title}
        onChange={event => setTitle(event.target.value)}
      />

      <label htmlFor='' className='font-semibold leading-tight mt-4'>
        Qual a recorrência?
      </label>

      <div className='flex flex-col gap-2 mt-3'>
        {
          availableWeekDays.map((availableWeekDay, index) => (
            <Checkbox.Root
              key={availableWeekDay}
              className='flex items-center gap-3 focus:outline-none group'
              checked={weekDays.includes(index)}
              onCheckedChange={() => handleToggleWeekDay(index)}
            >
              <div className='h-8 w-8 rounded-lg flex items-center justify-center bg-zinc-900 border-2 border-zinc-800 group-data-[state=checked]:bg-green-500 group-data-[state=checked]:border-green-500 transition-colors group-focus:ring-2 group-focus:ring-violet-600 group-focus:ring-offset-2 group-focus:ring-offset-zinc-900'>
                <Checkbox.Indicator>
                  <Check size={20} className='text-white'>
                  </Check>
                </Checkbox.Indicator>
              </div>

              <span className='text-white leading-tight'>
                {availableWeekDay}
              </span>
            </Checkbox.Root>
          ))
        }
      </div>

      <button
        type='submit'
        className='mt-6 rounded-lg p-4 flex items-center justify-center gap-3 font-semibold bg-green-600 hover:bg-green-500 transition-colors focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-zinc-900'
      >
        <Check size={20} weight='bold' />
        Confirmar
      </button>
    </form>
  );
}