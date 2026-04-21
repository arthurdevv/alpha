import { cx } from '@linaria/core';
import { memo, useMemo } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import type { FlatSettings, GeneralSetting } from 'shared/types';
import { useAppStore } from 'ui/store/app/store';

import { SpinnerIcon } from 'components/Icons/SpinnerIcon';
import { TriangleDownIcon } from 'components/Icons/TriangleDownIcon';
import { Key } from 'components/Tooltip/styles';

import {
  Item,
  Content,
  Name,
  Description,
  Switch,
  Slider,
  Selector,
  Input,
  Entry,
  Spinner,
  Segmented,
  Badges,
  Progress,
  Ranges,
} from './styles';
import Tooltip from '../Tooltip';

interface SettingProps extends GeneralSetting {
  _key: keyof FlatSettings;
  value: any;
  changed: boolean;
}

function manipulateClassList(
  element: HTMLElement,
  token: string,
  action: 'add' | 'remove' | 'toggle',
) {
  if (action === 'toggle') {
    return element.classList.toggle(token);
  }

  if (action === 'add') {
    element.classList.add(token);
  } else if (action === 'remove') {
    element.classList.remove(token);
  }

  element.parentElement?.childNodes.forEach(sibling => {
    if (sibling !== element) (sibling as HTMLElement).classList.remove('s');
  });
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

  const handleChange = ({ currentTarget }: preact.TargetedEvent<any>, _value?: any) => {
    let newValue: any;

    switch (input) {
      case 'checkbox':
        newValue = !value;
        manipulateClassList(currentTarget, 'c', 'toggle');
        break;
      case 'segmented':
        newValue = _value;
        manipulateClassList(currentTarget, 's', 'add');
        break;
      case 'number':
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

  const progress = useMemo(() => {
    if (!range) return 0;
    return ((value - range.min) / (range.max - range.min)) * 100;
  }, [value, range]);

  return (
    <Item>
      <Content>
        <Name>
          {t(name)}
          {badges && (
            <Badges className={cx(changed && 'v')}>
              {badges.map((badge, index) => (
                <Key key={index}>{t(badge.label)}</Key>
              ))}
            </Badges>
          )}
        </Name>
        <Entry>
          {input === 'checkbox' ? (
            <Switch className={cx(value && 'c')} onClick={handleChange}>
              <Slider />
            </Switch>
          ) : input === 'select' ? (
            <>
              <Selector onChange={handleChange}>
                {options?.map(option => (
                  <option
                    key={option.value}
                    value={option.value!}
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
                <div
                  key={option.value}
                  className={cx(option.value === value && 's')}
                  onClick={e => handleChange(e, option.value)}
                >
                  {t(option.label)}
                </div>
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
                onChange={handleChange}
                style={input === 'range' ? { '--progress': `${progress}%` } : undefined}
              />
              {input === 'range' && (
                <>
                  <Progress className="progress" style={{ left: `${progress}%` }}>
                    <Tooltip
                      label={range?.type === 'number' ? value : `${(value * 100).toFixed(0)}%`}
                      position="bottom"
                    />
                  </Progress>
                  <Ranges>
                    <span>{range?.type === 'number' ? range?.min : `${range!.min * 100}`}</span>
                    <span>{range?.type === 'number' ? range?.max : `${range!.max * 100}`}</span>
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
