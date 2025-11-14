/** @format */

import { useState } from "react";
import "./App.css";
import ProjectGrid from "./components/ProjectGrid";

function App() {
	const [expandedCard, setExpandedCard] = useState(null);
	const [activeFilter, setActiveFilter] = useState("all");

	const handleBackgroundClick = () => {
		if (expandedCard) {
			setExpandedCard(null);
		}
		if (activeFilter !== "all") {
			setActiveFilter("all");
		}
	};

	const handleFilterClick = (category, event) => {
		event.stopPropagation();
		setActiveFilter(activeFilter === category ? "all" : category);
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
			<ProjectGrid expandedCard={expandedCard} setExpandedCard={setExpandedCard} activeFilter={activeFilter} />
		</div>
	);
}

export default App;
