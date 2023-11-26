// __mocks__/vscode.js

const vscode = {
    Uri: {
      parse: jest.fn(),
      file: jest.fn((path) => ({
        scheme: 'file',
        path,
        toString: () => `file://${path}`
      })),
      // ... other Uri methods and properties ...
    },
    workspace: {
      // Mock specific workspace properties and methods you use
    },
    // ... other parts of the vscode API you use ...
  };
  
  module.exports = vscode;
  