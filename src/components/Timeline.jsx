/** @format */

import { motion } from "framer-motion";
import "./Timeline.css";

function Timeline({ selectedDate, projects, onProjectSelect, activeFilter }) {
	const startYear = 2019;
	const endYear = 2026;
	const years = [];

	for (let year = startYear; year <= endYear; year++) {
		years.push(year);
	}

	// Calculate dot position based on date string (newest at top/left)
	const calculateDotPosition = (dateString) => {
		if (!dateString) return null;

		const [year, month] = dateString.split("-").map(Number);

		// Timeline represents Jan 1, 2019 (0%) to Dec 31, 2026 (100%)
		// Total span: 8 years = 96 months
		const totalYears = endYear - startYear + 1; // 2026 - 2019 + 1 = 8 years
		const totalMonths = totalYears * 12; // 96 months

		// Calculate how many years have passed from start year
		const yearsPassed = year - startYear;
		const yearPercentage = (yearsPassed / totalYears) * 100;

		// Calculate how many months into the current year (0-11)
		const monthsIntoYear = month - 1; // January = 0, December = 11
		const monthPercentage = (monthsIntoYear / totalMonths) * 100;

		const position = yearPercentage + monthPercentage;

		// Reverse so newest dates = 0%, oldest = 100%
		return 100 - position;
	};

	const handleEmptyDotClick = (projectId, isFiltered, e) => {
		e.stopPropagation();
		if (!isFiltered) {
			onProjectSelect(projectId);
		}
	};

	return (
		<div className="timeline-container">
			<div className="timeline-vertical">
				{/* Main vertical line */}
				<div className="timeline-line-vertical"></div>
				{/* Year labels */}
				{years.map((year, index) => {
					// Calculate position with offset so first/last years appear in middle of their space
					// The range spans from half an interval from the edges
					const totalIntervals = years.length - 1;
					const halfInterval = 0.5 / totalIntervals;

					// Position from halfInterval to (1 - halfInterval)
					let position;
					if (index === 0) {
						// First year: offset by half interval
						position = halfInterval * 100;
					} else if (index === years.length - 1) {
						// Last year: offset by half interval from end
						position = (1 - halfInterval) * 100;
					} else {
						// Middle years: distributed proportionally
						position = (halfInterval + (index / totalIntervals) * (1 - 2 * halfInterval)) * 100;
					}

					return (
						<div key={year} className="timeline-year-marker" style={{ "--year-position": `${position}%` }}>
							<div className="timeline-year-label">{year}</div>
						</div>
					);
				})}{" "}
				{/* All project dots */}
				{projects.map((project, index) => {
					if (!project.date) return null;

					const dotPosition = calculateDotPosition(project.date);
					const isFiltered = activeFilter !== "all" && project.category !== activeFilter;
					const isSelected = selectedDate === project.date;

					return (
						<div
							key={project.id}
							className={`timeline-dot-vertical ${isFiltered ? "timeline-dot-filtered" : ""}`}
							style={{ "--dot-position": `${dotPosition}%`, "--dot-index": index }}
							onClick={(e) => handleEmptyDotClick(project.id, isFiltered, e)}
							title={project.title}
						/>
					);
				})}
				{/* Filled dot for selected project */}
				{selectedDate &&
					(() => {
						const selectedProject = projects.find((p) => p.date === selectedDate);
						const dotPosition = selectedProject ? calculateDotPosition(selectedProject.date) : calculateDotPosition(selectedDate);

						return <div className="timeline-dot-filled-vertical" style={{ "--dot-position": `${dotPosition}%` }} />;
					})()}
			</div>
		</div>
	);
}

export default Timeline;
