import { expect, type Locator, type Page } from '@playwright/test';

export class EAEmployeePage {
  readonly page: Page;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly signInButton: Locator;
  readonly employeeTable: Locator;
  readonly nameSearchInput: Locator;
  readonly gradeFilter: Locator;
  readonly searchButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.usernameInput = page.getByRole('textbox', { name: 'User Name' });
    this.passwordInput = page.getByRole('textbox', { name: 'Password' });
    this.signInButton = page.getByRole('button', { name: 'Sign In' });
    this.employeeTable = page.getByRole('table').first();
    this.nameSearchInput = page.getByRole('textbox', { name: 'Search by name...' });
    this.gradeFilter = page.getByRole('combobox');
    this.searchButton = page.getByRole('button', { name: 'Search' });
  }

  async openLogin(): Promise<void> {
    await this.page.goto('/Account/Login');
    await expect(this.page).toHaveTitle(/Sign In/i);
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.signInButton.click();
    await expect(this.page).toHaveURL(/\/$/);
    await expect(this.page.getByText('Hello admin!', { exact: true })).toBeVisible();
  }

  async openEmployees(): Promise<void> {
    await this.page.goto('/Employee');
    await expect(this.page).toHaveTitle(/Employee List/i);
    await expect(this.employeeTable).toBeVisible();
  }

  employeeRow(name: string): Locator {
    return this.employeeTable.getByRole('row').filter({ hasText: name }).first();
  }

  async searchByName(name: string): Promise<void> {
    await this.nameSearchInput.fill(name);
    await this.searchButton.click();
    await expect(this.page).toHaveURL(new RegExp(`searchTerm=${name}`));
  }

  async filterByGrade(grade: string): Promise<void> {
    await this.gradeFilter.selectOption({ label: grade });
    await this.searchButton.click();
    await expect(this.gradeFilter).toHaveValue(/^\d+$/);
  }
}
