// __mocks__/vscode.js
const vscode = {
    workspace: {
      findFiles: jest.fn(),
      // Other workspace methods...
    },
    Uri: {
      file: jest.fn((path) => ({ scheme: 'file', path, toString: () => path })),
      // Other Uri methods...
    },
    RelativePattern: jest.fn(),
    // Other vscode APIs...
  };
  
  module.exports = vscode;
  