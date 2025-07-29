import styled from 'styled-components';

const Icon = styled.div<{ draggable?: boolean }>`
  width: 64px;
  height: 64px;
  background-color: #f7403a;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

export default Icon;
