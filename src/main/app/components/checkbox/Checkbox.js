import classNames from 'classnames';
import {bool, element, func, oneOfType, string} from 'prop-types';
import React, {Component} from 'react';
import './checkbox.scss';

export class Checkbox extends Component {
  static propTypes = {
    label: oneOfType([string, element]),
    checked: bool,
    onChange: func,
    className: string,
    disabled: bool,
    asRadio: bool
  };

  static defaultProps = {
    label: '',
    asRadio: false,
    checked: false,
    onChange: () => {
    },
    className: ''
  };

  handleCheck = () => {
    const {onChange, checked} = this.props;
    onChange(!checked);
  };

  render() {
    const {
      label,
      checked,
      className,
      disabled,
      asRadio
    } = this.props;

    return (
      <label className={classNames('core__checkbox', {'core__checkbox--disabled': disabled, 'core__checkbox--as-radio': asRadio}, className)}>
        <input type="checkbox"
               disabled={disabled}
               checked={checked}
               onChange={this.handleCheck}
        />
        <div className="check"/>
        {
          label &&
          <span className="label-text">
            {label}
          </span>
        }
      </label>
    );
  }
}
