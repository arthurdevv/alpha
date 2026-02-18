import { memo, useEffect, useState } from 'preact/compat';

import { clamp, hsv } from 'app/utils/color-utils';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

import {
  AlphaSlider,
  Container,
  Controls,
  Cursor,
  HexInput,
  HueSlider,
  SaturationBox,
  SliderContainer,
} from './styles';

const ColorPicker: React.FC<ColorPickerProps> = ({
  isPickingColor,
  currentColor,
  handleSelect,
}: ColorPickerProps) => {
  const [isVisible, setIsVisible] = useState<boolean>(isPickingColor);

  const hsvColor = hsv.fromHex(currentColor);

  const [color, setColor] = useState<IColor>({
    hex: currentColor,
    hue: hsvColor.h,
    alpha: hsvColor.a,
    value: hsvColor.v,
    saturation: hsvColor.s,
  });

  const handleColor = <K extends keyof IColor>(
    value: IColor[K] | IColor,
    key?: K,
  ) => {
    setColor(color => {
      let updated: IColor = { ...color };

      if (typeof value === 'object') {
        updated = { ...value } as IColor;
      } else if (key && typeof value === 'number') {
        updated[key] = value as IColor[K];
      }

      return { ...updated, hex: hsv.toHex(updated) };
    });
  };

  const handleSaturation = ({ currentTarget, clientX, clientY }) => {
    const rect = currentTarget.getBoundingClientRect();

    const x = clamp(clientX - rect.left, 0, rect.width);
    const y = clamp(clientY - rect.top, 0, rect.height);

    const saturation = (x / rect.width) * 100;
    const value = 100 - (y / rect.height) * 100;

    handleColor({ ...color, saturation, value });
  };

  const handleSlider = ({ currentTarget }, key: 'hue' | 'alpha') => {
    const value = parseInt(currentTarget.value);

    handleColor(value, key);
  };

  useUpdateEffect(() => handleSelect(color.hex), [color]);

  useEffect(() => {
    if (isPickingColor) {
      setIsVisible(true);
    } else {
      const timeout = setTimeout(() => setIsVisible(false), 50);

      return () => clearTimeout(timeout);
    }
  }, [isPickingColor]);

  const { r, g, b, a } = hsv.toRgba(
    color.hue,
    color.saturation,
    color.value,
    color.alpha,
  );

  return (
    <Container $isVisible={isVisible} $isPickingColor={isPickingColor}>
      <SaturationBox
        onClick={handleSaturation}
        onMouseMove={e => e.buttons === 1 && handleSaturation(e)}
        style={{
          background: `
          linear-gradient(to top, #000, transparent),
          linear-gradient(to right, #fff, transparent),
          hsl(${color.hue} 100% 50%)`,
        }}
      >
        <Cursor
          style={{
            left: `${color.saturation}%`,
            top: `${100 - color.value}%`,
          }}
        />
      </SaturationBox>
      <Controls>
        <SliderContainer>
          <HueSlider
            type="range"
            min="0"
            max="360"
            value={color.hue}
            onChange={e => handleSlider(e, 'hue')}
          />
          <AlphaSlider
            type="range"
            min="0"
            max="100"
            value={color.alpha}
            style={{
              backgroundImage: `
              linear-gradient(to right, transparent, rgba(${`${r}, ${g}, ${b}, ${a}`})),
              linear-gradient(45deg, #555 25%, transparent 25%),
              linear-gradient(-45deg, #555 25%, transparent 25%),
              linear-gradient(45deg, transparent 75%, #555 75%),
              linear-gradient(-45deg, transparent 75%, #555 75%)`,
            }}
            onChange={e => handleSlider(e, 'alpha')}
          />
        </SliderContainer>
        <HexInput
          type="text"
          maxLength={9}
          value={color.hex}
          placeholder="#00000000"
          onChange={e => handleColor(e.currentTarget.value, 'hex')}
        />
      </Controls>
    </Container>
  );
};

export default memo(ColorPicker);
