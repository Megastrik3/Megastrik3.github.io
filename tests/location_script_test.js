import * as webdriver from 'selenium-webdriver';
let driver = new webdriver.Builder().forBrowser("chrome").build();
await driver.get('http://127.0.0.1:8080/');
await driver.manage().setTimeouts({ implicit: 5000 });
let locationButton = await driver.findElement(By.id('SelectLocationBtn'));
await locationButton.click();
let currentLocationButton = await driver.findElement(By.id('currentLocationBtn'));

if (await currentLocationButton.isDisplayed()) {
    console.log("Current location button is displayed");
}
await driver.quit();