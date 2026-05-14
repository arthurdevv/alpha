// function createProfile(t: any, template?: IProfile | null): IProfile {
//   const profile = { ...(template ?? defaultProfiles[0]) };

//   return {
//     ...profile,
//     id: crypto.randomUUID(),
//     name: t('{{profile.name}} copy', { profile }),
//     group: 'Ungrouped',
//   };
// }

// function getGroups(
//   array?: boolean,
//   connections?: boolean,
// ): IProfile[] | Record<string, IProfile[]> {
//   const groups: Record<string, IProfile[]> = {};

//   let { profiles } = getSettings();

//   profiles = profiles.concat([...defaultProfiles]);

//   if (connections) {
//     profiles = profiles.concat([...connectionsProfiles]);
//   }

//   profiles.forEach(profile => {
//     const { group } = profile;

//     groups[group] = group in groups ? [...groups[group], profile] : [profile];
//   });

//   return array ? profiles : groups;
// }

// function getProfileByKey(key: keyof IProfile, value: any): IProfile {
//   const groups = getGroups(true) as IProfile[];

//   const profile = groups.find(profile => profile[key] === value);

//   return getDefaultProfile(profile);
// }

// function getDefaultProfile(profile?: IProfile): IProfile {
//   if (profile) return profile;

//   const { defaultProfile } = getSettings();

//   return getProfileByKey('id', defaultProfile);
// }

// function getAllProfiles(): IProfile[] {
//   const { profiles } = getSettings();

//   return profiles.concat(defaultProfiles);
// }

// function getInstanceProfile({ instances, current }: AlphaStore): IProfile | null {
//   const { origin, terms } = current;

//   if (!origin || !terms[origin]) return null;

//   const [id] = terms[origin];
//   const { profile } = instances[id];

//   return profile;
// }

// function sortGroups(groups: any): string[] {
//   const weights = { Ungrouped: -1, External: 98, System: 99, Connections: 100 };

//   if (Array.isArray(groups)) {
//     return [...groups].sort((a, b) => {
//       const weightA = weights[a] ?? 0;
//       const weightB = weights[b] ?? 0;

//       if (weightA !== weightB) return weightA - weightB;

//       return a.toLowerCase().localeCompare(b.toLowerCase());
//     });
//   }

//   return [];
// }
