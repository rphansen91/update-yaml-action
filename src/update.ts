import jp from 'jsonpath'
import { parse, stringify } from 'yaml'
import { AxiosOctokit } from './octokit'

export interface ActionOptions {
    repo: string
    ref: string
    msg: string
    valueFile: string
    propertyPath: string
    value: string
    token: string
}

export function updateYaml(
  content: string,
  propertyPath: string,
  value: string
) {
  const data = parse(content);

  jp.value(data, propertyPath, value);

  return stringify(data);
}

export async function updateYamlAction(action: ActionOptions) {
  const octo = new AxiosOctokit({
    token: action.token,
    repo: action.repo,
  });

  const content = await octo.loadContents(action.valueFile, action.ref);

  const updated = updateYaml(content, action.propertyPath, action.value);

  const { url, ref } = await octo.uploadToRepo(
    action.valueFile,
    updated,
    action.msg,
    action.ref
  );

  return { url, ref };
}
