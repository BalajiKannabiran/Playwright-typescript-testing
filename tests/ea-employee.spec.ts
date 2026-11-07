import { test, expect } from '@playwright/test';
import { EAEmployeePage } from '../src/pages/EAEmployeePage';

const credentials = {
  username: 'admin',
  password: 'password',
};


test.describe('EA Employee application', () => {
  test('should log in with valid administrator credentials', async ({ page }) => {
    const employeePage = new EAEmployeePage(page);

    await employeePage.openLogin();
    await employeePage.login(credentials.username, credentials.password);
    await expect(page.getByRole('link', { name: 'View Employees →' })).toBeVisible();
  });

  test('should display the employee list with employee records', async ({ page }) => {
    const employeePage = new EAEmployeePage(page);

    await employeePage.openLogin();
    await employeePage.login(credentials.username, credentials.password);
    await employeePage.openEmployees();

    await expect(page.getByText('📊 332 employees', { exact: true })).toBeVisible();
    const antonioRow = employeePage.employeeRow('Antonio');
    await expect(antonioRow).toContainText('Antonio');
    await expect(antonioRow).toContainText('35 yrs');
    await expect(antonioRow).toContainText('$3,500.00');
    await expect(antonioRow).toContainText('10 mo.');
    await expect(antonioRow).toContainText('Senior');
    await expect(antonioRow).toContainText('antonio.chafu@gmail1.comm');
  });

  test('should filter the employee list by name', async ({ page }) => {
    const employeePage = new EAEmployeePage(page);

    await employeePage.openLogin();
    await employeePage.login(credentials.username, credentials.password);
    await employeePage.openEmployees();
    await employeePage.searchByName('Antonio');

    await expect(page.getByText('1 employee', { exact: false })).toBeVisible();
    await expect(employeePage.employeeTable.getByRole('row')).toHaveCount(2);
    await expect(employeePage.employeeRow('Antonio')).toBeVisible();
  });

  test('should filter employees by grade', async ({ page }) => {
    const employeePage = new EAEmployeePage(page);

    await employeePage.openLogin();
    await employeePage.login(credentials.username, credentials.password);
    await employeePage.openEmployees();
    await employeePage.filterByGrade('Senior');

    const employeeRows = employeePage.employeeTable.locator('tbody tr');
    await expect(employeeRows).not.toHaveCount(0);
    await expect(employeeRows.first()).toContainText('Senior');
    await expect(employeeRows.last()).toContainText('Senior');
  });

  test('should validate employee details from the details view', async ({ page }) => {
    const employeePage = new EAEmployeePage(page);

    await employeePage.openLogin();
    await employeePage.login(credentials.username, credentials.password);
    await employeePage.openEmployees();
    await employeePage.employeeRow('Antonio').getByRole('link', { name: /Details/ }).click();

    await expect(page).toHaveTitle(/Employee Details/i);
    await expect(page).toHaveURL(/\/EmployeeDetails\/Index\/17$/);
    const detailsRow = page.getByRole('table').getByRole('row').filter({ hasText: 'Antonio' }).first();
    await expect(detailsRow).toContainText('Antonio');
    await expect(detailsRow).toContainText('₹ 3,500.00');
    await expect(detailsRow).toContainText('Senior');
  });
});
