// Function to arrange grid items dynamically
function masonryLayout() {
    const grid = document.querySelector('.masonry-grid');
    const items = Array.from(grid.children);

    // Calculate the number of columns dynamically based on container width
    const containerWidth = grid.parentElement.clientWidth; // Parent container width
    const margin = 20; // Margin on each side
    const itemWidth = 250; // Width of each grid item (including gaps between columns)
    const columns = Math.floor((containerWidth - 2 * margin) / (itemWidth + 10)); // 10px gap between items
    const columnHeights = Array(columns).fill(0); // Initialize column heights

    // Set the grid container's position
    grid.style.position = 'relative';

    // Position each grid item
    items.forEach(item => {
        // Find the column with the smallest height
        const minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

        // Calculate position
        const leftPosition = margin + minColumnIndex * (itemWidth + 10); // Adjust for margin and gaps
        const topPosition = columnHeights[minColumnIndex];

        // Apply styles
        item.style.position = 'absolute';
        item.style.left = `${leftPosition}px`;
        item.style.top = `${topPosition}px`;

        // Update column height
        columnHeights[minColumnIndex] += item.offsetHeight + 10; // Add gap between rows
    });

    // Update grid container height based on the tallest column
    grid.style.height = `${Math.max(...columnHeights)}px`;
}

// Initialize masonry layout and add a resize event listener
function initMasonry() {
    masonryLayout();

    // Recalculate layout on window resize
    window.addEventListener('resize', masonryLayout);
}

// Run the initialization
document.addEventListener('DOMContentLoaded', initMasonry);
