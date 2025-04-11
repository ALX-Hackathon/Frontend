// src/components/ui/Card.jsx
import React from 'react';

/**
 * A reusable Card component with optional title and actions area.
 * Provides consistent padding, background, border, and shadow.
 */
const Card = ({
  children,             // Content to display inside the card body
  className = '',       // Allow additional CSS classes for customization
  title,                // Optional string for the card title
  titleActions          // Optional React node (e.g., buttons) to display opposite the title
}) => {
  return (
    // Base card styling: white background, rounded corners, subtle shadow, light border
    <div className={`bg-white rounded-lg shadow border border-neutral-light ${className}`}>
      {/* Header Section: Render only if a title is provided */}
      {title && (
        // Header styling: Padding, bottom border separation, flex layout for title + actions
        <div className="px-5 py-4 border-b border-neutral-light flex justify-between items-center gap-4">
          {/* Title Styling: Defined size, weight, color */}
          <h3 className="text-base md:text-lg font-semibold text-neutral-darkest leading-6">
            {title}
          </h3>
          {/* Actions container: Prevents shrinking, aligns items */}
          {titleActions && <div className="flex-shrink-0 ml-4">{titleActions}</div>}
        </div>
      )}
      {/* Card Body: Consistent padding */}
      <div className="px-5 py-5">
        {children}
      </div>
    </div>
  );
};

export default Card;