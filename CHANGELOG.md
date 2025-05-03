## [v1.5.1](https://github.com/Norviah/bump/compare/v1.5.0...v1.5.1) (2025-05-03)

### Bug Fixes

- update references to use new value placeholders <code>[bf0118b](https://github.com/Norviah/bump/commit/bf0118b3fe860fe3a6e7c4d7baaf483bca5bc80c)</code>

- **config**: re-reference `{{after}}` and `{{before}}` to `{{newVersion}}` and `{{oldVersion}}` <code>[34132e1](https://github.com/Norviah/bump/commit/34132e13380377a4acf4db0386d0f28a9d43b61f)</code>

- save the new version after the pre phase <code>[ae9176e](https://github.com/Norviah/bump/commit/ae9176efd57ecc0f684d884e14604b1ce6eebf35)</code>

## [v1.5.0](https://github.com/Norviah/bump/compare/v1.4.1...v1.5.0) (2025-05-03)

### Features

- support `{{oldVersion}}` and `{{newVersion}}` placeholders to reference the version before and after bumping <code>[25044c9](https://github.com/Norviah/bump/commit/25044c9e686761dc48b502ec7c094787143fb976)</code>

## [v1.4.1](https://github.com/Norviah/bump/compare/v1.4.0...v1.4.1) (2023-12-19)

### Bug Fixes

- **commands/hook**: ensure backslashes are properly escaped <code>[9f7f49b](https://github.com/Norviah/bump/commit/9f7f49becc5929bf5e367b4b788c7a061833f668)</code>

## [v1.4.0](https://github.com/Norviah/bump/compare/v1.3.0...v1.4.0) (2023-12-19)

### Refactor

- **config**: set the `timeout` to be nullable <code>[915758f](https://github.com/Norviah/bump/commit/915758f14fe1ad1766b45d71a77ad01221c3f4d6)</code>

### Features

- **commands**: add a command to install a git hook that ensures commits are semantic <code>[a455d98](https://github.com/Norviah/bump/commit/a455d988040c8043ce0502e362fffda8f6177d6b)</code>

## [v1.3.0](https://github.com/Norviah/bump/compare/v1.2.0...v1.3.0) (2023-09-18)

### Features

- implement an option to represent how commits are sorted in the changelog <code>[d7120ef](https://github.com/Norviah/bump/commit/d7120ef1467937515766a3b489eebc9fe68dd305)</code>

## [v1.2.0](https://github.com/Norviah/bump/compare/v1.1.0...v1.2.0) (2023-08-23)

### Features

- implement the `phase` command to execute a specific phase <code>[b5458ce](https://github.com/Norviah/bump/commit/b5458ce385de2106fb212170e6ccfc3ef1010261)</code>

	With this new command, the tool can execute scripts within the specified
	phase without bumping the project's version.

### Bug Fixes

- **`Changelog`**: trim the result when accessing the repo's url <code>[7345937](https://github.com/Norviah/bump/commit/7345937d4d2b55ad0cac17f3b91ba6b95fcc332c)</code>

## v1.1.0 (2023-08-06)

### Refactor

- **`Changelog`**: remove extra padding when including the body for commits <code>[32f2882](https://github.com/Norviah/bump/commit/32f28824d9ff98bb954fdceba0050c55d101eab1)</code>

- **`command/init`**: refactor the template for the configuration file to a JSON object <code>[d8ef34a](https://github.com/Norviah/bump/commit/d8ef34a751c82196ab47f04ba00a92a01044108c)</code>

- **`Command`**: refactor the logic for initializing a command's context to a method that only imports the config file <code>[2275cbd](https://github.com/Norviah/bump/commit/2275cbd8f2f907c0570d2cd31eaaa930039c9bab)</code>

- ensure the user is in a git repository <code>[8482148](https://github.com/Norviah/bump/commit/848214805f6fcec4193c54ddc1d3e1a3c0fe43eb)</code>

- **`Command`**: trim the error's message when catching and displaying a runtime error <code>[3c39216](https://github.com/Norviah/bump/commit/3c39216e076b86709a69851f6b0c63a86b5ef1ff)</code>

- **`Command`**: move the logic for importing the config file to `InitializeContext` <code>[e504710](https://github.com/Norviah/bump/commit/e5047107aefc500a6145f7dc5b5cbd346af5d765)</code>

- move the validation logic for saving changelogs into the  structure <code>[2638fa6](https://github.com/Norviah/bump/commit/2638fa6946acd2d0477cec6b5d19ae5c0cfb2909)</code>

- implement a class to provide methods for reading from files <code>[dfd5599](https://github.com/Norviah/bump/commit/dfd5599fb4caa605ca26f75d0afe3f20816c38ca)</code>

### Features

- **config**: add a `noSpinner` option to disable the spinner when running commands <code>[ec33292](https://github.com/Norviah/bump/commit/ec33292262a6b022710730fd63ffdac6fdfd0c26)</code>

	The issue with spinners is that they refresh the terminal for each
	frame, causes problems for scripts that require input from the user as
	the prompt for the input is erased.
	
	The `noSpinner` option allows the user to disable a spinner for a
	specific script, which will prevent the screen from being refreshed.

- implement a command to create a configuration file <code>[d195941](https://github.com/Norviah/bump/commit/d195941ba112bbe1a2149bda442c833e0cf1bfdb)</code>

- **`Changelog`**: don't print commits representing merges <code>[ccb8207](https://github.com/Norviah/bump/commit/ccb8207e84db226a2140b59bb52dadf241cbeb61)</code>

- **`Changelog`**: additionally print commits that introduce breaking changes into their own section <code>[84a32fd](https://github.com/Norviah/bump/commit/84a32fd2b21c70b09d4b5be33dca50716641a394)</code>

- implement a command to release a new project version <code>[50f5c94](https://github.com/Norviah/bump/commit/50f5c94a56c0a6acf7fb26ac1c2163d2ddfbafe8)</code>

- **types**: implement a type to infer arguments and flags of a command <code>[aeed26e](https://github.com/Norviah/bump/commit/aeed26e1c80d6a4f66c121c97e4ae579e43634b6)</code>

- **`structs/Changelog`**: include the release's body if available <code>[0266ae7](https://github.com/Norviah/bump/commit/0266ae783af10ccc6edc66302041bbfe072e8195)</code>

- **`Command`**: implement a utility method for asking the user for input <code>[bc7318a](https://github.com/Norviah/bump/commit/bc7318af8ad4da845f4743f71f7d830842cd6611)</code>

- **deps**: add the dependency `execa` for running shell commands <code>[38a3a82](https://github.com/Norviah/bump/commit/38a3a823acf2c4252268a97521350cd755ba9cd3)</code>

- implement a structure for generating logs <code>[21203e1](https://github.com/Norviah/bump/commit/21203e1f0967ea220cbc263441980d8bc8ca9781)</code>

- implement an option to specify a root directory when running a shell script <code>[6c43673](https://github.com/Norviah/bump/commit/6c436739edddd29ed0f07aefcd3672486557a293)</code>

- implement a subcommand for generating changelogs <code>[da67f03](https://github.com/Norviah/bump/commit/da67f0373db71c3c17628e37af94145050bdcc9c)</code>

- **deps**: add the dependency `simple-git` for working with git <code>[08d0ed6](https://github.com/Norviah/bump/commit/08d0ed6905e17a5b00cbac7eb5dc17e4f51f169e)</code>

- implement utility methods to commands for printing logs <code>[f7a64c7](https://github.com/Norviah/bump/commit/f7a64c7e9270811efae2c0b4d4e0c117623e4f89)</code>

- implement a custom base command <code>[aa4f220](https://github.com/Norviah/bump/commit/aa4f220d57d54f9f842ae4e5c3748a0e71459696)</code>

- implement a schema to represent links <code>[41cf6a6](https://github.com/Norviah/bump/commit/41cf6a62fea9a1c52d8cdec4f5d1692e3803618a)</code>

- implement a custom error class <code>[95d2783](https://github.com/Norviah/bump/commit/95d278354da82bf852952ea9132cb358504aeea2)</code>

- define schemas for the configuration object <code>[ecd7873](https://github.com/Norviah/bump/commit/ecd7873e395d391e9ab72b5fb23fcb91bcf4559a)</code>

### Bug Fixes

- **`Changelog`**: change the split character for `simple-git` as the default one may appear in string results <code>[7440d55](https://github.com/Norviah/bump/commit/7440d558824f727dff65db109eb1e0bdb1f7600d)</code>

- correctly infer the message from a script error <code>[f8cf256](https://github.com/Norviah/bump/commit/f8cf256208375d1bfad11b940cd55f60a823b84b)</code>

### Init

- implement oclif template <code>[837cfe2](https://github.com/Norviah/bump/commit/837cfe2488f255ac584a8ea9ed1d0fb0f5e445c6)</code>

- initial commit <code>[4679d67](https://github.com/Norviah/bump/commit/4679d676accd67f19804c2e72fc592f6505742ba)</code>