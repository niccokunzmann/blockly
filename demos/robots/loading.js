
function javascript_function_loaded(name, weight) {
  var loaded = {};
  loaded.name = name;
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
    loaded.weight = weight;
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
  javascript_function_loaded('Blockly.Xml', 5),
  javascript_function_loaded('Blockly.Blocks'),
  javascript_function_loaded('Blockly.JavaScript'),
  javascript_function_loaded('Blockly.Python')
  ];
  
function check_loading_loop() {
  if (!there_is_a_progress_bar()) {
    return;
  }
  setTimeout(check_loading_loop, 1000);
  check_loading();
}

function compute_progress() {
  var sum = 1;
  var progress = 1;
  for (var i = 0; i < items_to_load.length; i++) {
    var item = items_to_load[i];
    sum += item.weight;
    if (item.is_loaded()) {
      progress += item.weight;
    }
  }
  return progress / sum;
}

function check_loading() {
  var progress = compute_progress();
  set_progress_bar(progress);
}

var progress_bar = undefined;
var progress_div = undefined;
var do_not_open_progress_bar_again = false;

function add_progress_bar() {
  if (do_not_open_progress_bar_again) {
    return;
  }
  progress_bar = document.createElement('div');
  progress_bar.style.width = '100%';
  progress_bar.style.height = '10px';
  progress_bar.style.position = 'fixed';
  progress_bar.style.top = '0em';
  progress_bar.style.border = '1px';
  progress_bar.style["background-color"] = "red";
  progress_bar.style.borderColor = 'black';
  progress_div = document.createElement('div');
  progress_div.style.width = '0%';
  progress_div.style.height = '100%';
  progress_div.style["background-color"] = 'green';
  progress_bar.appendChild(progress_div);
  document.body.appendChild(progress_bar);
}

function open_progress_bar() {
  if (!there_is_a_progress_bar()) {
    add_progress_bar();
  }
  check_loading_loop();
}

function there_is_a_progress_bar() {
  return progress_bar != undefined;
}

function set_progress_bar(value) {
  if (!there_is_a_progress_bar()) {
    open_progress_bar();
  }
  progress_div.style.width = Math.round(value * 100) + "%";
}

function close_progress_bar() {
  if (there_is_a_progress_bar()) {
    document.body.removeChild(progress_bar);
    progress_bar = null;
  }
  do_not_open_progress_bar_again = true;
}

function wait_for_body() {
  if (document.body) {
    open_progress_bar();
  } else {
    setTimeout(wait_for_body, 100);
  }
}

// http://stackoverflow.com/questions/9916747/why-is-document-body-null-in-my-javascript
// does not work
// window.onload = open_progress_bar;
wait_for_body();

window.addEventListener('load', close_progress_bar);
