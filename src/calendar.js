import { FlatList, TouchableOpacity, View, Text } from 'react-native';
import styled from 'styled-components/native';
import dayjs from 'dayjs';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';

import { getCalendarColumns, getDayColor, getDayText } from './utils';

const columnSize = 35;

const Column = ({
  text,
  color,
  opacity,
  disabled,
  onPress,
  isSelected,
  hasTodo,
}) => {
  return (
    <ColumnContainer
      isSelected={isSelected}
      disabled={disabled}
      onPress={onPress}
    >
      <Text style={{ color, opacity, fontWeight: hasTodo ? 'bold' : 'normal' }}>
        {text}
      </Text>
    </ColumnContainer>
  );
};

const ArrowButton = ({ onPress, iconName }) => {
  return (
    <TouchableOpacity
      style={{
        paddingHorizontal: 20,
        paddingVertical: 15,
      }}
      onPress={onPress}
    >
      <SimpleLineIcons name={iconName} size={15} color="#404040" />
    </TouchableOpacity>
  );
};

const Calendar = ({
  selectedDate,
  onPressLeftArrow,
  onPressHeaderDate,
  onPressRightArrow,
  onPressDate,
  todoList,
}) => {
  const columns = getCalendarColumns(selectedDate);

  const ListHeaderComponent = () => {
    const currentDateText = dayjs(selectedDate).format('YYYY.MM');

    return (
      <View>
        {/* < YYYY.MM > */}
        <CalendarHeaderContainer>
          <ArrowButton iconName="arrow-left" onPress={onPressLeftArrow} />
          <TouchableOpacity onPress={onPressHeaderDate}>
            <Text style={{ fontSize: 20, color: '#404040' }}>
              {currentDateText}
            </Text>
          </TouchableOpacity>
          <ArrowButton iconName="arrow-right" onPress={onPressRightArrow} />
        </CalendarHeaderContainer>

        {/* 일 ~ 토 */}
        <View style={{ flexDirection: 'row' }}>
          {[0, 1, 2, 3, 4, 5, 6].map((day) => {
            const dayText = getDayText(day);
            const color = getDayColor(day);

            return (
              <Column
                key={`day-${day}`}
                text={dayText}
                color={color}
                opacity={1}
                disabled={true}
              />
            );
          })}
        </View>
      </View>
    );
  };

  const renderItem = ({ item: date }) => {
    const dateText = dayjs(date).get('date');
    const day = dayjs(date).get('day');
    const color = getDayColor(day);
    const isCurrentMonth = dayjs(date).isSame(selectedDate, 'month');
    const hasTodo = todoList.find((todo) =>
      dayjs(todo.date).isSame(dayjs(date), 'date')
    );

    const onPress = () => {
      onPressDate(date);
    };

    const isSelected = dayjs(date).isSame(selectedDate, 'date');

    return (
      <Column
        text={dateText}
        color={color}
        opacity={isCurrentMonth ? 1 : 0.4}
        onPress={onPress}
        isSelected={isSelected}
        hasTodo={hasTodo}
      />
    );
  };
  return (
    <FlatList
      data={columns}
      scrollEnabled={false}
      keyExtractor={(_, index) => `column-${index}`}
      numColumns={7}
      ListHeaderComponent={ListHeaderComponent}
      renderItem={renderItem}
    />
  );
};

export default Calendar;

const ColumnContainer = styled.TouchableOpacity`
  width: ${columnSize}px;
  height: ${columnSize}px;
  justify-content: center;
  align-items: center;
  background-color: ${(props) =>
    props.isSelected ? '#c2c2c2' : 'transparent'};
  border-radius: ${columnSize / 2}px;
`;

const CalendarHeaderContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;
