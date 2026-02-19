import { css, styled } from 'styled-components';

export const Container = styled.div<{
  $isVisible: boolean;
  $isPickingColor: boolean;
}>`
  position: relative;
  max-width: 9.875rem;
  max-height: 0;
  width: 100%;
  z-index: 10;
  opacity: 0;
  pointer-events: none;
  padding: ${props => (props.$isVisible ? '0 0.5rem 0.5rem' : 0)};
  transition:
    max-height 0.2s ease 0s,
    opacity 0.2s ease 0s,
    padding 0.2s ease 0.1s;

  ${props =>
    props.$isPickingColor &&
    css`
      max-height: 12.375rem;
      opacity: 1;
      pointer-events: all;
      transition:
        max-height 0.2s linear 0s,
        opacity 0.2s linear 0.1s,
        padding 0.2s ease 0s;
    `};
`;

export const SaturationBox = styled.div`
  position: relative;
  width: 100%;
  height: 6.875rem;
  border-radius: 3px;
  cursor: crosshair;
`;

export const Cursor = styled.div`
  position: absolute;
  width: 0.75rem;
  height: 0.75rem;
  border: 2px solid #ffffff;
  border-radius: 50%;
  box-shadow:
    0 0 0 1px rgba(0, 0, 0, 0.3),
    0 2px 4px rgba(0, 0, 0, 0.2);
  transform: translate(-50%, -50%);
  pointer-events: none;
`;

export const Controls = styled.div`
  margin-top: 0.375rem;
  gap: 0.625rem;
  display: flex;
  flex-direction: column;
`;

export const SliderContainer = styled.div`
  gap: 0.75rem;
  display: flex;
  flex-direction: column;
`;

export const slider = `
  width: 100%;
  height: 0.625rem;
  cursor: pointer;
  border-radius: 10px;
  appearance: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    width: 0.75rem;
    height: 0.75rem;
    cursor: pointer;
    background: #ffffff;
    border: 2px solid #ffffff;
    border-radius: 50%;
    box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.3), 0 2px 4px rgba(0, 0, 0, 0.2);
    appearance: none;
    -webkit-appearance: none;
  }
`;

export const HueSlider = styled.input`
  ${slider}

  background: linear-gradient(to right,
    hsl(0, 100%, 50%),
    hsl(60, 100%, 50%),
    hsl(120, 100%, 50%),
    hsl(180, 100%, 50%),
    hsl(240, 100%, 50%),
    hsl(300, 100%, 50%),
    hsl(360, 100%, 50%)
  );
`;

export const AlphaSlider = styled.input`
  ${slider}

  background-size:
    100% 100%,
    8px 8px,
    8px 8px,
    8px 8px,
    8px 8px;
  background-position:
    0 0,
    0 0,
    0 4px,
    4px -4px,
    -4px 0px;
`;

export const HexInput = styled.input`
  width: 100%;
  padding: 0.375rem 0.5rem;
  font-size: 0.75rem;
  font-family: 'Consolas', monospace;
  text-align: center;
  color: ${props => props.theme.disabled};
  border: 1px solid ${props => props.theme.border};
  border-radius: 3px;
  transition: color 0.2s ease 0s;

  &:focus,
  &:hover {
    color: ${props => props.theme.foreground};
  }
`;
