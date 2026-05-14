import { cx } from '@linaria/core';
import { useEffect, useRef, useState } from 'preact/hooks';
import { useShallow } from 'zustand/shallow';

import type { FlatSettings } from 'shared/types';
import { useAppStore } from 'ui/store/app/store';
import type { SectionProps, SettingsSection } from 'ui/types';
import { scrollToTop } from 'ui/utils/misc';
import { local } from 'ui/utils/storage';

import Appearance from './Appearance';
import Application from './Application';
import ConfigFile from './Config File';
import Keymaps from './Keymaps';
import Profiles from './Profiles';
import Setting from './Setting';
import schema from './schema';
import { Container, Navigation, NavigationItem, Section, Title } from './styles';

// const sections: Record<SettingsSection, React.ComponentType<SectionProps>> = {
const sections = {
  Application,
  Appearance,
  Profiles,
  Keymaps,
  // Workspaces,
  'Config file': ConfigFile,
};

const storedKeys = ['theme', 'profiles', 'workspaces'] as const;

export default function Settings() {
  const { settings, setSettings } = useAppStore(
    useShallow(s => ({ settings: s.settings, setSettings: s.setSettings })),
  );

  const [section, setSection] = useState<SettingsSection>(() => {
    return local.parse('section', 'Application');
  });

  const [storedOptions, setStoredOptions] = useState<Record<string, any[]>>({});

  const settingsRef = useRef<typeof settings>(settings);
  const isExternalChange = useRef<boolean>(false);

  const handleNavigation = (section: SettingsSection) => {
    setSection(section);
    scrollToTop('section');
    local.update('section', section);
  };

  // useEffect(() => {
  //   ipc.subscribe('settings:changed', settings => {
  //     isExternalChange.current = true;
  //     setSettings(settings);
  //   });
  // }, []);

  useEffect(() => {
    // if (isExternalChange.current) {
    //   isExternalChange.current = false;
    //   return;
    // }

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
      ipc.settings.save(settings as FlatSettings, true);
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

  const SectionComponent = sections[section];
  const children = SectionComponent ? <SectionComponent children={content} /> : content;

  return (
    <Container>
      <Navigation role="menu">
        {Object.keys(schema).map(item => (
          <NavigationItem
            key={item}
            className={cx(item === section && 'selected')}
            onClick={() => handleNavigation(item as SettingsSection)}
          >
            {item}
          </NavigationItem>
        ))}
      </Navigation>
      <Section
        key={section}
        style={{
          '--font-size': settings.fontSize,
          '--font-family': settings.fontFamily || 'Fira Code, Consolas, monospace',
          '--line-height': (settings.lineHeight ?? 1.0) + 0.3,
          '--font-ligatures': settings.fontLigatures
            ? 'common-ligatures discretionary-ligatures'
            : 'none',
        }}
      >
        {children}
      </Section>
    </Container>
  );
}
