
// Function to arrange grid items dynamically
function masonryLayout() {
    const grid = document.querySelector('.masonry-grid');
    const items = Array.from(grid.children);
    const columns = Math.floor(grid.clientWidth / 250); // Calculate the number of columns based on container width
    const columnHeights = Array(columns).fill(0); // Initialize column heights

    items.forEach(item => {
        // Find the column with the smallest height
        const minColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));

        // Position the item in that column
        const leftPosition = minColumnIndex * 270; // Add some margin between columns (250px width + 20px margin)
        item.style.position = 'absolute';
        item.style.top = `${columnHeights[minColumnIndex]}px`;
        item.style.left = `${leftPosition}px`;

        // Update the height of the column
        columnHeights[minColumnIndex] += item.offsetHeight + 10; // Add 10px margin between items
    });

    // Set the height of the grid to match the tallest column
    grid.style.height = `${Math.max(...columnHeights)}px`;
}

// Call masonryLayout function on page load and resize
window.addEventListener('load', masonryLayout);
window.addEventListener('resize', masonryLayout);