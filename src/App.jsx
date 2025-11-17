/** @format */

import { useState } from "react";
import "./App.css";
import ProjectGrid from "./components/ProjectGrid";
import Timeline from "./components/Timeline";
import { projects } from "./data/projects";

function App() {
	const [expandedCard, setExpandedCard] = useState(null);
	const [activeFilter, setActiveFilter] = useState("all");

	// Get the date of the expanded project
	const selectedProject = projects.find((p) => p.id === expandedCard);
	const selectedDate = selectedProject ? selectedProject.date : null;

	const handleBackgroundClick = () => {
		if (expandedCard) {
			setExpandedCard(null);
		} else if (activeFilter !== "all") {
			setActiveFilter("all");
		}
	};

	const handleFilterClick = (category, event) => {
		event.stopPropagation();
		setActiveFilter(activeFilter === category ? "all" : category);
	};

	const handleTimelineProjectSelect = (projectId) => {
		setExpandedCard(projectId);
	};

	return (
		<div className="App" onClick={handleBackgroundClick}>
			<header>
				<h1>Luke Lageson</h1>
				<div className="filter-buttons">
					<button className={`filter-btn ${activeFilter === "coding" ? "active" : ""}`} onClick={(e) => handleFilterClick("coding", e)}>
						Coding
					</button>
					<button
						className={`filter-btn ${activeFilter === "architecture" ? "active" : ""}`}
						onClick={(e) => handleFilterClick("architecture", e)}>
						Architecture
					</button>
					<button className={`filter-btn ${activeFilter === "design" ? "active" : ""}`} onClick={(e) => handleFilterClick("design", e)}>
						Design
					</button>
				</div>
			</header>
			<Timeline selectedDate={selectedDate} projects={projects} onProjectSelect={handleTimelineProjectSelect} activeFilter={activeFilter} />
			<ProjectGrid expandedCard={expandedCard} setExpandedCard={setExpandedCard} activeFilter={activeFilter} />
		</div>
	);
}

export default App;
