import { h } from 'preact';
import { memo } from 'preact/compat';

import { Label, LabelText, LabelArrow } from './styles';

const ControlsLabel: React.FC<{ text: string }> = ({ text }) => (
  <Label>
    <LabelArrow />
    <LabelText>{text}</LabelText>
  </Label>
);

export default memo(ControlsLabel);
