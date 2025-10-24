document.addEventListener('DOMContentLoaded', async () => {
    const projectsContainer = document.getElementById('projects-container');

    try {
        // Fetch the list of pages from pages.json
        const pagesResponse = await fetch('pages.json');
        if (!pagesResponse.ok) {
            throw new Error(`HTTP error! status: ${pagesResponse.status}`);
        }
        const pages = await pagesResponse.json();

        // Fetch the metadata for each project from its respective folder
        const projectDataPromises = pages.map(async (projectName) => {
            try {
                const metaResponse = await fetch(`./${projectName}/meta.json`);
                if (!metaResponse.ok) {
                    throw new Error(`HTTP error! status: ${metaResponse.status}`);
                }
                const projectMeta = await metaResponse.json();
                return {
                    name: projectName,
                    meta: projectMeta
                };
            } catch (error) {
                console.log(`Error fetching or parsing meta.json for project: ${projectName}`, error);
                return {
                    name: projectName,
                    meta: null
                };
            }
        });

        const projectData = (await Promise.all(projectDataPromises)).filter(Boolean);

        projectData.forEach(project => {
            const card = document.createElement('div');
            card.className = 'card';
            card.dataset.project = project.name;

            const imageContainer = document.createElement('div');
            imageContainer.className = 'card-image-container';

            const img = new Image();
            try {
                img.src = `./${project.name}/${project.meta.image}`;
            } catch (e) {
                console.log(`No image found for project: ${project.name}, using default image.`);
                try {
                    img.src = './default-image.png';
                } catch (e) {}
            }

            img.className = 'card-image';
            try {
                img.alt = project.meta.title;
            } catch (e) {
                img.alt = project.name || "Project Image";
            }

            img.onload = () => {
                imageContainer.appendChild(img);
            };

            img.onerror = () => {
                console.log(`Failed to load image for project: ${project.name}`);
            };

            card.appendChild(imageContainer);

            const content = document.createElement('div');
            content.className = 'card-content';

            const title = document.createElement('h3');
            title.className = 'card-title';
            try {
                title.textContent = project.meta.title;
            } catch (e) {
                title.textContent = project.name || "Untitled Project";
            }

            const description = document.createElement('p');
            description.className = 'card-description';
            try {
                description.textContent = project.meta.description;
            } catch (e) {
                description.textContent = "No description available.";
            }

            content.appendChild(title);
            content.appendChild(description);
            card.appendChild(content);

            card.addEventListener('click', () => {
                window.location.href = `./${project.name}/index.html`;
            });

            projectsContainer.appendChild(card);
        });
    } catch (error) {
        console.error('Failed to load project data:', error);
        projectsContainer.innerHTML = '<p class="text-red-500">Failed to load projects. Please check your data files.</p>';
    }
});
