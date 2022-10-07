import { updateYaml } from './update'

const test = `deployments:
- name: api-coin-manager-apollo
  image:
    repository: "gcr.io/xyo-network-1522800011804/api-coin-manager-apollo"
    tag: "a47c269411afdaa935ec5e7948591c979a192b69"
  env:
    - name: BASE
      value: "/manager"`

describe('Update YAML', () => {
  it.each([
    [test, "$.deployments[?(@.name=='api-coin-manager-apollo')].image.tag", '123']
  ])('Should set nested array field', (a, b, c) => {
    expect(updateYaml(a, b, c)).toMatchSnapshot()
  })
})