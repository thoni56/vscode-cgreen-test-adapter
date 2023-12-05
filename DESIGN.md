# Design of vscode-cgreen-testprovider

## Intro

`vscode-cgreen-test-provider` is a VSCode extension that populates the Testing View with test and results that are built using `Cgreen`.

## Context and Functional Overview

The function is the same as any VSCode Test Provider and it is implemented within the constraints of the VSCode API and eco-system.

## Architecture

### Containers

### Strategies

Since C/C++ test frameworks in general, and Cgreen in particular, need to build executables to create test executables it is not easy to discover tests.

In the case of Cgreen the strategy chosen is to first discover shared libraries that contains tests. These files will generate structural "meta tests" similar to how other test providers display files. The difference is that when first discovering these files there is nothing known about what tests they contain, so they must first be run to produce its output. This output is in XML-format which can be investigated for testnames, results and other information.
