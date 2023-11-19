import { TouchableOpacity } from 'react-native';
import styled from 'styled-components/native';
import AntDesign from '@expo/vector-icons/AntDesign';

import { ITEM_WIDTH } from './utils';

const AddTodoInput = ({
  value,
  onChangeText,
  placeholder,
  onPressAdd,
  onSubmitEditing,
  onFocus,
}) => {
  return (
    <InputContainer>
      <TodoInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#595959"
        onSubmitEditing={onSubmitEditing}
        blurOnSubmit={false}
        onFocus={onFocus}
      />
      <TouchableOpacity style={{ padding: 5 }} onPress={onPressAdd}>
        <AntDesign name="plus" size={18} color="#595959" />
      </TouchableOpacity>
    </InputContainer>
  );
};

export default AddTodoInput;

const InputContainer = styled.View`
  flex-direction: row;
  width: ${ITEM_WIDTH}px;
  align-self: center;
  align-items: center;
`;

const TodoInput = styled.TextInput`
  flex: 1;
  padding: 5px;
  color: #595959;
`;
