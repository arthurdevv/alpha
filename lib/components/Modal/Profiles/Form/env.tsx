import { Fragment, memo, useRef, useState } from 'preact/compat';
import { useTranslation } from 'react-i18next';

import { clipboard } from '@electron/remote';

import { EyeClosedIcon, EyeIcon } from 'components/Icons';
import { FormOption } from '.';
import {
  Copied,
  Property,
  PropertyAction,
  PropertyAdd,
  PropertyButton,
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

const EnvironmentForm: React.FC<EnvironmentFormProps> = (
  props: EnvironmentFormProps,
) => {
  const { schema, profile, properties } = props;

  const property = useRef<Record<string, string>>({});

  const [copied, setCopied] = useState<boolean>(false);

  const [valueHidden, setValueHidden] = useState<boolean>(false);

  const { t } = useTranslation();

  const handleProperty = ({ currentTarget }) => {
    const {
      tagName,
      value,
      ariaLabel,
      dataset: { key },
    } = currentTarget;

    if (tagName === 'INPUT') {
      property.current[key.toLowerCase()] = value;
    } else {
      const target = profile.options[schema.key];

      if (tagName === 'SPAN') {
        delete target[ariaLabel];
      } else {
        const { name, value } = property.current;

        if (name && value) {
          target[name] = { value, hidden: Boolean(target.hidden) };
        }
      }

      props.setProfile({ ...profile });
    }
  };

  const handleVisibility = ({ currentTarget }) => {
    const { name } = currentTarget.dataset;

    const target = profile.options[schema.key][name];

    target.hidden = !target.hidden;

    const value = currentTarget.parentElement.querySelector('span');

    value.innerText = !target.hidden ? target.value : '•••••••••••••••';

    setValueHidden(!valueHidden);

    props.handleSave(false);
  };

  const handleCopy = ({ currentTarget }) => {
    const { name } = currentTarget.dataset;

    const { value } = profile.options[schema.key][name];

    clipboard.writeText(value);

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
                  title={t(label || '')}
                  placeholder={t(label || '')}
                  data-key={label}
                  onChange={handleProperty}
                />
              );
            })}
            <PropertyAdd onClick={handleProperty} data-key={'add'}>
              {t('Add')}
            </PropertyAdd>
          </PropertyForm>
          <PropertyList>
            {properties && properties.length > 0 ? (
              properties.map(([name, { value, hidden }]) => (
                <Property key={name}>
                  <PropertyInfo>
                    <PropertyName>{name}</PropertyName>
                    <PropertyValues>
                      <PropertyValue
                        $select
                        data-name={name}
                        onClick={handleCopy}
                      >
                        {hidden ? '•••••••••••••••' : value}
                      </PropertyValue>
                      <PropertyButton
                        data-name={name}
                        onClick={event => handleVisibility(event)}
                      >
                        {hidden ? <EyeClosedIcon /> : <EyeIcon />}
                      </PropertyButton>
                      <PropertyTooltip>
                        <div />
                        <span>Click to copy</span>
                      </PropertyTooltip>
                    </PropertyValues>
                  </PropertyInfo>
                  <PropertyAction aria-label={name} onClick={handleProperty}>
                    {t('Remove')}
                  </PropertyAction>
                </Property>
              ))
            ) : (
              <Warning>{t(schema.placeholder)}</Warning>
            )}
          </PropertyList>
        </Fragment>
      )}
      <Copied $hasCopied={copied}>{t('Copied to clipboard')}</Copied>
    </Fragment>
  );
};

export default memo(EnvironmentForm);
