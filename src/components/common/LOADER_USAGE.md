# Common Loader Components

## Overview
Reusable loader components for the admin panel. All components are in `src/components/common/`.

## Components

### 1. Loader
Basic spinning loader component.

**Props:**
- `size`: 'sm' | 'md' | 'lg' | 'xl' (default: 'md')
- `fullscreen`: boolean (default: false)
- `text`: string (default: "Loading...")

**Usage:**
```jsx
import { Loader } from "@/components/common";

// Basic spinner
<Loader />

// With size and text
<Loader size="lg" text="Fetching data..." />

// Fullscreen loader
<Loader fullscreen size="xl" text="Loading page..." />
```

### 2. SkeletonLoader
Skeleton placeholder for different content types.

**Props:**
- `type`: 'table' | 'card' | 'form' | 'list' (default: 'table')
- `count`: number (default: 3)

**Usage:**
```jsx
import { SkeletonLoader } from "@/components/common";

// Table skeleton
<SkeletonLoader type="table" count={5} />

// Card grid skeleton
<SkeletonLoader type="card" count={6} />

// Form skeleton
<SkeletonLoader type="form" count={4} />

// List skeleton
<SkeletonLoader type="list" count={3} />
```

### 3. PageLoader
Wrapper component for page-level loading states.

**Props:**
- `isLoading`: boolean
- `children`: ReactNode (rendered when not loading)

**Usage:**
```jsx
import { PageLoader } from "@/components/common";

<PageLoader isLoading={loading}>
  <YourPageContent />
</PageLoader>
```

### 4. ButtonLoader
Button component with built-in loading state.

**Props:**
- `isLoading`: boolean
- `disabled`: boolean
- Other button props...
- `children`: ReactNode (button text/content)

**Usage:**
```jsx
import { ButtonLoader } from "@/components/common";

<ButtonLoader
  isLoading={isSubmitting}
  onClick={handleSubmit}
  style={{ backgroundColor: "var(--primary)" }}
  className="px-6 py-2 text-white font-medium rounded-full"
>
  Submit
</ButtonLoader>
```

## Import Examples

**Individual imports:**
```jsx
import Loader from "@/components/common/Loader";
import SkeletonLoader from "@/components/common/SkeletonLoader";
```

**Named imports from index:**
```jsx
import { Loader, SkeletonLoader, PageLoader, ButtonLoader } from "@/components/common";
```

## Styling
All loaders use the CSS variable `--primary` for the primary color and support Tailwind CSS animations.
