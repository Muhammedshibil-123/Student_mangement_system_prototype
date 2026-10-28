<RULE[multi_tenant_architecture]>
### Gater Project Context & Architecture

**1. Tech Stack**
- **Frontend**: React (Vite), TailwindCSS, Redux Toolkit, React Router DOM, Axios, React-Toastify.
- **Backend**: Django, Django REST Framework (DRF), SimpleJWT (HttpOnly Cookies).
- **Database**: PostgreSQL
- **Deployment**: Docker & Docker Compose

**2. Multi-Tenant Architecture (django-tenants)**
The backend strictly uses **Schema-Based Multi-Tenancy** via django-tenants. Do NOT suggest creating a building_id column for multi-tenancy.
- **Database Structure**: A single PostgreSQL database (gater_db). Each registered client gets an isolated PostgreSQL **schema** (e.g., infopark), plus a public schema for shared data.
- **Shared Apps** (Public Schema): users (CustomUser), tenants (Tenant, Domain), superadmin, subscriptions. These handle auth and global routing.
- **Tenant Apps** (Client Schemas): managers, guards, visitors, passes. These handle building-specific data.
- **Routing**: A custom JWTTenantMiddleware (Backend/config/middleware/tenant_jwt.py) extracts the schema_name claim from the JWT token (or HttpOnly cookie) to route requests to the correct schema.

**3. Authentication & Roles**
- **Tokens**: JWTs via djangorestframework-simplejwt. The Refresh token is stored in an HttpOnly, Lax cookie (efresh_token).
- **Roles**:
  - superadmin: System owner.
  - admin: The building manager/purchaser. Owns a specific tenant.
  - guard: Created by the admin. Exists within a specific tenant and handles daily operations (visitor logs).
- **Frontend Routing**: Protected routes use a <RoleRoute> wrapper in App.jsx.

**4. Known Gotchas & Rules**
- **Tenant Creation**: Must ALWAYS be wrapped in django_tenants.utils.schema_context('public') to prevent cross-schema contamination errors when cookies are present. (See RegisterSerializer and GoogleLoginView).
- **CORS & Cookies**: Frontend VITE_API_BASE_URL is set to http://localhost:8081 to match the frontend origin (localhost) to ensure SameSite=Lax cookies are sent properly.
</RULE[multi_tenant_architecture]>

<RULE[frontend_design_guidelines]>
### Gater Frontend Design & Theming Rules

**1. CSS Variables & Tailwind Theme**
- The project has a custom dual-theme setup (Light/Dark mode) defined in `Frontend/src/index.css` via CSS variables (`--background`, `--foreground`, `--card`, `--primary`, `--muted`, `--border`, etc.).
- **CRITICAL**: Never use hardcoded background/text colors (e.g., avoid `bg-white`, `bg-slate-50`, `text-slate-900`) for structural elements like page backgrounds, cards, headers, or main text.
- **Always** use the Tailwind theme aliases mapped in `tailwind.config.js`:
  - `bg-background` and `text-foreground` (for main layout/pages)
  - `bg-card` (for cards, sidebars, modals, headers)
  - `bg-muted` and `text-muted-foreground` (for secondary backgrounds and subtle text/icons)
  - `border-border` (for all standard borders and dividers)
  - `bg-primary` and `text-primary-foreground` (for primary buttons/accents)
- *Note:* Hardcoded colors (like `bg-blue-600/10`, `text-red-500`) are acceptable ONLY for specific status indicators, alert badges, or colorful decorative elements.

**2. UI Polish & Animations**
- **Animations**: Always use smooth transitions on interactive elements (`transition-all duration-300`). Use entry animations (e.g., `animate-in fade-in duration-500` or `group-hover` transforms) to make the UI feel modern and alive.
- **Icons**: Strictly use `react-icons` (specifically `react-icons/fi` for outline style, or others if context demands) to provide visual context to buttons, menus, and data fields.
- **Layouts**: Use modern, spacious padding (`p-6`, `p-8`), rounded corners (`rounded-2xl`, `rounded-3xl`), and subtle shadows (`shadow-sm`, `shadow-md`) for container elements.
- **Hover States**: All clickable elements (buttons, table rows, links) must have distinct hover states (e.g., `hover:bg-muted/50`, `hover:-translate-y-0.5`, `hover:shadow-lg`).

**3. Dark Mode Support**
- Dark mode is toggled by appending the `.dark` class to the HTML body/context.
- Because you are using the mapped semantic colors (`bg-background`, `bg-card`), dark mode will work *automatically* without needing `dark:` utility prefixes on every element.
- If you must use a hardcoded colorful element that clashes in dark mode, you may use the `dark:` prefix (e.g., `text-blue-600 dark:text-blue-400`) to adjust it.
</RULE[frontend_design_guidelines]>
