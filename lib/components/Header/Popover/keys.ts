import listeners from 'app/settings/listeners';
import { schema, parseKeys } from 'app/keymaps/schema';

export default (label: string, setKeys: React.SetStateAction<string[]>) => {
  const command = Object.keys(schema).find(key => schema[key] === label);

  if (command) {
    listeners.subscribe('keymaps', () => {
      let { keys } = parseKeys(command);

      keys = keys.map(key => (key === 'shift' ? '⇧' : key));

      setKeys(keys);
    });
  }
};
