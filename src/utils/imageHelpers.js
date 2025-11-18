/** @format */

// Import all images from the projects folder structure
const allImages = import.meta.glob("/public/projects/**/images/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
	eager: true,
	query: "?url",
	import: "default",
});

const allThumbnails = import.meta.glob("/public/projects/**/thumbnail/*.{jpg,jpeg,png,webp,JPG,JPEG,PNG,WEBP}", {
	eager: true,
	query: "?url",
	import: "default",
});

/**
 * Get the thumbnail image path for a project
 */
export const getProjectThumbnail = (project) => {
	// Find thumbnail in the imported glob
	const thumbnailKey = Object.keys(allThumbnails).find((key) => key.includes(`/public/projects/${project.folder}/thumbnail/`));

	if (thumbnailKey) {
		// With query/import, the value is already the URL string
		return allThumbnails[thumbnailKey];
	}

	// Fallback to direct path
	return `/projects/${project.folder}/thumbnail/1.jpg`;
};

/**
 * Get all image paths for a project
 */
export const getProjectImages = (project) => {
	// Filter images that belong to this project
	const projectImages = Object.keys(allImages)
		.filter((key) => key.includes(`/public/projects/${project.folder}/images/`))
		.sort() // Sort alphabetically (1.jpg, 2.jpg, etc.)
		.map((key) => allImages[key]); // With query/import, value is already the URL string

	return projectImages;
};
