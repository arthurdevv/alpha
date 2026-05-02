import { cx } from '@linaria/core';
import { memo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import type { FlatSettings, GeneralSetting } from 'shared/types';
import { useAppStore } from 'ui/store/app/store';
import { manipulateClassList } from 'ui/utils/misc';

import { SpinnerIcon } from 'components/Icons/SpinnerIcon';
import { TriangleDownIcon } from 'components/Icons/TriangleDownIcon';
import Tooltip from 'components/Tooltip';
import { Key } from 'components/Tooltip/styles';

import {
  Badges,
  Content,
  Description,
  Entry,
  Input,
  Item,
  Name,
  Progress,
  Ranges,
  Segmented,
  Selector,
  Slider,
  Spinner,
  Switch,
} from './styles';

interface SettingProps extends GeneralSetting {
  _key: keyof FlatSettings;
  value: any;
  changed: boolean;
}

function Setting({
  _key,
  name,
  description,
  input,
  badges,
  options,
  range,
  value,
  changed,
}: SettingProps) {
  const setSetting = useAppStore(s => s.setSetting);

  const { t } = useTranslation();

  const handleInput = ({ currentTarget }: preact.TargetedEvent<any>, _value?: any) => {
    let newValue: any;

    switch (input) {
      case 'checkbox':
        newValue = !value;
        manipulateClassList(currentTarget, 'checked', 'toggle');
        break;
      case 'segmented':
        newValue = _value;
        manipulateClassList(currentTarget, 'selected', 'add');
        break;
      case 'number':
      case 'range':
        newValue = Number(currentTarget.value);
        break;
      default:
        newValue = currentTarget.value;
    }

    setSetting(_key, newValue);
  };

  const handleSpinnerClick = (delta: number) => {
    const newValue = (value + delta * Number(range?.step)).toFixed(1);
    setSetting(_key, Number(newValue));
  };

  const progress = range ? ((value - range.min) / (range.max - range.min)) * 100 : 0;

  return (
    <Item>
      <Content>
        <Name>
          {t(name)}
          {badges && (
            <Badges className={cx(changed && 'visible')}>
              {badges.map((badge, index) => (
                <Key key={index}>{t(badge.label)}</Key>
              ))}
            </Badges>
          )}
        </Name>
        <Entry>
          {input === 'checkbox' ? (
            <Switch className={cx(value && 'checked')} onClick={handleInput}>
              <Slider />
            </Switch>
          ) : input === 'select' ? (
            <>
              <Selector onInput={handleInput}>
                {options?.map(option => (
                  <option
                    key={option.value}
                    value={option.value as string | number}
                    selected={option.value === value}
                  >
                    {t(option.label)}
                  </option>
                ))}
              </Selector>
              <Spinner>
                <TriangleDownIcon />
              </Spinner>
            </>
          ) : input === 'segmented' ? (
            <Segmented>
              {options?.map(option => (
                <button
                  key={option.value}
                  type="button"
                  className={cx(option.value === value && 'selected')}
                  onClick={e => handleInput(e, option.value)}
                >
                  {t(option.label)}
                </button>
              ))}
            </Segmented>
          ) : (
            <>
              {input === 'number' && (
                <Spinner>
                  <SpinnerIcon
                    onIncrement={() => handleSpinnerClick(1)}
                    onDecrement={() => handleSpinnerClick(-1)}
                  />
                </Spinner>
              )}
              <Input
                value={value}
                type={input}
                min={range?.min}
                max={range?.max}
                step={range?.step}
                onInput={handleInput}
                style={input === 'range' ? { '--progress': `${progress}%` } : undefined}
              />
              {input === 'range' && range && (
                <>
                  <Progress className="progress" style={{ left: `${progress}%` }}>
                    <Tooltip
                      label={range?.type === 'number' ? value : `${(value * 100).toFixed(0)}%`}
                      position="bottom"
                    />
                  </Progress>
                  <Ranges>
                    <span>{range?.type === 'number' ? range?.min : `${range.min * 100}`}</span>
                    <span>{range?.type === 'number' ? range?.max : `${range.max * 100}`}</span>
                  </Ranges>
                </>
              )}
            </>
          )}
        </Entry>
      </Content>
      <Description>{t(description)}</Description>
    </Item>
  );
}

export default memo(Setting);
