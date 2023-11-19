import { useRef } from 'react';
import {
  Alert,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import dayjs from 'dayjs';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import styled from 'styled-components/native';
import Ionicons from '@expo/vector-icons/Ionicons';

import { useCalendar } from './src/hooks/useCalendar';
import { useTodoList } from './src/hooks/useTodoList';
import { ITEM_WIDTH } from './src/utils';
import Calendar from './src/calendar';
import Margin from './src/margin';
import AddTodoInput from './src/addTodoInput';

export default function App() {
  const now = dayjs();

  const {
    selectedDate,
    setSelectedDate,
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleConfirm,
    subtract1Month,
    add1Month,
  } = useCalendar(now);
  const {
    isLoading,
    todoList,
    filteredTodoList,
    input,
    setInput,
    addTodo,
    toggleTodo,
    removeTodo,
    resetInput,
  } = useTodoList(selectedDate);

  const flatListRef = useRef(null);

  const onPressLeftArrow = subtract1Month;
  const onPressHeaderDate = showDatePicker;
  const onPressRightArrow = add1Month;
  const onPressDate = setSelectedDate;

  const ListHeaderComponent = () => (
    <View>
      <Calendar
        selectedDate={selectedDate}
        onPressLeftArrow={onPressLeftArrow}
        onPressHeaderDate={onPressHeaderDate}
        onPressRightArrow={onPressRightArrow}
        onPressDate={onPressDate}
        todoList={todoList}
      />
      <Margin height={15} />
      <CalendarDot />
      <Margin height={15} />
    </View>
  );

  const renderItem = ({ item: todo }) => {
    const isSuccess = todo.isSuccess;
    const onPress = () => toggleTodo(todo.id);
    const onLongPress = () => {
      Alert.alert('삭제하시겠습니까?', '', [
        { style: 'cancel', text: '아니요' },
        { text: '예', onPress: () => removeTodo(todo.id) },
      ]);
    };

    return (
      <TodoButton onPress={onPress} onLongPress={onLongPress}>
        <TodoContent>{todo.content}</TodoContent>
        <Ionicons
          name="ios-checkmark"
          size={16}
          color={isSuccess ? '#595959' : '#bfbfbf'}
        />
      </TodoButton>
    );
  };

  const scrollToEnd = () => {
    setTimeout(() => {
      flatListRef.current?.scrollToEnd();
    }, 100);
  };

  const onPressAdd = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  };

  const onSubmitEditing = () => {
    addTodo();
    resetInput();
    scrollToEnd();
  };
  const onFocus = () => {
    scrollToEnd();
  };

  return (
    <SafeAreaProvider>
      <Image
        source={{
          uri: 'https://img.freepik.com/free-photo/white-crumpled-paper-texture-for-background_1373-159.jpg?w=1060&t=st=1667524235~exp=1667524835~hmac=8a3d988d6c33a32017e280768e1aa4037b1ec8078c98fe21f0ea2ef361aebf2c',
        }}
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
        }}
      />

      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <SafeAreaView style={{ flex: 1 }}>
          <Container>
            {isLoading ? (
              <Text>불러오는중...</Text>
            ) : (
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
              >
                <View>
                  <FlatList
                    ref={flatListRef}
                    data={filteredTodoList}
                    focusable={true}
                    style={{ flex: 1 }}
                    ListHeaderComponent={ListHeaderComponent}
                    renderItem={renderItem}
                  />
                  <AddTodoInput
                    value={input}
                    onChangeText={setInput}
                    placeholder={`${dayjs(selectedDate).format(
                      'MM.D'
                    )}에 추가할 할 일`}
                    onPressAdd={onPressAdd}
                    onSubmitEditing={onSubmitEditing}
                    onFocus={onFocus}
                  />
                </View>
              </KeyboardAvoidingView>
            )}
          </Container>
          <DateTimePickerModal
            isVisible={isDatePickerVisible}
            date={new Date(selectedDate)}
            mode="date"
            onConfirm={handleConfirm}
            onCancel={hideDatePicker}
          />
        </SafeAreaView>
      </TouchableWithoutFeedback>
    </SafeAreaProvider>
  );
}

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
`;

const CalendarDot = styled.View`
  width: 4px;
  height: 4px;
  border-radius: ${4 / 2}px;
  background-color: #a3a3a3;
  align-self: center;
`;

const TodoButton = styled.Pressable`
  flex-direction: row;
  width: ${ITEM_WIDTH}px;
  align-self: center;
  padding: 10px 4px;
  border-bottom-width: 0.6px;
  border-bottom-color: #a6a6a6;
`;

const TodoContent = styled.Text`
  flex: 1;
  font-size: 14px;
  color: #595959;
`;
