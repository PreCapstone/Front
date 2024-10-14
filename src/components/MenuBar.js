import React from 'react';
import styled from 'styled-components';
import { FaRobot } from "react-icons/fa";
import { FaClipboardList } from "react-icons/fa";

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  background-color: #f0f0f0;
`;

const MenuItem = styled.button`
  padding: 10px;
  font-size: 18px;
  text-align: center;
  background-color: ${({ active }) => (active ? '#9B30FF' : '#fff')};
  color: ${({ active }) => (active ? '#fff' : '#000')};
  border: none;
  cursor: pointer;
  margin: 5px 0;

  &:hover {
    background-color: #9B30FF;
    color: #fff;
  }
`;

const MenuBar = ({ setActivePage, activePage }) => {
  return (
    <MenuContainer>
      <MenuItem active={activePage === 'AIGen'} onClick={() => setActivePage('AIGen')}>
        <FaRobot/> <br></br> {/*아이콘*/}
        AI 자동 생성
      </MenuItem>
      <MenuItem active={activePage === 'Other'} onClick={() => setActivePage('Other')}>
        <FaClipboardList/> <br></br> {/*아이콘*/}
        추천 템플릿
      </MenuItem>
    </MenuContainer>
  );
};

export default MenuBar;
