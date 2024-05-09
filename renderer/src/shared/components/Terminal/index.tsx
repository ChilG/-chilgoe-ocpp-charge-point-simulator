import React from 'react';
import TerminalContainer, { TerminalContainerProps } from './TerminalContainer';
import TerminalLine, { TerminalLineProps } from './TerminalLine';

interface TerminalProps {}

const Terminal: React.FC<TerminalProps> & {
  Container: React.FC<TerminalContainerProps>;
  Line: React.FC<TerminalLineProps>;
} = (props) => {
  return <></>;
};

Terminal.Container = TerminalContainer;
Terminal.Line = TerminalLine;

export default Terminal;
