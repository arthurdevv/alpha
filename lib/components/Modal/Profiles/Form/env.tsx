import { h } from 'preact';
import { Fragment, memo, useState } from 'preact/compat';

import { clipboard } from '@electron/remote';

import { FormOption } from '.';
import {
  Copied,
  Property,
  PropertyAction,
  PropertyAdd,
  PropertyForm,
  PropertyInfo,
  PropertyInput,
  PropertyList,
  PropertyName,
  PropertyTooltip,
  PropertyValue,
  PropertyValues,
  Warning,
} from './styles';

const property: Record<string, string> = {};

const EnvironmentForm: React.FC<EnvironmentFormProps> = (
  props: EnvironmentFormProps,
) => {
  const { schema, profile, properties } = props;

  const [copied, setCopied] = useState<boolean>(false);

  const handleProperty = ({ currentTarget }) => {
    const { tagName, value, placeholder, ariaLabel } = currentTarget;

    if (tagName === 'INPUT') {
      property[placeholder.toLowerCase()] = value;
    } else {
      const target = profile.options[schema.key];

      if (tagName === 'SPAN') {
        delete target[ariaLabel];
      } else {
        const { name, value } = property;

        if (name && value) target[name] = value;
      }

      props.setProfile({ ...profile });
    }
  };

  const handleCopy = ({ currentTarget }) => {
    const { innerText } = currentTarget;

    clipboard.writeText(innerText);

    setCopied(true);

    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <Fragment>
      {Array.isArray(schema) ? (
        schema.map(option => {
          const value = profile[option.key] || profile.options[option.key];

          return (
            <FormOption key={option} option={option} value={value} {...props} />
          );
        })
      ) : (
        <Fragment>
          <PropertyForm>
            {(schema as ProfileFormSchemaProperty).inputs.map(input => {
              const { label, type } = input;

              return (
                <PropertyInput
                  key={label}
                  type={type}
                  placeholder={label}
                  onChange={handleProperty}
                />
              );
            })}
            <PropertyAdd onClick={handleProperty}>Add</PropertyAdd>
          </PropertyForm>
          <PropertyList>
            {properties && properties.length > 0 ? (
              properties.map(([name, value]) => (
                <Property key={name}>
                  <PropertyInfo>
                    <PropertyName>{name}</PropertyName>
                    <PropertyValues>
                      <PropertyValue $select onClick={handleCopy}>
                        {value}
                      </PropertyValue>
                      <PropertyTooltip>
                        <div />
                        <span>Click to copy</span>
                      </PropertyTooltip>
                    </PropertyValues>
                  </PropertyInfo>
                  <PropertyAction aria-label={name} onClick={handleProperty}>
                    Remove
                  </PropertyAction>
                </Property>
              ))
            ) : (
              <Warning>{schema.placeholder}</Warning>
            )}
          </PropertyList>
        </Fragment>
      )}
      <Copied $hasCopied={copied}>Copied to clipboard</Copied>
    </Fragment>
  );
};

export default memo(EnvironmentForm);
