import { app } from '@electron/remote';
import { Fragment } from 'preact';
import { memo, useEffect, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { execCommand } from 'main/keymaps/commands';
import { watchKeys } from 'main/keymaps/schema';
import useStore from 'ui/store';

import { AlphaIcon } from 'components/Icons';

import {
  Container,
  Footer,
  KeyItem,
  Keys,
  Logo,
  LogoName,
  Version,
  Wrapper,
} from './styles';

const Watermark: React.FC = () => {
  const {
    current: { origin },
  } = useStore();

  const [keys, setKeys] = useState<string[]>([]);

  const { t } = useTranslation();

  useEffect(() => watchKeys('app:commands', setKeys, false), []);

  return (
    <Container $hidden={Boolean(origin)}>
      <Logo>
        <AlphaIcon />
        <LogoName>LPHA</LogoName>
      </Logo>
      <Wrapper>
        {keys.length > 0 && (
          <Fragment>
            {t('Press')}
            <Keys>
              {keys.map((key, index) => (
                <KeyItem key={index}>{key}</KeyItem>
              ))}
            </Keys>
            {t('to show all commands')}
          </Fragment>
        )}
      </Wrapper>
      <Footer>
        <Version onClick={() => execCommand('app:modal', 'About')}>
          {app.getVersion()}
        </Version>
      </Footer>
    </Container>
  );
};

export default memo(Watermark);
