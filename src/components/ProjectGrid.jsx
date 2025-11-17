/** @format */

import { motion } from "framer-motion";
import { projects } from "../data/projects";
import ProjectCard from "./ProjectCard";
import "./ProjectGrid.css";

function ProjectGrid({ expandedCard, setExpandedCard, activeFilter }) {
	const handleCardClick = (projectId, event) => {
		event.stopPropagation();
		setExpandedCard(expandedCard === projectId ? null : projectId);
	};

	// Sort projects by date (newest first)
	const sortedProjects = [...projects].sort((a, b) => {
		return new Date(b.date) - new Date(a.date);
	});

	return (
		<motion.div className="project-grid" layout>
			{sortedProjects.map((project) => {
				const isFiltered = activeFilter !== "all" && project.category !== activeFilter;

				return (
					<ProjectCard
						key={project.id}
						project={project}
						isExpanded={expandedCard === project.id}
						isFiltered={isFiltered}
						onClick={(e) => handleCardClick(project.id, e)}
					/>
				);
			})}
		</motion.div>
	);
}

export default ProjectGrid;
