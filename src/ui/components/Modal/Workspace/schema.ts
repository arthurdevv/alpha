import { getAllProfiles } from 'app/common/profiles';

export default {
  profile: {
    name: 'Profile',
    label: 'Profile used as the base configuration for this tab.',
    type: 'string',
    input: 'select',
    options: getAllProfiles(),
  },
  overrideTitle: {
    name: 'Override title',
    label: 'Whether the terminal title should be overridden by this tab title.',
    type: 'boolean',
    input: 'checkbox',
    options: [] as IProfile[],
  },
};
