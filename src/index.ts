import { updateYamlAction, ActionOptions } from "./update";
import { getInput, setOutput, setFailed } from "@actions/core";
import assert from "assert"

async function main() {
  const action: ActionOptions = {
    repo: getInput("repo"),
    ref: getInput("ref"),
    msg: getInput("msg"),
    valueFile: getInput("valueFile"),
    propertyPath: getInput("propertyPath"),
    value: getInput("value"),
    token: getInput("token"),
  };

  assert(action.repo, 'repo is a required field')
  assert(action.ref, 'ref is a required field')
  assert(action.msg, 'msg is a required field')
  assert(action.valueFile, 'valueFile is a required field')
  assert(action.propertyPath, 'propertyPath is a required field')
  assert(action.value, 'value is a required field')

  console.log('Updating', action)
  const { ref } = await updateYamlAction(action);
  setOutput("ref", ref);
}

main().catch((err) => {
  const error = err as Error;
  setFailed(error.message);
});
