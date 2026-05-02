import { cx } from '@linaria/core';
import { useEffect, useRef, useState } from 'preact/hooks';

import type { FlatSettings } from 'shared/types';
import { useAppStore } from 'ui/store/app/store';
import type { SectionProps, SettingsSection } from 'ui/types';
import { scrollToTop } from 'ui/utils/misc';
import { local } from 'ui/utils/storage';

import Appearance from './Appearance';
import Setting from './Setting';
import schema from './schema';
import { Container, Navigation, NavigationItem, Section, Title } from './styles';

const sectionMap: Record<SettingsSection, React.ComponentType<SectionProps>> = {
  // Application,
  Appearance,
  // Profiles,
  // Keymaps,
  // Workspaces,
  // 'Config file': Config,
};

const storedKeys = ['theme', 'profiles', 'workspaces'] as const;

export default function Settings() {
  const settings = useAppStore(s => s.settings);

  const [section, setSection] = useState<SettingsSection>(() => {
    return local.parse('section', 'Application');
  });

  const [storedOptions, setStoredOptions] = useState<Record<string, any[]>>({});

  const settingsRef = useRef<typeof settings>(settings);

  const handleNavigation = (section: SettingsSection) => {
    setSection(section);
    scrollToTop('section');
    local.update('section', section);
  };

  useEffect(() => {
    const promises = storedKeys.map(async key => {
      const items = key === 'theme' ? await ipc.theme.list() : (settings[key] ?? []);

      const options = items.map((item: any) => ({
        label: key === 'theme' ? item : item.name,
        value: key === 'theme' ? item : item.id,
      }));

      return [key, options] as const;
    });

    Promise.all(promises).then(results => {
      const entries = Object.fromEntries(results);
      setStoredOptions(entries);
    });

    const timeout = setTimeout(() => {
      ipc.settings.save(settings as FlatSettings);
    }, 500);

    return () => clearTimeout(timeout);
  }, [settings]);

  const content = schema[section].map(item => {
    if ('title' in item) {
      return <Title key={item.title}>{item.title}</Title>;
    }

    const options =
      item.input === 'select' || item.input === 'segmented'
        ? item.options.concat(
            item.input === 'select' && item.source ? (storedOptions[item.source] ?? []) : [],
          )
        : undefined;

    const value = settings[item.key];
    const valueRef = settingsRef.current[item.key];
    const changed = value !== valueRef;

    return <Setting {...item} _key={item.key} value={value} changed={changed} options={options} />;
  });

  const SectionComponent = sectionMap[section];
  const children = SectionComponent ? <SectionComponent content={content} /> : content;

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
      <Section>{children}</Section>
    </Container>
  );
}
