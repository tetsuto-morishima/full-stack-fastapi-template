import { test, expect } from '@playwright/test';

test('Google SSO フローの統合テスト', async ({ page }) => {
  // 1. ログイン画面にアクセス
  await page.goto('http://localhost:5173/login');
  // 2. Googleでログインボタン表示
  const googleBtn = page.locator('text=Googleでログイン');
  await expect(googleBtn).toBeVisible();

  // 3. Google認可画面遷移（APIモック例）URLに正しいqueryが含まれること
  await googleBtn.click();
  await expect(page).toHaveURL(/accounts\.google\.com\/o\/oauth2/);

  // 4. コールバック成功時
  await page.goto('http://localhost:5173/login?code=fakecode');
  // APIコールバックはモックかdummy値でシミュレート
  await page.waitForTimeout(1000); // レスポンス待ち
  expect(localStorage.getItem('access_token')).not.toBeNull();

  // 5. ホーム画面ユーザー名表示
  await page.goto('http://localhost:5173/');
  await expect(page.locator('text=Hi')).toBeVisible();

  // 6. Google code不正時の挙動
  await page.goto('http://localhost:5173/login?code=INVALID_CODE');
  await page.waitForTimeout(1000);
  // エラー表示が必要（例：alert等）
  // expect(page.locator('text=Google authentication failed')).toBeVisible();
});