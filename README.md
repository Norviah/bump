# bump

Bump is a simple command-line tool for managing versions of your projects,
allowing you to perform actions **before** and **after** bumping the version
number.

### Installation

```bash
npm install @norviah/bump --global
```

### First Steps

To get started, run `bump init`. This will create a `.bumprc.json` file in your
project's root directory, this configuration file is used to define options that
alter how the tool will behave.

[View here](./src/schemas/config/index.ts) for a documentation of all available
options and a description of what they do.

### Usage

As previously mentioned, bump is a command-line tool used to manage versions of
your projects. The tool allows you to define scripts to perform before and after
bumping your project's version number, ensuring that each script is executed
successfully before the next script.

The main command for this tool is `release`, which will start the bump process
to release a new version of your project. The bump process is split into three 
stages:

  1. Pre-bump - before the version number is incremented,
  2. Bump - the version number is incremented,
  3. Post-bump - after the version number is incremented.

The bump stage represents the phase that the version number is incremented, here
is where the version is incremented in the respective file, which is then
committed with a new tag to represent the release.

You may customize the various aspects of the commit, such as the tag and release
message, these are available in the configuration file.

For the pre-bump and post-bump stage, you may define any amount of scripts to be
executed within a desired stage. These scripts are executed in the order
specifeid and are executed only if the previous script was executed 
successfully - if a script fails, the bump process will be aborted.

### Acknowledgements

This project was heavily inspired by [Bumped](https://github.com/bumped/bumped/tree/master).