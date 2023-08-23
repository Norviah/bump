## [v1.2.0](https://github.com/norviah/bump/compare/v1.1.1...v1.2.0) (2023-08-23)

### Features

- implement the `phase` command to execute a specific phase <code>[08d78f7](https://github.com/norviah/bump/commit/08d78f71b5f2f147f8068eab33b967981acc96d2)</code>

	With this new command, the tool can execute scripts within the specified
	phase without bumping the project's version.

## [v1.1.1](https://github.com/norviah/bump/compare/v1.1.0...v1.1.1) (2023-08-07)

### Bug Fixes

- **`Changelog`**: trim the result when accessing the repo's url <code>[c145b71](https://github.com/norviah/bump/commit/c145b7131ab0bf8ad6b3be2075419632bb56ee30)</code>

## [v1.1.0](https://github.com/norviah/bump/compare/v1.0.0...v1.1.0) (2023-08-06)

### Refactor

- **`Changelog`**: remove extra padding when including the body for commits <code>[51bddc6](https://github.com/norviah/bump/commit/51bddc64fd6920a04a5ffbf91853ce0892954d82)</code>

### Features

- **config**: add a `noSpinner` option to disable the spinner when running commands <code>[e825162](https://github.com/norviah/bump/commit/e8251625b439e25754da3a3a381c217bb2da3c01)</code>

	The issue with spinners is that they refresh the terminal for each
	frame, causes problems for scripts that require input from the user as
	the prompt for the input is erased.
	
	The `noSpinner` option allows the user to disable a spinner for a
	specific script, which will prevent the screen from being refreshed.

## v1.0.0 (2023-08-02)

### Refactor

- ensure the user is in a git repository <code>[b3728c9](https://github.com/norviah/bump/commit/b3728c9ce85f1ffcf884d8796b667e20a20d89f9)</code>

- move the validation logic for saving changelogs into the  structure <code>[0ebf261](https://github.com/norviah/bump/commit/0ebf26188bb8688341c3686a9435293389783e24)</code>

- implement a class to provide methods for reading from files <code>[48b68fd](https://github.com/norviah/bump/commit/48b68fdd452fc7b32442fd9c06cc5a7e8d72cbc6)</code>

- **`command/init`**: refactor the template for the configuration file to a JSON object <code>[191e0e9](https://github.com/norviah/bump/commit/191e0e914f8afb100a578e8046751e839452fc77)</code>

- **`Command`**: refactor the logic for initializing a command's context to a method that only imports the config file <code>[9cec404](https://github.com/norviah/bump/commit/9cec404c95ee83320fbfd52f8adb87c36de5a787)</code>

- **`Command`**: trim the error's message when catching and displaying a runtime error <code>[7861bae](https://github.com/norviah/bump/commit/7861baea2cc2c022ad269b4873652cd132df1428)</code>

- **`Command`**: move the logic for importing the config file to `InitializeContext` <code>[4c6decb](https://github.com/norviah/bump/commit/4c6decb6ccd15fce36e2b38ac6cc826348f522f3)</code>

### Bug Fixes

- correctly infer the message from a script error <code>[0ebca62](https://github.com/norviah/bump/commit/0ebca62577770709ff3b14a47a0f21fff8e56dd8)</code>

- **`Changelog`**: change the split character for `simple-git` as the default one may appear in string results <code>[2ea5421](https://github.com/norviah/bump/commit/2ea5421b886769ecc3253247c91d026ce0fbdbd6)</code>

### Features

- implement a command to create a configuration file <code>[2888c5d](https://github.com/norviah/bump/commit/2888c5d00a426ed0238f7c57fa705b8c78c8d810)</code>

- implement a command to release a new project version <code>[3f924c4](https://github.com/norviah/bump/commit/3f924c42e7167ea02e490315b28619b49127da80)</code>

- implement a structure for generating logs <code>[8e2b1bb](https://github.com/norviah/bump/commit/8e2b1bb2796f436e8c6fff14f2f03a650ba8a464)</code>

- implement an option to specify a root directory when running a shell script <code>[a175aa7](https://github.com/norviah/bump/commit/a175aa708fcd3e99cee05df790b877073ee23982)</code>

- implement a subcommand for generating changelogs <code>[fee72fb](https://github.com/norviah/bump/commit/fee72fb50dc02ff40c7465370bcae95880ee6f21)</code>

- implement utility methods to commands for printing logs <code>[31dd863](https://github.com/norviah/bump/commit/31dd86364177b217d43e739cf3b05267a82c4472)</code>

- implement a custom base command <code>[f490c8f](https://github.com/norviah/bump/commit/f490c8f81b6507bb70e07b25eab355ef1dbac8d8)</code>

- implement a schema to represent links <code>[09fc40b](https://github.com/norviah/bump/commit/09fc40ba6ac388616b7a63b2cd25af5486b10dd3)</code>

- implement a custom error class <code>[2cb603e](https://github.com/norviah/bump/commit/2cb603ea9f9f490b9e4b9f1ee74c2feec11e22bf)</code>

- define schemas for the configuration object <code>[d137f88](https://github.com/norviah/bump/commit/d137f884086f15a0c5adeeb4ace1207bff5ab4b4)</code>

- **`Changelog`**: don't print commits representing merges <code>[7650b1f](https://github.com/norviah/bump/commit/7650b1fb728fec7dae4d6d7d106c063fae7bc977)</code>

- **`Changelog`**: additionally print commits that introduce breaking changes into their own section <code>[b0840d7](https://github.com/norviah/bump/commit/b0840d71522c26ef92cf97712bacede596f1d3e6)</code>

- **`Command`**: implement a utility method for asking the user for input <code>[95b1dbb](https://github.com/norviah/bump/commit/95b1dbb11659497c87be8b17db1156033d0b2737)</code>

- **`structs/Changelog`**: include the release's body if available <code>[97edfb7](https://github.com/norviah/bump/commit/97edfb770565fbed056e2a03857fc6e47af38a65)</code>

- **deps**: add the dependency `execa` for running shell commands <code>[10948b7](https://github.com/norviah/bump/commit/10948b7c7ca63244fff8a528d1d9f44ca8fde9e6)</code>

- **deps**: add the dependency `simple-git` for working with git <code>[37ed211](https://github.com/norviah/bump/commit/37ed211f5d3aa5e51fd285188b2ede5543526c60)</code>

- **types**: implement a type to infer arguments and flags of a command <code>[8218176](https://github.com/norviah/bump/commit/82181766670379f35458f800a55279115d17de09)</code>

### Init

- implement oclif template <code>[52408a6](https://github.com/norviah/bump/commit/52408a665516a9d3901c33db7d2be50aedbadf2d)</code>

- initial commit <code>[b61d1d0](https://github.com/norviah/bump/commit/b61d1d0c41d6e24973b40755dffa25f823a2fa65)</code>