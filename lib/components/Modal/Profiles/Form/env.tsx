import { Fragment, h } from 'preact';
import { memo } from 'preact/compat';

import { clipboard } from '@electron/remote';

import {
  EnvAction,
  EnvAdd,
  EnvForm,
  EnvInfo,
  EnvInput,
  EnvItem,
  EnvList,
  EnvName,
  EnvValue,
  EnvWarning,
  Wrapper,
} from './styles';

const Enviroment: React.FC<EnviromentProps> = ({ profile, setProfile }) => {
  const variable: Record<string, string> = {};

  const { env } = profile.options;

  const handleEnv = ({ currentTarget }) => {
    const { ariaLabel, tagName } = currentTarget;

    if (tagName === 'INPUT') {
      const { value, placeholder } = currentTarget;

      variable[placeholder.toLowerCase()] = value;
    } else {
      if (tagName === 'SPAN') {
        delete env[ariaLabel];
      } else {
        const { name, value } = variable;

        if (name && value) {
          env[name] = value;
        }
      }

      setProfile({ ...profile });
    }
  };

  const handleCopy = ({ currentTarget }) => {
    const { innerText } = currentTarget;

    clipboard.writeText(innerText);
  };

  return (
    <Fragment>
      <Wrapper>
        <EnvForm>
          <EnvInput placeholder="Name" onChange={handleEnv} />
          <EnvInput placeholder="Value" onChange={handleEnv} />
          <EnvAdd onClick={handleEnv}>Add</EnvAdd>
        </EnvForm>
        {Object.keys(env).length > 0 ? (
          <EnvList>
            {Object.entries(env).map(([name, value], index) => (
              <EnvItem key={index}>
                <EnvInfo>
                  <EnvName>{name}</EnvName>
                  <EnvValue onClick={handleCopy}>{value}</EnvValue>
                </EnvInfo>
                <EnvAction aria-label={name} onClick={handleEnv}>
                  Remove
                </EnvAction>
              </EnvItem>
            ))}
          </EnvList>
        ) : (
          <EnvWarning>No variables added</EnvWarning>
        )}
      </Wrapper>
    </Fragment>
  );
};

export default memo(Enviroment);
