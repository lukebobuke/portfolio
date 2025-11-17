/** @format */

import { motion } from "framer-motion";
import { getProjectThumbnail, getProjectImages } from "../utils/imageHelpers";
import "./ProjectCard.css";

function ProjectCard({ project, isExpanded, isFiltered, onClick }) {
	const thumbnail = getProjectThumbnail(project);
	const images = getProjectImages(project);

	const handleClick = (e) => {
		if (isFiltered) {
			e.stopPropagation();
			return;
		}

		// Don't allow collapsing by clicking the expanded card
		if (isExpanded) {
			e.stopPropagation();
			return;
		}

		onClick(e);
	};

	return (
		<motion.div
			className={`project-card ${isExpanded ? "expanded" : ""} ${isFiltered ? "filtered" : ""}`}
			onClick={isFiltered ? undefined : handleClick}
			layout
			transition={{
				layout: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
			}}
			style={{
				...(isFiltered ? { pointerEvents: "none" } : {}),
				aspectRatio: "1 / 1",
			}}>
			<img src={thumbnail} alt={project.title} className="card-thumbnail" />
			<div className="card-overlay">
				<h3>{project.title}</h3>
			</div>

			{isExpanded && (
				<motion.div
					className="card-expanded-content"
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.2, duration: 0.3 }}>
					<h2>{project.title}</h2>
					<p className="project-date">{project.date}</p>
					{project.link && (
						<a
							href={project.link}
							target="_blank"
							rel="noopener noreferrer"
							className="visit-site-btn"
							onClick={(e) => e.stopPropagation()}>
							Visit Site
						</a>
					)}
					{project.narrative && <p className="project-narrative">{project.narrative}</p>}
					<div className="project-images">
						{images.map((img, index) => (
							<img key={index} src={img} alt={`${project.title} ${index + 1}`} />
						))}
					</div>
				</motion.div>
			)}
		</motion.div>
	);
}

export default ProjectCard;
