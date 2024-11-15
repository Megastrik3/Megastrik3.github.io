const { checkLocalStorage, checkAge, getCurrentDate, openLocationFrame } = require("../js/app");
const app = require("../js/app.js");


describe("checkLocalStorage()", () => {

    beforeAll(() => {
        return localStorage.setItem("testKey", "testValue");
    });
    
    afterAll(() => {
        return localStorage.removeItem("testKey");
    });

    test("entry is found in local storage", () => {
        expect(checkLocalStorage("testKey")).toBeTruthy();
    });

    test("entry is not found in local storage", () => {
        expect(checkLocalStorage("testKeyFalse")).toBeFalsy();
    });

    test("no storage key is found", () => {
        expect(checkLocalStorage("")).toBeFalsy();
    });
});

describe("checkAge()", () => {
    
    afterAll(() => {
        return localStorage.removeItem("testKey");
    });


    test("time is exactly the same", () => {
        const frequency = "hourly";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        expect(checkAge(frequency, localStorageKey)).toBeFalsy();
    });

    test("time is less than one hour old by 1 minute", () => {
        const frequency = "hourly";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + parseInt(date.getHours() + 1) + "-" + parseInt(date.getMinutes() - 1) + "|" + "Test Data");
        expect(checkAge(frequency, localStorageKey)).toBeFalsy();
    });

    test("time is exactly 1 hour older (hourly frequency)", () => {
        const frequency = "hourly";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + parseInt(date.getHours() + 1) + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, localStorageKey)).toBeTruthy();
    });

    test("time is 1 day, month, and year older (hourly frequency)", () => {
        const frequency = "hourly";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", parseInt(date.getFullYear() + 1) + "-" + parseInt(date.getMonth() + 2).toString().padStart(2, '0') + "-" + parseInt(date.getDate() + 1).toString().padStart(2, '0') + "-" + parseInt(date.getHours()) + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, localStorageKey)).toBeTruthy();
    });

    test("time is not 1 day older (daily frequency)", () => {
        const frequency = "daily";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, localStorageKey)).toBeFalsy();
    });

    test("time is exactly 1 day older (daily frequency)", () => {
        const frequency = "daily";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + parseInt(date.getDate() + 1).toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, localStorageKey)).toBeTruthy();
    });

    test("time is exactly 1 month, and year older (daily frequency)", () => {
        const frequency = "daily";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", parseInt(date.getFullYear() + 1) + "-" + parseInt(date.getMonth() + 2).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + parseInt(date.getHours()) + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, localStorageKey)).toBeTruthy();
    });

    test("time is not 1 month older (monthly frequency)", () => {
        const frequency = "monthly";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, localStorageKey)).toBeFalsy();
    });

    test("time is exactly 1 month older (monthly frequency)", () => {
        const frequency = "monthly";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", date.getFullYear() + "-" + parseInt(date.getMonth() + 2).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, localStorageKey)).toBeTruthy();
    });

    test("time is exactly 1 year older (monthly frequency)", () => {
        const frequency = "monthly";
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", parseInt(date.getFullYear() + 1) + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, localStorageKey)).toBeTruthy();
    });

    test("no frequency given", () => {
        const localStorageKey = "testKey";
        const date = new Date();
        localStorage.setItem("testKey", parseInt(date.getFullYear() + 1) + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge("", localStorageKey)).toBeFalsy();
    });

    test("no localStorageKey given", () => {
        const frequency = "monthly";
        const date = new Date();
        localStorage.setItem("testKey", parseInt(date.getFullYear() + 1) + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes() + "|" + "Test Data");
        console.log(localStorage.getItem("testKey"));
        expect(checkAge(frequency, "")).toBeFalsy();
    });

});

describe("getCurrentDate()", () => {

    test("get current date without time", () => {
        const date = new Date();
        const currentDate = date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0');
        expect(getCurrentDate(false)).toBe(currentDate);
    });

    test("get current date with time", () => {
        const date = new Date();
        const currentDate = date.getFullYear() + "-" + parseInt(date.getMonth() + 1).toString().padStart(2, '0') + "-" + date.getDate().toString().padStart(2, '0') + "-" + date.getHours() + "-" + date.getMinutes();
        expect(getCurrentDate(true)).toBe(currentDate);
    });

});