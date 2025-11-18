/** @format */

import sharp from "sharp";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectsDir = path.join(__dirname, "..", "public", "projects");

// Configuration
const QUALITY = 80; // JPEG quality (0-100)
const MAX_WIDTH = 1920; // Max width for images
const THUMBNAIL_QUALITY = 85; // Slightly higher quality for thumbnails

async function compressImage(inputPath, outputPath, isThumbnail = false) {
	try {
		const stats = fs.statSync(inputPath);
		const originalSize = stats.size;
		const ext = path.extname(inputPath).toLowerCase();

		const image = sharp(inputPath).resize(MAX_WIDTH, null, {
			withoutEnlargement: true,
			fit: "inside",
		});

		// Handle PNG files with transparency
		if (ext === ".png") {
			await image.png({ quality: isThumbnail ? THUMBNAIL_QUALITY : QUALITY, compressionLevel: 9 }).toFile(outputPath);
		} else {
			// Convert JPG/JPEG to JPEG
			await image.jpeg({ quality: isThumbnail ? THUMBNAIL_QUALITY : QUALITY, mozjpeg: true }).toFile(outputPath);
		}

		const newStats = fs.statSync(outputPath);
		const newSize = newStats.size;
		const savedPercent = ((originalSize - newSize) / originalSize) * 100;

		console.log(`✓ ${path.basename(inputPath)}`);
		console.log(`  ${(originalSize / 1024).toFixed(1)}KB → ${(newSize / 1024).toFixed(1)}KB (${savedPercent.toFixed(1)}% saved)`);

		return { originalSize, newSize, savedPercent };
	} catch (error) {
		console.error(`✗ Error compressing ${inputPath}:`, error.message);
		return null;
	}
}

async function processDirectory(dir, isThumbnail = false) {
	const files = fs.readdirSync(dir);
	const stats = [];

	for (const file of files) {
		const filePath = path.join(dir, file);
		const stat = fs.statSync(filePath);

		if (stat.isDirectory()) {
			continue;
		}

		// Check if it's an image file
		const ext = path.extname(file).toLowerCase();
		if ([".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
			// Compress and replace
			const tempPath = path.join(dir, `temp_${file}`);
			const result = await compressImage(filePath, tempPath, isThumbnail);

			if (result) {
				try {
					fs.unlinkSync(filePath);
					fs.renameSync(tempPath, filePath);
					stats.push(result);
				} catch (err) {
					console.error(`  ⚠️  Could not replace ${file} (file may be in use)`);
					fs.unlinkSync(tempPath);
				}
			}
		}
	}

	return stats;
}

async function compressAllImages() {
	console.log("🖼️  Starting image compression...\n");

	let totalOriginal = 0;
	let totalNew = 0;
	let fileCount = 0;

	// Get all project folders
	const projectFolders = fs.readdirSync(projectsDir);

	for (const folder of projectFolders) {
		const folderPath = path.join(projectsDir, folder);
		if (!fs.statSync(folderPath).isDirectory()) continue;

		console.log(`\n📁 Processing ${folder}...`);

		// Process images
		const imagesDir = path.join(folderPath, "images");
		if (fs.existsSync(imagesDir)) {
			console.log("\n  Images:");
			const imageStats = await processDirectory(imagesDir, false);
			imageStats.forEach((stat) => {
				totalOriginal += stat.originalSize;
				totalNew += stat.newSize;
				fileCount++;
			});
		}

		// Process thumbnails
		const thumbnailDir = path.join(folderPath, "thumbnail");
		if (fs.existsSync(thumbnailDir)) {
			console.log("\n  Thumbnails:");
			const thumbStats = await processDirectory(thumbnailDir, true);
			thumbStats.forEach((stat) => {
				totalOriginal += stat.originalSize;
				totalNew += stat.newSize;
				fileCount++;
			});
		}
	}

	console.log("\n" + "=".repeat(50));
	console.log("✅ Compression Complete!\n");
	console.log(`Files processed: ${fileCount}`);
	console.log(`Original size: ${(totalOriginal / 1024 / 1024).toFixed(2)} MB`);
	console.log(`New size: ${(totalNew / 1024 / 1024).toFixed(2)} MB`);
	console.log(
		`Total saved: ${((totalOriginal - totalNew) / 1024 / 1024).toFixed(2)} MB (${(((totalOriginal - totalNew) / totalOriginal) * 100).toFixed(
			1
		)}%)`
	);
}

compressAllImages().catch(console.error);
