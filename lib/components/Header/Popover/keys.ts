import listeners from 'app/settings/listeners';
import schema, { parseKeys } from 'lib/components/Settings/Keymaps/schema';

export default (label: string, setKeys: React.StateUpdater<string[]>) => {
  const command = Object.keys(schema).find(key => schema[key] === label);

  if (command) {
    listeners.subscribe('keymaps', () => {
      const keys = parseKeys(command).map(key => (key === 'shift' ? '⇧' : key));

      setKeys(keys);
    });
  }
};
