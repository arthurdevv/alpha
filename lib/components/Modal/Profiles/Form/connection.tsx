import { h } from 'preact';
import { Fragment, memo, useEffect, useRef, useState } from 'preact/compat';

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

let property: Record<string, string | number> = {};

const ConnectionForm: React.FC<ConnectionFormProps> = (
  props: ConnectionFormProps,
) => {
  const { schema, profile, section, properties } = props;

  const [authType, setAuthType] = useState<string>(() => {
    const { authType } = (profile as IProfile<'ssh'>).options;

    return authType || 'password';
  });

  const [propertyType, setPropertyType] = useState<string>('');

  const form = useRef<HTMLDivElement | null>(null);

  const handleSelector = (value: string) => {
    value = value.toLowerCase();

    setPropertyType(() => {
      property.type = value;

      return value;
    });

    if (section === 'ports') property = { ...schema.value[value] };
  };

  const handleProperty = ({ currentTarget }) => {
    let {
      type,
      value,
      tagName,
      placeholder,
      dataset: { key, index },
    } = currentTarget;

    if (tagName === 'INPUT') {
      key = key || placeholder.toLowerCase();

      property[key] = type === 'number' ? Number(value) : value;
    } else {
      const target = profile.options[schema.key];

      if (tagName === 'SPAN') {
        target.splice(index, 1);
      } else {
        const values = Object.values(property).filter(value => value !== '');

        if (
          (section === 'scripts' && values.length === 3) ||
          (section === 'ports' &&
            ((propertyType === 'dynamic' && values.length === 3) ||
              (propertyType !== 'dynamic' && values.length === 5)))
        ) {
          target.push(property);

          clearFormValues();
        }
      }

      props.setProfile({ ...profile });
    }
  };

  const clearFormValues = () => {
    form.current?.childNodes.forEach(element => {
      (element as HTMLInputElement).value = '';
    });

    property = {};
  };

  useEffect(() => {
    clearFormValues();

    if (section === 'ports') {
      handleSelector('local');
    } else if (section === 'scripts') {
      handleSelector('exact');
    }
  }, [section]);

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

                if (propertyType === 'dynamic' && index > 2) return;

                return type !== 'selector' ? (
                  <PropertyInput
                    type={type}
                    value={key in property ? property[key] : undefined}
                    placeholder={label}
                    data-key={key}
                    onChange={handleProperty}
                  />
                ) : (
                  <Entry>
                    <Selector
                      onChange={event =>
                        handleSelector(event.currentTarget.value)
                      }
                    >
                      {(schema as ProfileFormSchemaProperty).selectors.map(
                        option => (
                          <option value={option} key={option}>
                            {option}
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
            <PropertyAdd onClick={handleProperty}>Add</PropertyAdd>
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
                                    send
                                  </span>
                                )}
                              </Fragment>
                            ))}
                      </PropertyName>
                      <PropertyValues $capitalize>
                        <PropertyValue>
                          {type !== 'exact' && type !== 'regex' ? (
                            <Fragment>{type}</Fragment>
                          ) : (
                            <Fragment>
                              {type === 'exact' ? (
                                <Fragment>
                                  {type}
                                  <span> match</span>
                                </Fragment>
                              ) : (
                                type
                              )}
                            </Fragment>
                          )}
                        </PropertyValue>
                      </PropertyValues>
                    </PropertyInfo>
                    <PropertyAction data-index={index} onClick={handleProperty}>
                      Remove
                    </PropertyAction>
                  </Property>
                );
              })
            ) : (
              <Warning>{schema.placeholder}</Warning>
            )}
          </PropertyList>
        </Fragment>
      )}
    </Fragment>
  );
};

export default memo(ConnectionForm);
