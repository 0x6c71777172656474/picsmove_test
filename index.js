import puppeteer from "puppeteer";
import { expect } from "chai";

async function main() {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  // Open web page
  await page.goto("https://forhemer.github.io/React-Todo-List/");
  // Add 3 ToDos
  for (let i = 1; i <= 3; i++) {
    const inputField = await page.$("input[name='title']");
    await inputField.type(`Task ${i}`);
    await inputField.press("Enter");
  }
  // Should be 3 elements in list after addition
  const todos = await page.$$("ul li");
  expect(todos.length).to.equal(3);
  // Mark as 'Done'
  const checkbox = await page.$("input[type='checkbox']");
  await checkbox.click();
  // Check that it wass crossed by line
  const crossedElement = await page.$eval("ul li span", (element) =>
    element.getAttribute("style")
  );
  expect(crossedElement).contain("text-decoration: line-through");
  //Delete completed ToDo
  const deleteButton = await page.$("button[type='button']");
  await deleteButton.click();
  // Should be 2 elements in list after deletion
  const remainingTodos = await page.$$("ul li");
  expect(remainingTodos.length).to.equal(2);
  // Close browser
  setTimeout(async () => {
    await browser.close();
  }, 3000);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
