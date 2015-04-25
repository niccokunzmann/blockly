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
        .appendField(MSG['rotateServoToDegreesLeft'])
        .appendField(new Blockly.FieldAngle("100"), "angle");
    this.appendDummyInput()
        .appendField(MSG['rotateServoToDegreesRight']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['servo_position_number'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(0);
    this.appendDummyInput()
        .appendField(MSG['rotateServoLeft']);
    this.appendValueInput("angle")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT);
    this.appendDummyInput()
        .appendField(MSG['rotateServoRight']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['servo_velocity'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(0);
    this.appendDummyInput()
        .appendField(MSG["setRobotVelocityLeft"])
        .appendField(new Blockly.FieldDropdown([
          [MSG["robotVelocityVeryFast"], "1"], 
          [MSG["robotVelocityFast"], "2"], 
          [MSG["robotVelocityMediumFast"], "3"], 
          [MSG["robotVelocityMiddle"], "4"], 
          [MSG["robotVelocityMediumSlow"], "5"], 
          [MSG["robotVelocitySlow"], "6"], 
          [MSG["robotVelocityVerySlow"], "7"]]), "velocity")
        .appendField(MSG["setRobotVelocityRight"]);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

Blockly.Blocks['print'] = {
  init: function() {
    this.setHelpUrl('http://www.example.com/');
    this.setColour(0);
    this.appendValueInput("output_value")
        .setAlign(Blockly.ALIGN_CENTRE)
        .appendField(MSG['outputLeft']);
    this.appendDummyInput()
        .appendField(MSG['outputRight']);
    this.setInputsInline(true);
    this.setPreviousStatement(true, "null");
    this.setNextStatement(true, "null");
    this.setTooltip('');
  }
};

/********************************************************
 *              generate the code
 * 
 * JavaScript
 */

 Blockly.JavaScript['servo_position'] = function(block) {
  var servo_angle = block.getFieldValue('angle');
  var code = 'set_servo_position(' + servo_angle + ');\n';
  return code;
};

Blockly.JavaScript['servo_position_number'] = function(block) {
  var servo_angle = Blockly.JavaScript.valueToCode(block, 'angle', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'set_servo_position(' + servo_angle + ');\n';
  return code;
};

Blockly.JavaScript['servo_velocity'] = function(block) {
  var servo_velocity = block.getFieldValue('velocity');
  var code = 'set_servo_velocity(' + servo_velocity + ');\n';
  return code;
};

Blockly.JavaScript['print'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'output_value', Blockly.JavaScript.ORDER_ATOMIC);
  var code = 'append_output(' + value_name + ');\n';
  return code;
};

/**
 * JavaScript Interpreter
 */
 
function initInterpreterApi(interpreter, scope) {
  // Add an API function for the set_servo_position .
  var wrapper = function(angle) {
    return interpreter.createPrimitive(set_servo_position(angle));
  };
  interpreter.setProperty(scope, 'set_servo_position',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the set_servo_velocity .
  var wrapper = function(velocity) {
    return interpreter.createPrimitive(set_servo_velocity(velocity));
  };
  interpreter.setProperty(scope, 'set_servo_velocity',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for the append_output() block.
  var wrapper = function(text) {
    text = text ? text.toString() : '';
    return interpreter.createPrimitive(append_output(text));
  };
  interpreter.setProperty(scope, 'append_output',
      interpreter.createNativeFunction(wrapper));

  // Add an API function for highlighting blocks.
  var wrapper = function(id) {
    id = id ? id.toString() : '';
    return interpreter.createPrimitive(highlightBlock(id));
  };
  interpreter.setProperty(scope, 'highlightBlock',
      interpreter.createNativeFunction(wrapper));
}

/**
 * Python
 */

 Blockly.Python['servo_position'] = function(block) {
  var servo_angle = block.getFieldValue('angle');
  var code = 'set_servo_position(' + servo_angle + ')\n';
  return code;
};

Blockly.Python['servo_position_number'] = function(block) {
  var servo_angle = Blockly.Python.valueToCode(block, 'angle', Blockly.Python.ORDER_ATOMIC);
  var code = 'set_servo_position(' + servo_angle + ')\n';
  return code;
};

Blockly.Python['servo_velocity'] = function(block) {
  var servo_velocity = block.getFieldValue('velocity');
  var code = 'set_servo_velocity(' + servo_velocity + ')\n';
  return code;
};

Blockly.Python['print'] = function(block) {
  var value_name = Blockly.Python.valueToCode(block, 'output_value', Blockly.Python.ORDER_ATOMIC);
  var code = 'print(' + value_name + ')\n';
  return code;
};

/********************************************************
 *              move the robot
 */

function set_servo_position(degrees) {
  var position = Math.round(degrees);
  var path = '/servo_position/' + position;
  call_server(path);
}

function set_servo_velocity(velocity) {
  var position = Math.round(velocity);
  var path = '/servo_velocity/' + velocity;
  call_server(path);
}

/********************************************************
 *              server
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

function is_in_debug_mode() {
  return getQueryParams(document.location.search).debug == 'true';
}

function get_server_url() {
  var params = getQueryParams(document.location.search);
  if (params.server == null) {
    // localhost
    return ""
  }
  return 'http://' + params.server
}

var server_call_element = null;

function call_server(path) {
  var url = get_server_url() + path;
  if (server_call_element == null) {
    server_call_element = document.createElement('iframe');
    server_call_element.setAttribute('id', 'server_call_element');
    document.body.appendChild(server_call_element);
  }
  server_call_element.src = url;
}

function execute_python_code() {
  var python_code = Blockly.Python.workspaceToCode();
  // http://stackoverflow.com/a/332897
  var escaped_python_code = encodeURIComponent(python_code);
  var path = '/execute_python?code=' + escaped_python_code;
  call_server(path);
}

function update_output() {
  if (current_language == EXECUTING_LANGUAGE_PYTHON) {
    var output_frame = document.getElementById('content_output_frame');
    output_frame.src = get_server_url() + '/output';
  }
}

String.prototype.HTMLescape = function() {
  // from
  //   http://stackoverflow.com/a/5499821/1320237
  var tagsToReplace = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;'
  };
  return this.replace(/[&<>]/g, function(tag) {
    return tagsToReplace[tag] || tag;
  });
};

function append_output(output) {
  var output_element = document.getElementById('content_output');
  output_element.innerHTML += output.HTMLescape() + "\n";
}

function stop_execution() {
  call_server("/stop_execution");
}