/* eslint-disable react-hooks/refs */
import { cx } from '@linaria/core';
import { useMemo, useRef, useState } from 'preact/hooks';

import type { FlatSettings } from 'shared/types';
import { useAppStore } from 'ui/store/app/store';
import type { SettingsSection } from 'ui/types';
import { local } from 'ui/utils/storage';

import schema from './schema';
import Setting from './setting';
import { Container, Section, Navigation, NavigationItem, Title } from './styles';

export default function Settings() {
  const settings = useAppStore(s => s.settings);

  const [section, setSection] = useState<SettingsSection>(() => {
    return local.parse('section', 'Application');
  });

  const items = useMemo(() => schema[section], [section]);
  const settingsRef = useRef<Partial<FlatSettings>>();

  const handleNavigation = (section: SettingsSection) => {
    setSection(section);
    local.update('section', section);
    document.querySelector('section')?.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (!settingsRef.current) settingsRef.current = settings;

  return (
    <Container>
      <Navigation>
        {Object.keys(schema).map(item => (
          <NavigationItem
            key={item}
            className={cx(item === section && 's')}
            onClick={() => handleNavigation(item as SettingsSection)}
          >
            {item}
          </NavigationItem>
        ))}
      </Navigation>
      <Section>
        {items.map((item, index) => {
          if ('title' in item) {
            return <Title key={index}>{item.title}</Title>;
          }

          const value = settings[item.key];
          const valueRef = settingsRef.current?.[item.key];
          const changed = value !== valueRef;

          return (
            <Setting {...item} key={item.key} _key={item.key} value={value} changed={changed} />
          );
        })}
      </Section>
    </Container>
  );
}
