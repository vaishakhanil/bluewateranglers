import { Input, Labels } from '../../atoms'
import PropTypes from 'prop-types'

export const FormField = ({
  invalid = undefined,
  label = 'default',
  type = 'text',
  name = '',
  value = '',
  onChange = () => {}
}) => {
  return (
    <div>
      <Labels htmlFor={name} invalid={invalid}>
        {label}
      </Labels>
      <Input id={name} name={name} value={value} type={type} onChange={onChange} />
    </div>
  )
}

FormField.propTypes = {
  invalid: PropTypes.bool,
  label: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  onChange: PropTypes.func
}
