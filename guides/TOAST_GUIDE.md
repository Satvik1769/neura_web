# Toast Notifications Guide

## ✅ Setup Complete!

Your app now has toast notifications enabled. Here's how to use them:

## 📝 Basic Usage

### In any client component:

```typescript
import { showToast } from "@/lib/toast";

// Show success toast
showToast.success("Account created!", "Welcome to Neura");

// Show error toast
showToast.error("Invalid email", "Please check and try again");

// Show info toast
showToast.info("Please wait", "Processing your request...");

// Show warning toast
showToast.warning("Are you sure?", "This action cannot be undone");
```

## 🎯 Advanced Usage

### Loading Toast (with update)

```typescript
// Show loading toast
const toastId = showToast.loading("Creating account...");

try {
  // Do something
  await signup(email, password, name);
  
  // Update to success
  showToast.update(toastId, {
    type: "success",
    message: "Account created!",
    description: "Redirecting to dashboard...",
  });
} catch (error) {
  // Update to error
  showToast.update(toastId, {
    type: "error",
    message: "Failed to create account",
    description: error.message,
  });
}
```

### Dismiss Toast

```typescript
// Dismiss specific toast
showToast.dismiss(toastId);

// Dismiss all toasts
showToast.dismissAll();
```

## 🎨 Features

- ✅ Dark theme (matches your app)
- ✅ Auto-dismiss after 4 seconds
- ✅ Close button on each toast
- ✅ Position: top-right
- ✅ Rich colors for different types
- ✅ Smooth animations

## 📍 Files Modified

1. **`package.json`** - Added `sonner` dependency
2. **`app/layout.tsx`** - Added `<ToastProvider />`
3. **`app/signup/page.tsx`** - Added error toast on registration failure
4. **`app/login/page.tsx`** - Added error toast on login failure
5. **`components/toast-provider.tsx`** - New provider component
6. **`lib/toast.ts`** - New toast utility functions

## 🚀 Current Implementation

### Signup Page
- ✅ Shows error toast if registration fails
- ✅ Error message is extracted from error object
- ✅ Description can show additional error details

### Login Page
- ✅ Shows error toast if login fails
- ✅ Same error handling as signup

## 💡 Examples in Your App

### Before (No Toast):
```typescript
} catch (error) {
  console.error("Signup failed:", error);
}
```

### After (With Toast):
```typescript
} catch (error) {
  console.error("Signup failed:", error);
  showToast.error("Registration failed", "Please check your details");
}
```

## 🎯 Next Steps

You can use `showToast` in any client component for:
- API call errors
- Form validation errors
- Success confirmations
- Loading states
- Warning messages

Just import and use:
```typescript
import { showToast } from "@/lib/toast";
```

---

**Restart your dev server to see the changes!**
