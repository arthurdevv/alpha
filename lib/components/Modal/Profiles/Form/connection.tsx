import { Fragment, memo, useEffect, useRef, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { SpinnerDownIcon } from 'components/Icons';
import { FormOption } from '.';
import {
  Entry,
  Property,
  PropertyAction,
  PropertyAdd,
  PropertyForm,
  PropertyInfo,
  PropertyInput,
  PropertyList,
  PropertyName,
  PropertyValue,
  PropertyValues,
  Selector,
  Spinner,
  Warning,
} from './styles';

const ConnectionForm: React.FC<ConnectionFormProps> = (
  props: ConnectionFormProps,
) => {
  const { schema, profile, section, properties } = props;

  const [authType, setAuthType] = useState<string>(() => {
    const { authType } = (profile as IProfile<'ssh'>).options;

    return authType || 'password';
  });

  const [input, setInput] = useState({
    type: section === 'ports' ? 'local' : 'exact',
  });

  const [inputType, setInputType] = useState<string>('local');

  const form = useRef<HTMLDivElement | null>(null);

  const { t } = useTranslation();

  const handleSelector = ({ currentTarget }) => {
    const value = currentTarget.value.toLowerCase();

    setInputType(value);
  };

  const handleProperty = ({ currentTarget }) => {
    const {
      value,
      tagName,
      placeholder,
      dataset: { key, index },
      type,
    } = currentTarget;

    if (tagName === 'INPUT') {
      const prop = key || placeholder.toLowerCase();

      setInput({ ...input, [prop]: type === 'number' ? Number(value) : value });
    } else {
      const target = profile.options[schema.key];

      if (tagName === 'SPAN') {
        target.splice(index, 1);
      } else {
        const values = Object.values(input);

        if (
          !(values.findIndex(value => value === '') !== -1) &&
          ((section === 'scripts' && values.length === 3) ||
            (section === 'ports' && values.length === 5))
        ) {
          target.push(input);

          setInput(() => {
            form.current?.childNodes.forEach(input => {
              (input as HTMLInputElement).value = '';
            });

            return { type: inputType };
          });
        }
      }

      props.setProfile({ ...profile });
    }
  };

  useEffect(() => setInput({ ...input, type: inputType }), [inputType]);

  useEffect(
    () => () => {
      setInputType(section === 'ports' ? 'local' : 'exact');
    },
    [schema],
  );

  return (
    <Fragment>
      {Array.isArray(schema) ? (
        (schema as ProfileFormSchemaOption[]).map(option => {
          let value = profile[option.key] || profile.options[option.key];

          if (option.key === 'password') {
            if (authType === 'password') {
              option.label = 'Password';
              option.type = 'password';
              value = profile.options[authType];
            } else {
              return null;
            }
          } else if (option.key === 'keyPath') {
            if (authType === 'publickey') {
              option.label = 'Private key';
              option.type = 'dialog';
            } else {
              return null;
            }
          }

          return (
            <FormOption
              key={option.key}
              value={value}
              option={option}
              setAuthType={setAuthType}
              {...props}
            />
          );
        })
      ) : (
        <Fragment>
          <PropertyForm ref={form}>
            {(schema as ProfileFormSchemaProperty).inputs.map(
              (input, index) => {
                const { key, label, type } = input;

                if (inputType === 'dynamic' && index > 2) return;

                const value =
                  key in input
                    ? input[key]
                    : section === 'ports' && inputType in schema.value
                      ? schema.value[inputType][key]
                      : undefined;

                return type !== 'selector' ? (
                  <PropertyInput
                    type={type}
                    value={value}
                    title={t(label || '')}
                    placeholder={t(label || '')}
                    data-key={key}
                    onChange={handleProperty}
                  />
                ) : (
                  <Entry>
                    <Selector onChange={handleSelector}>
                      {(schema as ProfileFormSchemaProperty).selectors.map(
                        option => (
                          <option value={option} key={option}>
                            {t(option)}
                          </option>
                        ),
                      )}
                    </Selector>
                    <Spinner style={{ top: '-0.0625rem' }} $input="text">
                      <SpinnerDownIcon />
                    </Spinner>
                  </Entry>
                );
              },
            )}
            <PropertyAdd onClick={handleProperty}>{t('Add')}</PropertyAdd>
          </PropertyForm>
          <PropertyList>
            {properties && properties.length > 0 ? (
              properties.map((property, index) => {
                const [type, key, value, subKey, subValue] =
                  Object.values(property);

                return (
                  <Property key={index}>
                    <PropertyInfo>
                      <PropertyName>
                        {schema.key === 'ports'
                          ? [
                              `${key}:${value}`,
                              subKey ? `${subKey}:${subValue}` : 'SOCKS Proxy',
                            ].map((label, index) => (
                              <Fragment key={index}>
                                {label}
                                {index === 0 && (
                                  <span style={{ fontFamily: 'sans-serif' }}>
                                    ⇌
                                  </span>
                                )}
                              </Fragment>
                            ))
                          : [key, value].map((label, index) => (
                              <Fragment key={index}>
                                {label}
                                {index === 0 && (
                                  <span
                                    style={{
                                      fontSize: 'inherit',
                                      margin: ' 0 0.3125rem',
                                    }}
                                  >
                                    {t('send')}
                                  </span>
                                )}
                              </Fragment>
                            ))}
                      </PropertyName>
                      <PropertyValues $capitalize>
                        <PropertyValue>
                          {type !== 'exact' && type !== 'regex'
                            ? t(`${type} forwarding`)
                            : type === 'exact'
                              ? t(`${type} match`)
                              : type}
                        </PropertyValue>
                      </PropertyValues>
                    </PropertyInfo>
                    <PropertyAction data-index={index} onClick={handleProperty}>
                      {t('Remove')}
                    </PropertyAction>
                  </Property>
                );
              })
            ) : (
              <Warning>{t(schema.placeholder)}</Warning>
            )}
          </PropertyList>
        </Fragment>
      )}
    </Fragment>
  );
};

export default memo(ConnectionForm);
