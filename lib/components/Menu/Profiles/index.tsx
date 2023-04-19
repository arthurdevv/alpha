import { Fragment, h } from 'preact';
import { memo } from 'preact/compat';

import userProfiles from 'app/common/profiles';
import { Shell } from './styles';
import {
  Search,
  SearchInput,
  Separator,
  Wrapper,
  Title,
  Label,
  List,
  ListItem,
} from '../styles';
import { onSearch, sortArray } from '../utils';

const Profiles: React.FC<MenuProps> = (props: MenuProps) => {
  const { recent } = props;

  const schema = {
    Recent: recent,
    Profiles: userProfiles,
  };

  return (
    <Fragment>
      <Search>
        <SearchInput
          placeholder="Select or type a profile"
          onChange={onSearch}
        />
      </Search>
      {Object.keys(schema).map((title, index) => {
        const array = schema[title];

        const isRecent = array === recent;

        return (
          <Wrapper
            key={index}
            className={isRecent && recent.length < 1 && 'hidden'}
          >
            <Separator />
            <Title>{title}</Title>
            <List role="group">
              {sortArray(array).map((profile: IProfile, index) => {
                const { title: label, shell } = profile;

                return (
                  <ListItem
                    key={index}
                    state={props}
                    data-label={label}
                    onClick={() => props.selectProfile(profile)}
                  >
                    <Label>{label}</Label>
                    <Shell>{shell}</Shell>
                  </ListItem>
                );
              })}
              {isRecent && (
                <ListItem state={props} onClick={props.clearRecent}>
                  <Label>Clear recently opened</Label>
                </ListItem>
              )}
            </List>
          </Wrapper>
        );
      })}
    </Fragment>
  );
};

export default memo(Profiles);
