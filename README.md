# Update YAML Action

This action updates yaml values in other repos

## Inputs

## `repo`
**Required** The location of the repo

## `ref`
**Required** The branch to commit changes

## `msg`
**Required** The commit message to add with commit

## `valueFile`
**Required** The path to file under change

## `propertyPath`
**Required** The json

## `value`
**Required** 

## `token`
The gihub personal access token used to write commit

## Outputs

## `ref`

The new head commit ref.

## Example usage

```yaml
uses: actions/update-yaml-action@v1.0
with:
  repo: xylabs/coin-k8s-services
  ref: main
  msg: "Update Image Version to ${{ github.sha }}"
  valueFile: "coin/values.yaml"
  propertyPath: "$.deployments[?(@.name=='api-coin-manager-apollo')].image.tag"
  value: ${{ github.sha }}
  token: ${{ secrets.K8S_HELM_TOKEN }}
```