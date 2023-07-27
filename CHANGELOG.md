## Unreleased

### Features

- implement a structure for generating logs <code>[8e2b1bb](https://github.com/norviah/bump/commit/8e2b1bb2796f436e8c6fff14f2f03a650ba8a464)</code>

- implement an option to specify a root directory when running a shell script <code>[a175aa7](https://github.com/norviah/bump/commit/a175aa708fcd3e99cee05df790b877073ee23982)</code>

- implement a subcommand for generating changelogs <code>[fee72fb](https://github.com/norviah/bump/commit/fee72fb50dc02ff40c7465370bcae95880ee6f21)</code>

- implement utility methods to commands for printing logs <code>[31dd863](https://github.com/norviah/bump/commit/31dd86364177b217d43e739cf3b05267a82c4472)</code>

- implement a custom base command <code>[f490c8f](https://github.com/norviah/bump/commit/f490c8f81b6507bb70e07b25eab355ef1dbac8d8)</code>

- implement a schema to represent links <code>[09fc40b](https://github.com/norviah/bump/commit/09fc40ba6ac388616b7a63b2cd25af5486b10dd3)</code>

- implement a custom error class <code>[2cb603e](https://github.com/norviah/bump/commit/2cb603ea9f9f490b9e4b9f1ee74c2feec11e22bf)</code>

- define schemas for the configuration object <code>[d137f88](https://github.com/norviah/bump/commit/d137f884086f15a0c5adeeb4ace1207bff5ab4b4)</code>

- **`Command`**: implement a utility method for asking the user for input <code>[95b1dbb](https://github.com/norviah/bump/commit/95b1dbb11659497c87be8b17db1156033d0b2737)</code>

- **deps**: add the dependency `execa` for running shell commands <code>[10948b7](https://github.com/norviah/bump/commit/10948b7c7ca63244fff8a528d1d9f44ca8fde9e6)</code>

- **deps**: add the dependency `simple-git` for working with git <code>[37ed211](https://github.com/norviah/bump/commit/37ed211f5d3aa5e51fd285188b2ede5543526c60)</code>

### Refactor

- move the validation logic for saving changelogs into the  structure <code>[0ebf261](https://github.com/norviah/bump/commit/0ebf26188bb8688341c3686a9435293389783e24)</code>

- implement a class to provide methods for reading from files <code>[48b68fd](https://github.com/norviah/bump/commit/48b68fdd452fc7b32442fd9c06cc5a7e8d72cbc6)</code>

- **`Command`**: move the logic for importing the config file to `InitializeContext` <code>[4c6decb](https://github.com/norviah/bump/commit/4c6decb6ccd15fce36e2b38ac6cc826348f522f3)</code>

### Bug Fixes

- correctly infer the message from a script error <code>[0ebca62](https://github.com/norviah/bump/commit/0ebca62577770709ff3b14a47a0f21fff8e56dd8)</code>

### Init

- implement oclif template <code>[52408a6](https://github.com/norviah/bump/commit/52408a665516a9d3901c33db7d2be50aedbadf2d)</code>

- initial commit <code>[b61d1d0](https://github.com/norviah/bump/commit/b61d1d0c41d6e24973b40755dffa25f823a2fa65)</code>
