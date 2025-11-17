/** @format */

import { motion } from "framer-motion";
import "./Timeline.css";

function Timeline({ selectedDate, projects, onProjectSelect, activeFilter }) {
	const startYear = 2019;
	const endYear = 2026;
	const years = [];

	for (let year = startYear; year <= endYear; year++) {
		years.push(year);
	} // Calculate dot position based on date string (newest at top/left)
	const calculateDotPosition = (dateString) => {
		if (!dateString) return null;

		const [year, month] = dateString.split("-").map(Number);

		// Calculate position as percentage, reversed so newest is at 0%
		const totalYears = endYear - startYear;
		const yearProgress = year - startYear;
		const monthProgress = month / 12;
		const position = ((yearProgress + monthProgress) / totalYears) * 100;

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
					// Position from 0% to 100% (2017 at 0%, 2026 at 100%)
					const position = (index / (years.length - 1)) * 100;

					return (
						<div key={year} className="timeline-year-marker" style={{ "--year-position": `${position}%` }}>
							<div className="timeline-year-label">{year}</div>
						</div>
					);
				})}{" "}
				{/* All project dots */}
				{projects.map((project) => {
					if (!project.date) return null;

					const dotPosition = calculateDotPosition(project.date);
					const isFiltered = activeFilter !== "all" && project.category !== activeFilter;
					const isSelected = selectedDate === project.date;

					return (
						<div
							key={project.id}
							className={`timeline-dot-vertical ${isFiltered ? "timeline-dot-filtered" : ""}`}
							style={{ "--dot-position": `${dotPosition}%` }}
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
