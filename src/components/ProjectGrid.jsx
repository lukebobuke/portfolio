/** @format */

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import "./ProjectGrid.css";

function ProjectGrid({ expandedCard, setExpandedCard, activeFilter }) {
	const [isInitialLoad, setIsInitialLoad] = useState(true);

	useEffect(() => {
		// Remove initial-load class after animation completes
		const timer = setTimeout(() => {
			setIsInitialLoad(false);
		}, 900); // 9 cards * 0.05s + 0.4s animation
		return () => clearTimeout(timer);
	}, []);
	const handleCardClick = (projectId, isFiltered, event) => {
		event.stopPropagation();
		// Don't do anything if the card is filtered out
		if (isFiltered) {
			return;
		}
		setExpandedCard(expandedCard === projectId ? null : projectId);
	};

	// Sort projects by date (newest first)
	const sortedProjects = [...projects].sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});

	return (
		<motion.div className="project-grid" layout>
			{sortedProjects.map((project, index) => {
				const isFiltered = activeFilter !== "all" && project.category !== activeFilter;

				return (
					<ProjectCard
						key={project.id}
						project={project}
						isExpanded={expandedCard === project.id}
						isFiltered={isFiltered}
						isInitialLoad={isInitialLoad}
						animationIndex={index}
						onClick={(e) => handleCardClick(project.id, isFiltered, e)}
					/>
				);
			})}
		</motion.div>
	);
}

export default ProjectGrid;
