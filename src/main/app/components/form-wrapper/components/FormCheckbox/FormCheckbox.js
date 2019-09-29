import {bool, element, func, number, object, oneOfType, string} from 'prop-types';
import React from 'react';
import isEqual from 'lodash/isEqual';
import {getValidationResultErrorMessage} from '../../../../models/ValidationResult';
import {FormErrorMessage} from '../FormErrorMessage/FormErrorMessage';
import {Checkbox} from '../../../checkbox/Checkbox';

export class FormCheckbox extends React.Component {
  static propTypes = {
    className: string,
    label: oneOfType([string, element]),
    value: oneOfType([string, object, bool, number]),
    onUpdate: func,
    onChange: func,
    validationResult: object,
    checkedValue: oneOfType([string, object, bool, number]),
    uncheckedValue: oneOfType([string, object, bool, number]),
    isRadio: bool,
    hideError: bool,
    testId: string,
    testIdPlacement: string,
    disabled: bool,
    checkboxClassName: string
  };

  static defaultProps = {
    checkedValue: true,
    uncheckedValue: false,
    isRadio: false,
    onUpdate() {

    }
  };

  handleChange = (value) => {
    const {onChange, onUpdate, checkedValue, uncheckedValue, isRadio, value: oldValue} = this.props;
    if (!isRadio) {
      onChange(value ? checkedValue : uncheckedValue);
      onUpdate(value ? checkedValue : uncheckedValue);
    } else if (value !== checkedValue || oldValue !== value) {
      onChange(checkedValue);
      onUpdate(checkedValue);
    }
  };

  render() {
    const {
      className,
      placeholder,
      value,
      validationResult,
      checkedValue,
      label,
      hideError,
      testId,
      testIdPlacement,
      isRadio,
      disabled,
      checkboxClassName
    } = this.props;
    return (
      <div className={className}>
        <Checkbox checked={isEqual(value, checkedValue)}
                  label={label}
                  className={checkboxClassName}
                  onChange={this.handleChange}
                  disabled={disabled}
                  asRadio={isRadio}
        />
        {
          !hideError &&
          <FormErrorMessage errorMessage={validationResult::getValidationResultErrorMessage()}/>
        }
      </div>
    );
  }
}
