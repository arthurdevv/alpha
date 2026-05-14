import { useEffect } from 'preact/hooks';
import { useShallow } from 'zustand/shallow';

import { useAppStore } from 'ui/store/app/store';

import Home from './components/Home';
import Settings from './components/Settings';
// import Terminal from './components/Terminal';
import Titlebar from './components/Titlebar';

export default function Alpha() {
  // const [isFirstRun, setIsFirstRun] = useState(firstRunFlag);

  // useEffect(() => {
  //   if (!isFirstRun) return invokeEvents(useTermsStore);

  //   // unlink(firstRunFlagPath, error => error && reportError(error));
  // }, [isFirstRun]);

  // const { theme, acrylic, preserveBackground } = useAppStore(
  //   useShallow(s => ({
  //     theme: s.settings.theme,
  //     acrylic: s.settings.acrylic,
  //     preserveBackground: s.settings.preserveBackground,
  //   })),
  // );

  // useEffect(() => {
  //   if (theme === 'default') return;

  //   if (!origin || preserveBackground) {
  //     // removeThemeVariables();
  //   } else {
  //     // setThemeVariables(theme, { acrylic, preserveBackground });
  //   }
  // }, [origin, preserveBackground]);

  const { settings, setSetting, setSettings } = useAppStore(
    useShallow(s => ({
      settings: s.settings,
      setSetting: s.setSetting,
      setSettings: s.setSettings,
    })),
  );

  useEffect(() => {
    ipc.settings.get().then(setSettings);
    ipc.profiles.defaults(true).then(profiles => setSetting('profiles', profiles));
  }, []);

  // if (!settings.version) return null;

  return (
    // 1 > 2 ? (
    // <Welcome setIsFirstRun={setIsFirstRun} setModal={setModal} />
    // <></>
    // ) : (
    <>
      <Titlebar isFirstRun={false} />
      <main>
        <Home />
        {/* <Terminal /> */}
        {/* <Settings /> */}
      </main>
      {/* <Modal /> */}
    </>
  );
}
