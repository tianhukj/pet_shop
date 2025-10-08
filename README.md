# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config({
  extends: [
    // Remove ...tseslint.configs.recommended and replace with this
    ...tseslint.configs.recommendedTypeChecked,
    // Alternatively, use this for stricter rules
    ...tseslint.configs.strictTypeChecked,
    // Optionally, add this for stylistic rules
    ...tseslint.configs.stylisticTypeChecked,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config({
  extends: [
    // other configs...
    // Enable lint rules for React
    reactX.configs['recommended-typescript'],
    // Enable lint rules for React DOM
    reactDom.configs.recommended,
  ],
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

## 数据库

```sql
-- 1. 建服务套餐表（基础表，带测试数据，确保package_id有有效值）
CREATE TABLE "packages" (
    "id" SERIAL PRIMARY KEY,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT NOT NULL,
    "price" NUMERIC(10,2) NOT NULL,
    "duration_minutes" INT NOT NULL,
    "category" VARCHAR(50) NOT NULL,
    "features" TEXT[] NOT NULL
);

-- 2. 建预约表（下划线字段+存网站传回的完整时间，解决"package_id不存在")
CREATE TABLE "appointments" (
    "id" SERIAL PRIMARY KEY,
    "pet_name" VARCHAR(100) NOT NULL, -- 适配后端查询
    "package_id" INT NOT NULL,        -- 直接定义package_id，无字段不存在错误
    "start_time" VARCHAR(50) NOT NULL,-- 存网站传回的完整时间（如2025-10-10T09:00:00.000Z）
    "end_time" VARCHAR(50) NOT NULL,  -- 与网站传回的结束时间完全匹配
    "notes" TEXT,
    "contact_phone" VARCHAR(20) NOT NULL,
    -- 关联套餐表，确保数据合法
    CONSTRAINT fk_appt_package FOREIGN KEY ("package_id") REFERENCES "packages"("id")
);

-- 3. 建已占用时段表（适配网站传回时间，无默认日期，靠时间匹配日期）
CREATE TABLE "occupied_slots" (
    "id" SERIAL PRIMARY KEY,
    "start_time" VARCHAR(50) NOT NULL, -- 与网站传回的start_time完全一致
    "end_time" VARCHAR(50) NOT NULL,   -- 与网站传回的end_time完全一致
    "appointment_id" INT NOT NULL,
    -- 关键：从网站传回的start_time中提取日期，无需手动填，适配后端日期查询
    "slot_date" VARCHAR(20) NOT NULL GENERATED ALWAYS AS (SUBSTRING("start_time" FROM 1 FOR 10)) STORED,
    -- 关联预约表，确保数据绑定
    CONSTRAINT fk_slot_appt FOREIGN KEY ("appointment_id") REFERENCES "appointments"("id")
);

-- 4. 测试：模拟网站传时间插入数据（验证逻辑）
-- 先插预约（start_time/end_time按网站传回格式填写）
INSERT INTO "appointments" ("pet_name", "package_id", "start_time", "end_time", "contact_phone")
VALUES ('旺财', 1, '2025-10-11T10:30:00.000Z', '2025-10-11T11:00:00.000Z', '13800138000');
-- 再插占用时段（仅填时间，slot_date自动从start_time提取为2025-10-11）
INSERT INTO "occupied_slots" ("start_time", "end_time", "appointment_id")
VALUES ('2025-10-11T10:30:00.000Z', '2025-10-11T11:00:00.000Z', 1);
```


