import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { Form, Input, Button } from 'antd'

const FormItem = Form.Item

function hasErrors(fieldsError) {
  return Object.keys(fieldsError).some(field => fieldsError[field])
}

export class FormAdd extends Component {
  constructor() {
    super()

    this.handleSubmit = this.handleSubmit.bind(this)
  }

  handleSubmit(e) {
    e.preventDefault()

    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props.submitForm(values.detail)
      }
    })
  }

  render() {
    const {
      getFieldDecorator,
      getFieldsError,
      getFieldError,
      isFieldTouched
    } = this.props.form

    return (
      <Form onSubmit={this.handleSubmit}>
        <FormItem>
          {getFieldDecorator('detail', {
            rules: [{ required: true, message: 'Detail is required!' }]
          })(<Input placeholder="Detail" />)}
        </FormItem>
        <div style={{ textAlign: 'right' }}>
          <Button
            type="primary"
            htmlType="submit"
            disabled={hasErrors(getFieldsError())}
          >
            Submit
          </Button>
        </div>
      </Form>
    )
  }
}

FormAdd.propTypes = {
  form: PropTypes.object.isRequired,
  submitForm: PropTypes.func.isRequired,
  dataNote: PropTypes.string,
  dataId: PropTypes.string
}

export default Form.create({
  mapPropsToFields(props) {
    return {
      detail: Form.createFormField({ value: props.dataNote })
    }
  }
})(FormAdd)
