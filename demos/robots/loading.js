
function javascript_function_loaded(name, weight) {
  var loaded = {};
  loaded.names = name.split('.');
  loaded.is_loaded = function() { 
    var root = window;
    for (var i = 0; i < loaded.names.length; i++) {
      root = root[loaded.names[i]];
      if (root == undefined) {
        return false;
      }
    }
    return true;
  }
  if (weight == undefined) {
    loaded.weight = 1;
  } else {
    loaded.weigth = weight;
  }
  return loaded;
};

var items_to_load = [
  javascript_function_loaded('stop_execution'),
  javascript_function_loaded('load_from_parameters'),
  javascript_function_loaded('stepCode'),
  javascript_function_loaded('Interpreter'),
  javascript_function_loaded('Blob'),
  javascript_function_loaded('saveAs'),
  javascript_function_loaded('Blockly.XML', 5),
  javascript_function_loaded('Blockly.Blocks'),
  javascript_function_loaded('Blockly.JavaScript'),
  javascript_function_loaded('Blockly.Python')
  ];
  
function check_loading_loop() {
  if (progress_bar_closed) {
    return;
  }
  setTimeout(check_loading, 1000);
  
}

function check_loading() {
  var sum = 0;
  var progress = 0;
  for (var i = 0; i < items_to_load.length; i++) {
    var item = items_to_load[i];
    sum += item.weight;
    if (item.is_loaded()) {
      progress += item.weight;
    }
  }
  set_progress_bar(progress / sum);
}

check_loading_loop();

var progress_bar = undefined;

function open_progress_bar() {
  if (progress_bar != undefined) {
    close_progress_bar();
  }
  progress_bar = document.createElement('div');
  progress_bar.style.width = '100%';
  progress_bar.style.height = '10px';
  progress_bar.style.position = 'fixed';
  progress_bar.style.top = '0em';
  progress_bar.style.border = '1px';
  progress_bar.style["background-color"] = "red";
  progress_bar.style.borderColor = 'black';
  progress_bar.progress_div = document.createElement('div');
  progress_bar.progress_div.style.width = '0%';
  progress_bar.progress_div.style.height = '100%';
  progress_bar.progress_div.style["background-color"] = 'green';
  progress_bar.appendChild(progress_bar.progress_div);
  document.body.appendChild(progress_bar);
}

function set_progress_bar(value) {
  if (progress_bar == undefined) {
    open_progress_bar();
  }
  progress_bar.progress_div.style.width = Math.round(value * 100) + "%";
}

function close_progress_bar() {
  progress_bar_closed = true;
}
  
window.addEventListener('load', close_progress_bar);
