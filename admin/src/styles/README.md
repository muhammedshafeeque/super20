# Common Styles Documentation

This directory contains reusable styles for the admin panel. The styles are organized to promote consistency and reduce code duplication.

## File Structure

- `common.scss` - Main common styles with reusable classes
- `main.scss` - Main stylesheet that imports common styles
- `README.md` - This documentation file

## Available Common Classes

### Layout Classes

#### `.page-container`
Main page wrapper with background and padding.
```scss
.page-container {
  min-height: 100vh;
  background-color: #f8fafc;
  padding: 1rem;
  width: 100%;
}
```

#### `.content-card`
Content wrapper with white background and shadow.
```scss
.content-card {
  width: 100%;
  background: white;
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
}
```

#### `.section-header`
Header section with title and action button.
```scss
.section-header {
  padding: 32px 20px 24px;
  border-bottom: 1px solid #e2e8f0;
  width: 100%;
}
```

### Button Classes

#### `.btn`
Base button class with common styling.

#### Button Variants
- `.btn--primary` - Purple primary button
- `.btn--secondary` - Gray secondary button
- `.btn--danger` - Red danger button
- `.btn--success` - Green success button
- `.btn--info` - Blue info button

#### Icon Button Variants
- `.btn--icon` - Base icon button
- `.btn--icon--view` - View action (blue)
- `.btn--icon--edit` - Edit action (green)
- `.btn--icon--delete` - Delete action (red)

### Search Classes

#### `.search-section`
Search section wrapper.

#### `.search-container`
Search input container with relative positioning.

#### `.search-input`
Styled search input field.

#### `.search-icon`
Search icon positioning.

### Table Classes

#### `.table-container`
Table wrapper with horizontal scroll.

#### `.table`
Base table styling.

#### `.table__header`
Table header styling.

#### `.table__body`
Table body styling.

#### `.table__row`
Table row styling.

### Data Display Classes

#### `.data-info`
Container for displaying title and description.

#### `.data-info__title`
Primary text in data info.

#### `.data-info__description`
Secondary text in data info.

### Tag Classes

#### `.tag`
Base tag styling.

#### Tag Variants
- `.tag--primary` - Purple tag
- `.tag--secondary` - Gray tag
- `.tag--success` - Green tag
- `.tag--danger` - Red tag
- `.tag--info` - Blue tag

### Utility Classes

#### Text Colors
- `.text-primary` - Primary text color
- `.text-secondary` - Secondary text color
- `.text-muted` - Muted text color
- `.text-success` - Success text color
- `.text-danger` - Danger text color
- `.text-info` - Info text color

#### Font Weights
- `.font-bold` - Bold font weight
- `.font-medium` - Medium font weight
- `.font-normal` - Normal font weight

#### Spacing
- `.mb-0` to `.mb-4` - Margin bottom utilities
- `.mt-0` to `.mt-4` - Margin top utilities
- `.p-0` to `.p-4` - Padding utilities

## Usage Examples

### Basic Page Structure
```tsx
<div className="page-container">
  <div className="content-card">
    {/* Your content here */}
  </div>
</div>
```

### Header Section
```tsx
<div className="section-header">
  <div className="section-header__content">
    <div className="section-header__title-section">
      <h1 className="section-header__title">Page Title</h1>
      <p className="section-header__subtitle">Page description</p>
    </div>
    <button className="btn btn--primary">
      <Plus size={16} />
      <span>Add Item</span>
    </button>
  </div>
</div>
```

### Search Section
```tsx
<div className="search-section">
  <div className="search-container">
    <Search className="search-icon" size={20} />
    <input
      type="text"
      placeholder="Search..."
      className="search-input"
    />
  </div>
</div>
```

### Table Structure
```tsx
<div className="table-container">
  <table className="table">
    <thead className="table__header">
      <tr>
        <th>Column 1</th>
        <th>Column 2</th>
      </tr>
    </thead>
    <tbody className="table__body">
      <tr className="table__row">
        <td>
          <div className="data-info">
            <span className="data-info__title">Title</span>
            <span className="data-info__description">Description</span>
          </div>
        </td>
        <td>
          <span className="tag tag--primary">Tag</span>
        </td>
      </tr>
    </tbody>
  </table>
</div>
```

### Action Buttons
```tsx
<div className="action-group">
  <button className="btn btn--icon btn--icon--view" title="View">
    <Eye size={16} />
  </button>
  <button className="btn btn--icon btn--icon--edit" title="Edit">
    <Edit size={16} />
  </button>
  <button className="btn btn--icon btn--icon--delete" title="Delete">
    <Trash2 size={16} />
  </button>
</div>
```

## Benefits

1. **Consistency** - All components use the same styling patterns
2. **Maintainability** - Changes to common styles affect all components
3. **Reusability** - Easy to create new components with consistent styling
4. **Performance** - Reduced CSS bundle size through shared styles
5. **Developer Experience** - Clear class names and structure

## Best Practices

1. Always use common classes when possible instead of creating custom styles
2. Extend common classes in component-specific SCSS files when needed
3. Use semantic class names that describe the purpose, not the appearance
4. Keep component-specific styles minimal and focused on unique requirements
5. Use utility classes for spacing and typography variations 