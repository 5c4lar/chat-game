import styled, { createGlobalStyle } from 'styled-components';

export const theme = {
  colors: {
    primary: '#3e64ff', // Blue for interactive elements
    secondary: '#5edfff', // Light blue for accents
    background: '#1a1a2e', // Dark blue for background
    text: '#ffffff',
    success: '#38b000', // Green for success
    warning: '#ffba08', // Yellow for warnings
    danger: '#d90429', // Red for errors
    highlight: '#7b2cbf', // Purple for highlights
  },
  fonts: {
    primary: "'Exo 2', sans-serif",
    mono: "'Space Mono', monospace",
  },
};

export const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Exo+2:wght@400;600;700&family=Space+Mono&display=swap');
  
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }
  
  html, body {
    height: 100%;
    overflow: hidden;
  }
  
  body {
    font-family: ${theme.fonts.primary};
    background-color: ${theme.colors.background};
    color: ${theme.colors.text};
    line-height: 1.5;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  #root {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  button, input, textarea {
    font-family: inherit;
  }
`;

export const AppContainer = styled.div`
  max-width: 1600px;
  width: 100%;
  margin: 0 auto;
  padding: 0.5rem;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  overflow-y: auto;
`;

export const Card = styled.div`
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border-radius: 10px;
  padding: 1.5rem;
  margin: 1rem 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
`;

export const Button = styled.button<{ variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' }>`
  background-color: ${({ variant, theme }) => 
    variant ? theme.colors[variant] : theme.colors.primary};
  color: ${theme.colors.text};
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 5px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease-in-out;
  
  &:hover {
    opacity: 0.9;
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
  }
`;

export const Heading = styled.h1`
  font-family: ${theme.fonts.primary};
  font-weight: 700;
  margin-bottom: 1rem;
  color: ${theme.colors.secondary};
  text-shadow: 0 0 10px rgba(94, 223, 255, 0.5);
`;

export const SubHeading = styled.h2`
  font-family: ${theme.fonts.primary};
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: ${theme.colors.secondary};
`;

export const Text = styled.p`
  margin-bottom: 1rem;
`;

export const FlexRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1rem;
  align-items: center;
`;

export const FlexColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

export const Spacer = styled.div<{ size: number }>`
  height: ${props => props.size}rem;
  width: 100%;
`;

export const CodeBlock = styled.pre`
  background-color: rgba(0, 0, 0, 0.3);
  padding: 1rem;
  border-radius: 5px;
  overflow-x: auto;
  font-family: ${theme.fonts.mono};
  margin: 1rem 0;
  border-left: 3px solid ${theme.colors.secondary};
`;

export const Badge = styled.span<{ variant?: 'success' | 'warning' | 'danger' }>`
  background-color: ${({ variant, theme }) => 
    variant ? theme.colors[variant] : theme.colors.primary};
  color: ${theme.colors.text};
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
  display: inline-block;
`;

export const SpaceshipModule = styled.div<{ unlocked: boolean }>`
  width: 100px;
  height: 100px;
  background-color: ${props => props.unlocked ? 'rgba(56, 176, 0, 0.2)' : 'rgba(217, 4, 41, 0.2)'};
  border: 2px solid ${props => props.unlocked ? props.theme.colors.success : props.theme.colors.danger};
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  
  &:hover {
    transform: ${props => props.unlocked ? 'scale(1.05)' : 'none'};
    box-shadow: ${props => props.unlocked ? '0 0 15px rgba(56, 176, 0, 0.5)' : 'none'};
  }
`;

export const ConsoleText = styled.div`
  font-family: ${theme.fonts.mono};
  line-height: 1.5;
  background-color: rgba(0, 0, 0, 0.8);
  padding: 1rem;
  border-radius: 5px;
  color: ${theme.colors.secondary};
  overflow-x: auto;
`;

export const ProgressBar = styled.div<{ progress: number }>`
  width: 100%;
  height: 10px;
  background-color: rgba(255, 255, 255, 0.1);
  border-radius: 5px;
  position: relative;
  overflow: hidden;
  
  &:after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: ${props => props.progress}%;
    background-color: ${theme.colors.secondary};
    transition: width 0.3s ease;
  }
`;