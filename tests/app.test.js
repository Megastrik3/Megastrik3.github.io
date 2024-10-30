/**
 * @jest-environment jsdom
 */

const vertexGen = require('../js/app.js');
test('The generation should only run if an hour has passed since the last run', () => {

    const timestamp = dateTime.getDate() + "-" + dateTime.getMonth() + "-" + dateTime.getFullYear() + "-" + parsint(dateTime.getHours(), 10) - 1 + "-" + dateTime.getMinutes();
    localStorage.setItem("vertexAI", timestamp + "|" + "Test phrase" );
    expect(checkVertexAge()).toBe(true);

});