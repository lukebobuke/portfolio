/** @format */

import { motion } from "framer-motion";
import "./Timeline.css";

function Timeline({ selectedDate, projects, onProjectSelect, activeFilter }) {
	const startYear = 2017;
	const endYear = 2026;
	const years = [];

	for (let year = startYear; year <= endYear; year++) {
		years.push(year);
	}

	// Calculate dot position based on date string
	const calculateDotPosition = (dateString) => {
		if (!dateString) return null;

		const [year, month] = dateString.split("-").map(Number);

		// Calculate position as percentage
		// Each segment is one year, with years.length total segments
		const segmentWidth = 100 / years.length; // Width of one segment in %
		const yearIndex = year - startYear; // Which segment (0-based)
		const monthProgress = (month - 1) / 12; // Position within the year (0 to ~0.92)

		// Position = start of year segment + progress through that segment
		const position = (yearIndex + monthProgress) * segmentWidth;

		return position;
	};

	const selectedDotPosition = calculateDotPosition(selectedDate);

	const handleEmptyDotClick = (projectId, isFiltered, e) => {
		e.stopPropagation();
		if (!isFiltered) {
			onProjectSelect(projectId);
		}
	};

	return (
		<div className="timeline-container">
			<div className="timeline">
				{years.map((year, index) => {
					// Find projects for this year
					const yearProjects = projects.filter((p) => {
						if (!p.date) return false;
						const [projectYear] = p.date.split("-").map(Number);
						return projectYear === year;
					});

					// Check if selected project is in this year
					const selectedYear = selectedDate ? Number(selectedDate.split("-")[0]) : null;
					const selectedMonth = selectedDate ? Number(selectedDate.split("-")[1]) : null;
					const isSelectedYearSegment = selectedYear === year;

					return (
						<div key={year} className="timeline-segment">
							<div className="timeline-line"></div>
							<div className="timeline-year">{year}</div>
							{index === years.length - 1 && <div className="timeline-line" style={{ left: "100%" }}></div>}
							{/* Dots for projects in this year */}
							{yearProjects.map((project) => {
								const [, month] = project.date.split("-").map(Number);
								const monthProgress = ((month - 1) / 12) * 100; // 0% to ~92%
								const isFiltered = activeFilter !== "all" && project.category !== activeFilter;

								return (
									<div
										key={project.id}
										className={`timeline-dot-empty ${isFiltered ? "timeline-dot-filtered" : ""}`}
										style={{ left: `${monthProgress}%` }}
										onClick={(e) => handleEmptyDotClick(project.id, isFiltered, e)}
										title={project.title}
									/>
								);
							})}{" "}
							{/* Filled dot for selected project in this segment */}
							{isSelectedYearSegment && selectedMonth && (
								<motion.div
									className="timeline-dot-filled timeline-dot-filled-no-transform"
									style={{ left: `calc(${((selectedMonth - 1) / 12) * 100}% - 6px)` }}
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									transition={{ opacity: { duration: 0.2 } }}
									layoutId="selected-dot"
								/>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}

export default Timeline;
