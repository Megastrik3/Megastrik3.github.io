import { initializeApp } from 'firebase/app';
import { getVertexAI, getGenerativeModel } from 'firebase/vertexai';
import { initializeAppCheck, ReCaptchaV3Provider } from 'firebase/app-check';

jest.mock('firebase/app', () => ({
  initializeApp: jest.fn(),
}));

jest.mock('firebase/vertexai', () => ({
  getVertexAI: jest.fn(),
  getGenerativeModel: jest.fn(),
}));

jest.mock('firebase/app-check', () => ({
  initializeAppCheck: jest.fn(),
  ReCaptchaV3Provider: jest.fn(),
}));

jest.mock('../js/app.js', () => ({
  ...jest.requireActual('../js/app.js'),
  getCurrentDate: jest.fn().mockReturnValue('2024-11-17'),
  checkLocalStorage: jest.fn().mockReturnValue(false),
  checkAge: jest.fn().mockReturnValue(false),
  sendVertexPrompt: jest.fn(),
  displayData: jest.fn(),
  vertexAIStorageChecks: jest.fn(),
}));

describe('vertexAIStorageChecks', () => {
  it('should call sendVertexPrompt when localStorage does not have vertexAI or needs refresh', async () => {
    document.addEventListener('DOMContentLoaded', async () => {

    const sendVertexPromptMock = require('../js/app.js').sendVertexPrompt;
    const displayDataMock = require('../js/app.js').displayData;

    await require('../js/app.js').vertexAIStorageChecks(false);

    expect(sendVertexPromptMock).toHaveBeenCalled();
    expect(displayDataMock).toHaveBeenCalledWith('advice', 'vertexAI', 1);

    expect(initializeApp).toHaveBeenCalled();
    expect(getVertexAI).toHaveBeenCalled();
    expect(getGenerativeModel).toHaveBeenCalled();
  });
});
});