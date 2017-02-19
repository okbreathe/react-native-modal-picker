import React, { PropTypes } from 'react'
import {
  View,
  StyleSheet,
  Dimensions,
  Modal,
  Text,
  ScrollView,
  TouchableOpacity,
  Platform
} from 'react-native'

import styles from './style'

let componentIndex = 0

export default class ModalPicker extends React.Component {
  state = {
    animationType: 'slide',
    modalVisible: false,
    transparent: false,
    selectedObject: {},
  }

  componentDidMount() {
    this.setState({
      selectedText: this.props.placeholder,
      cancelText: this.props.cancelText
    })
  }

  componentWillReceiveProps(nextProps) {
    const state = { modalVisible: nextProps.open }

    if (nextProps.placeholder != this.props.placeholder) state.selectedText = nextProps.placeholder

    if (this.dataChanged(nextProps.data) || this.selectedValueChanged(nextProps.selectedValue)) {
      const item = this.getSelectedItem(nextProps.selectedValue)
      if (item) {
        state.selectedText = item.label
        state.selectedObject = item
      }
    }

    this.setState(state)
  }

  componentWillUpdate(nextProps, nextState){
    if (nextState.modalVisible != this.state.modalVisible && nextState.modalVisible === false) {
      this.onClose(nextState.selectedObject)
    }
  }

  onChange = (item) => {
    this.props.onChange(item)
    this.setState({ selectedText: item.label, selectedObject: item })
    this.close()
  }

  onClose = (item) => this.props.onClose(item)

  close = () => this.setState({ modalVisible: false })

  open = () => this.setState({ modalVisible: true })

  getSelectedItem = (key) => this.props.data.find(d => d.key == key)

  dataChanged = (data) => data && data.length && data != this.props.data

  selectedValueChanged = (value) => value && value != this.props.selectedValue

  renderSection(section) {
    return (
      <View key={section.key} style={[styles.sectionStyle, this.props.sectionStyle]}>
        <Text style={[styles.sectionTextStyle, this.props.sectionTextStyle]}>{section.label}</Text>
      </View>
    )
  }

  renderOption(option) {
    return (
      <TouchableOpacity key={option.key} onPress={()=>this.onChange(option)}>
        <View style={[styles.optionStyle, this.props.optionStyle]}>
          <Text style={[styles.optionTextStyle,this.props.optionTextStyle]}>{option.label}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderOptionList() {
    const options = this.props.data.map((item) => {
      return item.section
        ? this.renderSection(item)
        : this.renderOption(item)
    })

    return (
      <View style={[styles.overlayStyle, this.props.overlayStyle]} key={'modalPicker'+(componentIndex++)}>
        <View style={[styles.optionContainer, this.props.optionContainerStyle]}>
          <ScrollView keyboardShouldPersistTaps="always">
            <View style={{paddingHorizontal:10}}>
              {options}
            </View>
          </ScrollView>
        </View>
        <View style={styles.cancelContainer}>
          <TouchableOpacity onPress={this.close}>
            <View style={[styles.cancelStyle, this.props.cancelStyle]}>
              <Text style={[styles.cancelTextStyle,this.props.cancelTextStyle]}>{this.props.cancelText}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  renderChildren = () => {
    if (this.props.children) {
      return this.props.children
    }
    return (
      <View style={[styles.selectStyle, this.props.selectStyle, this.props.disabled ? this.props.disabledStyle : {}]}>
        <Text style={[styles.selectTextStyle, this.props.selectTextStyle]}>{this.state.selectedText}</Text>
      </View>
    )
  }

  render() {
    const dp = (
      <Modal transparent={true} ref="modal" visible={this.state.modalVisible} onRequestClose={this.close} animationType={this.state.animationType}>
        {this.renderOptionList()}
      </Modal>
    )

    return (
      <View style={this.props.style}>
        {dp}
        <TouchableOpacity onPress={this.open} disabled={this.props.disabled}>
          {this.renderChildren()}
        </TouchableOpacity>
      </View>
    )
  }
}

ModalPicker.propTypes = {
  data:                 PropTypes.array,
  open:                 PropTypes.bool,
  onChange:             PropTypes.func,
  onClose:              PropTypes.func,
  placeholder:          PropTypes.string,
  style:                View.propTypes.style,
  selectStyle:          View.propTypes.style,
  optionStyle:          View.propTypes.style,
  optionTextStyle:      Text.propTypes.style,
  sectionStyle:         View.propTypes.style,
  sectionTextStyle:     Text.propTypes.style,
  cancelStyle:          View.propTypes.style,
  cancelTextStyle:      Text.propTypes.style,
  overlayStyle:         View.propTypes.style,
  optionContainerStyle: View.propTypes.style,
  cancelText:           PropTypes.string,
  disabledStyle:        View.propTypes.style,
  disabled:             PropTypes.bool
}
ModalPicker.defaultProps = {
  data:                 [],
  open:                 false,
  onChange:             () => {},
  onClose:              () => {},
  placeholder:          'Please Select',
  style:                {},
  selectStyle:          {},
  optionStyle:          {},
  optionTextStyle:      {},
  sectionStyle:         {},
  sectionTextStyle:     {},
  cancelStyle:          {},
  cancelTextStyle:      {},
  overlayStyle:         {},
  optionContainerStyle: {},
  disabledStyle:        {},
  selectedValue:        null,
  cancelText:           'Cancel',
  disabled:             false
}
