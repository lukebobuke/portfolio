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

	return (
		<motion.div className="project-grid" layout>
			{projects.map((project) => {
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
