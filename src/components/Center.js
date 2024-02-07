"use client"
import styled from "styled-components";

const DivWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export default function Center({children}) {
    return(
      <DivWrapper>
        {children}
      </DivWrapper>
    );
  };