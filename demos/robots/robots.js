'use strict';

goog.require('Blockly.JavaScript');
goog.require('Blockly.Python');
goog.require('Blockly.Blocks');

/********************************************************
 *              generate the blocks
 */

Blockly.Blocks.colour.HUE = 0;

Blockly.Blocks['servo_position'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(0);
    this.appendDummyInput()
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField("Servo")
        .appendField(new Blockly.FieldAngle("100"), "angle");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['wait_for_milliseconds'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(0);
    this.appendDummyInput()
        .appendField("Wait for");
    this.appendValueInput("milliseconds")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField("milliseconds");
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

/********************************************************
 *              generate the code
 * 
 * Javascript
 */

 Blockly.JavaScript['servo_position'] = function(block) {
  var servo_angle = block.getFieldValue('angle');
  var code = 'set_servo_position(' + servo_angle + ')';
  return code;
};

Blockly.JavaScript['wait_for_milliseconds'] = function(block) {
  var servo_angle = block.getFieldValue('angle');
  var code = '';
  return code;
};

/**
 * Python
 */

 Blockly.Python['servo_position'] = function(block) {
  var servo_angle = block.getFieldValue('angle');
  var code = 'set_servo_position(' + servo_angle + ')';
  return code;
};

Blockly.Python['wait_for_milliseconds'] = function(block) {
  var value_milliseconds = Blockly.Python.valueToCode(block, 'milliseconds', Blockly.Python.ORDER_ATOMIC);
  var code = 'time.sleep(' + value_milliseconds + '/1000.)';
  return code;
};

/********************************************************
 *              move the robot
 */

var servo_position_call = 0;

var servo_call_element = null;

function set_servo_position(degrees) {
  var position = Math.round(degrees);
  var url = get_server_url() + '/servo_position/' + position;// + '?call=' + servo_position_call;
  servo_position_call += 1;
  if (servo_call_element == null) {
    servo_call_element = document.createElement('iframe');
    servo_call_element.setAttribute('id', 'servo_call_element');
    document.body.appendChild(servo_call_element);
  }
  servo_call_element.src = url;
}

/********************************************************
 *              get the configuration
 */

function getQueryParams(qs) {
    // from http://stackoverflow.com/a/1099670/1320237
    qs = qs.split("+").join(" ");

    var params = {}, tokens,
        re = /[?&]?([^=]+)=([^&]*)/g;

    while (tokens = re.exec(qs)) {
        params[decodeURIComponent(tokens[1])]
            = decodeURIComponent(tokens[2]);
    }

    return params;
}

function get_server_url() {
  var params = getQueryParams(document.location.search);
  return 'http://' + params.server
}

