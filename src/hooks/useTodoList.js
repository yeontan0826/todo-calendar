import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import dayjs from 'dayjs';

const defaultTodoList = [];

const TODO_LIST_KEY = 'TODO_LIST_KEY';

export const useTodoList = (selectedDate) => {
  const [isLoading, setIsLoading] = useState(true);
  const [todoList, setTodoList] = useState(defaultTodoList);
  const [input, setInput] = useState('');

  /**
   * storage에 저장된 목록 불러오기
   */
  const fetchTodoList = async () => {
    await AsyncStorage.getItem(TODO_LIST_KEY)
      .then(async (result) => {
        if (result) {
          const newTodoList = JSON.parse(result);
          setTodoList(newTodoList);
        }
      })
      .catch(() => {
        Alert.alert(
          '불러오기 실패',
          '목록을 불러오는데 실패했습니다.\n잠시후 다시 시도해주세요.',
          [{ text: '확인' }]
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchTodoList();
  }, []);

  const saveTodoList = (newTodoList) => {
    setTodoList(newTodoList);
    AsyncStorage.setItem(TODO_LIST_KEY, JSON.stringify(newTodoList));
  };

  /**
   * 할 일 추가하기
   */
  const addTodo = () => {
    const len = todoList.length;
    const lastId = len === 0 ? 0 : todoList[len - 1].id;
    const newTodoList = [
      ...todoList,
      {
        id: lastId + 1,
        content: input,
        date: selectedDate,
        isSuccess: false,
      },
    ];
    saveTodoList(newTodoList);
  };

  /**
   * 할 일 삭제하기
   * @param todoId
   */
  const removeTodo = (todoId) => {
    const newTodoList = todoList.filter((todo) => todo.id !== todoId);
    saveTodoList(newTodoList);
  };

  /**
   * 할 일 처리
   * @param todoId
   */
  const toggleTodo = (todoId) => {
    const newTodoList = todoList.map((todo) => {
      if (todo.id !== todoId) return todo;
      return {
        ...todo,
        isSuccess: !todo.isSuccess,
      };
    });
    saveTodoList(newTodoList);
  };

  const resetInput = () => setInput('');

  const filteredTodoList = todoList.filter((todo) => {
    const isSameDate = dayjs(todo.date).isSame(selectedDate, 'date');
    return isSameDate;
  });

  return {
    isLoading,
    filteredTodoList,
    input,
    setInput,
    addTodo,
    removeTodo,
    todoList,
    toggleTodo,
    resetInput,
  };
};
