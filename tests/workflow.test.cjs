const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const html = fs.readFileSync(path.join(__dirname, '../prototype/index.html'), 'utf8');
const source = html.match(/<script>([\s\S]*?)<\/script>/)[1];

// This harness isolates workflow logic. It does not emulate a browser DOM.
function harness() {
  const nodes = new Map();
  const storage = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      value: '', textContent: '', innerHTML: '', dataset: {},
      classList: { toggle() {} }, setAttribute() {},
      showModal() { this.open = true; }, close() { this.open = false; }, click() {}
    });
    return nodes.get(id);
  };
  const context = {
    document: { querySelector: node, querySelectorAll: () => [], createElement: () => node('anchor') },
    localStorage: { getItem: k => storage.get(k) || null, setItem: (k, v) => storage.set(k, v) },
    setTimeout: () => 0, clearTimeout() {},
    URL: { createObjectURL: () => '', revokeObjectURL() {} }, Blob, Date
  };
  vm.createContext(context);
  vm.runInContext(source, context);
  return code => vm.runInContext(code, context);
}

test('the embedded JavaScript parses and initializes fictional state', () => {
  const run = harness();
  assert.equal(run('state.tasks.length'), 3);
  assert.equal(run('state.tasks[0].status'), 'HOLD');
});

test('permission PASS requires a decision, reason and all three checks', () => {
  const run = harness();
  run("$('#decision').value='PASS';$('#reason').value='';recordDecision()");
  assert.equal(run('state.decisions.length'), 0);
  run("$('#reason').value='Checked';recordDecision()");
  assert.equal(run('state.tasks[0].status'), 'HOLD');
  run('state.permissions=[true,true,true];recordDecision()');
  assert.equal(run('state.tasks[0].status'), 'PASS');
});

test('deliverable acceptance requires a submission and permission PASS', () => {
  const run = harness();
  run("selected='intro';$('#decision').value='PASS';$('#reason').value='Accepted';recordDecision()");
  assert.equal(run('state.tasks[1].status'), 'OPEN');
  run('state.tasks[1].submitted=true;recordDecision()');
  assert.equal(run('state.tasks[1].status'), 'OPEN');
  run("state.tasks[0].status='PASS';recordDecision()");
  assert.equal(run('state.tasks[1].status'), 'PASS');
});

test('athlete submission requires understanding and permits only coordinator acceptance', () => {
  const run = harness();
  run("role='athlete';state.tasks[0].status='PASS';showTask('intro');$('#draft').value='Fictional introduction';$('#submit-draft').onclick()");
  assert.equal(run('state.tasks[1].submitted'), false);
  run("state.understood=true;$('#submit-draft').onclick()");
  assert.equal(run('state.tasks[1].submitted'), true);
  run("$('#decision').value='PASS';$('#reason').value='Accepted';recordDecision()");
  assert.equal(run('state.tasks[1].status'), 'OPEN');
  run("role='coordinator';recordDecision()");
  assert.equal(run('state.tasks[1].status'), 'PASS');
});

test('permission HOLD invalidates accepted dependent contributions and preserves history', () => {
  const run = harness();
  run("state.tasks[0].status='PASS';state.tasks[1].status='PASS';$('#decision').value='HOLD';$('#reason').value='Recheck authority';recordDecision()");
  assert.equal(run('state.tasks[1].status'), 'HOLD');
  assert.equal(run('state.decisions.length'), 2);
  assert.equal(run('state.decisions[1].reviewer'), 'Demo dependency check');
});

test('expert guidance stays separate from assignment approval and escapes user text', () => {
  const run = harness();
  run("role='athlete';requestGuidance();$('#question').value='';$('#send-request').onclick()");
  assert.equal(run('state.guidance.length'), 0);
  run("$('#question').value='<script>fictional question</script>';$('#topic').value='Brand fit';$('#send-request').onclick()");
  assert.equal(run('state.guidance.length'), 1);
  assert.equal(run("deliver().includes('<script>fictional question</script>')"), false);
  run("role='expert';const answerButton=document.querySelector('answer-button');answerButton.dataset.answer=String(state.guidance[0].id);document.querySelectorAll=s=>s==='[data-answer]'?[answerButton]:[];expertRequests();$('#answer-'+state.guidance[0].id).value='Fictional example';answerButton.onclick()");
  assert.equal(run('state.guidance[0].answer'), 'Fictional example');
  assert.equal(run('state.tasks[0].status'), 'HOLD');
});

test('feedback validation, state serialization and confirmed reset work', () => {
  const run = harness();
  run("$('#feedback').onclick();$('#useful').value='';$('#missing').value='';$('#save-feedback').onclick()");
  assert.equal(run('state.feedback.length'), 0);
  run("$('#missing').value='Clearer next action';$('#save-feedback').onclick();state.venture='Fictional service';save()");
  assert.equal(run('state.feedback.length'), 1);
  assert.equal(run('JSON.parse(localStorage.getItem(KEY)).venture'), 'Fictional service');
  run("$('#reset').onclick();$('#confirm-reset').onclick()");
  assert.equal(run('state.feedback.length'), 0);
  assert.equal(run('state.tasks[0].status'), 'HOLD');
});
