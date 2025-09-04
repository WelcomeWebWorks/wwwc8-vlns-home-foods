# Customizable Product Cards

This directory contains components that allow users to customize product variants directly on the product listing pages without navigating to individual product detail pages.

## Components

### CustomizableProductCard.tsx
- **Purpose**: Displays products in card format with inline variant selection
- **Features**:
  - Dynamic variant selection (Oil Type, Garlic Variant, Weight, etc.)
  - Real-time price updates based on selected variants
  - Smart UI: Buttons for 2-3 options, dropdowns for 4+ options
  - Only shows available variants
  - Maintains existing Add to Cart functionality

### CustomizableProductListItem.tsx
- **Purpose**: Displays products in list format with inline variant selection
- **Features**:
  - Compact variant selection using dropdowns
  - Real-time price updates
  - Optimized for list view layout
  - Only shows available variants

## How It Works

1. **Variant Detection**: Automatically detects all available product options from Shopify
2. **Default Selection**: Pre-selects the first available option for each variant type
3. **Dynamic Pricing**: Updates price in real-time when variants are changed
4. **Availability Check**: Only shows variants that are available for sale
5. **Fallback Handling**: Gracefully handles cases where no matching variant is found

## Usage

The components are automatically integrated into:
- Product listing page (card view)
- Product listing page (list view)  
- Featured products section

## Variant Types Supported

- **Oil Type**: Groundnut Oil, Sunflower Oil, etc.
- **Garlic Variant**: With Garlic, Without Garlic
- **Weight**: 250g, 500g, 1kg, etc.
- **Any other product options** configured in Shopify

## Technical Details

- Uses React hooks for state management
- Memoized calculations for performance
- TypeScript for type safety
- Responsive design with Tailwind CSS
- Integrates with existing AddToCart component
