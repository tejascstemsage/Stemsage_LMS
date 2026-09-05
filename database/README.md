# Database (MongoDB)

Original PHP app used MySQL (`stemsage_portal` DB) with tables:
`admin_users`, `schools`, `kits`, `school_kits`, `settings`.

MERN version uses **MongoDB** with Mongoose. Table → Collection mapping:

| MySQL table   | Mongo collection | Model file                          |
|---------------|-------------------|--------------------------------------|
| admin_users   | admins            | `backend/models/Admin.js`            |
| schools       | schools           | `backend/models/School.js`           |
| kits          | kits              | `backend/models/Kit.js`              |
| school_kits   | assignments        | `backend/models/Assignment.js`       |
| settings      | settings           | `backend/models/Setting.js`          |

## Collections

### admins
- `username` (unique)
- `password` (bcrypt hash)

### schools
- `school_name`
- `email` (unique)
- `contact`
- `password` (bcrypt hash)
- `is_active` (boolean)

### kits
- `kit_name`, `grade`, `subject`, `topic`, `description`
- `video_url`
- `manual_pdf` (uploaded filename, served from `/uploads/kits/`)
- `kit_image` (uploaded filename, served from `/uploads/kits/`)
- `learning_outcomes`

### assignments  (replaces the `school_kits` join table)
- `school` (ObjectId ref → schools)
- `kit` (ObjectId ref → kits)
- unique compound index on `(school, kit)` — mirrors the old `INSERT IGNORE` behaviour

### settings (key/value, used for login page branding)
- `setting_key` (unique): `login_background`, `school_logo`, `login_overlay_color`,
  `login_primary_color`, `login_secondary_color`
- `setting_value`

## Setup

1. Install & start MongoDB locally, or use MongoDB Atlas.
2. Copy `backend/.env.example` to `backend/.env` and set `MONGO_URI`.
3. Run the seed script to create the first admin login and default settings:

```bash
cd database
node seed.js
```

Default admin credentials created by the seed script:
- username: `admin`
- password: `admin123`

**Change this password immediately after first login.**
