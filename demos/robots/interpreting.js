var myInterpreter = null;

var highlightPause = false;

function highlightBlock(id) {
  Blockly.mainWorkspace.highlightBlock(id);
  highlightPause = true;
}

function parseCode() {
  // empty output field
  current_language = EXECUTING_LANGUAGE_JAVASCRIPT;
  output_element = document.getElementById('content_output');
  output_element.innerHTML = '';
  stop_execution();
  // Generate JavaScript code and parse it.
  Blockly.JavaScript.STATEMENT_PREFIX = 'highlightBlock(%1);\n';
  Blockly.JavaScript.addReservedWords('highlightBlock');
  var code = Blockly.JavaScript.workspaceToCode();
  myInterpreter = new Interpreter(code, initInterpreterApi);

  //alert('Ready to execute this code:\n\n' + code);
  show_step_button();
  highlightPause = false;
  Blockly.mainWorkspace.traceOn(true);
  Blockly.mainWorkspace.highlightBlock(null);
}

function stepCode() {
  try {
    var ok = myInterpreter.step();
  } finally {
    if (!ok) {
      // Program complete, no more code to execute.
      hide_step_button();
      return;
    }
  }
  if (highlightPause) {
    // A block has been highlighted.  Pause execution here.
    highlightPause = false;
  } else {
    // Keep executing until a highlight statement is reached.
    stepCode();
  }
}