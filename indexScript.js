const API_URL = "http://localhost:3000";

const postsTable = document.getElementById("postsTable");

async function fetchPosts() {
    try {
        const [articlesResponse, usersResponse] = await Promise.all([
            fetch(`${API_URL}/articles`),
            fetch(`${API_URL}/users`)
        ]);

        const articles = await articlesResponse.json();
        const users = await usersResponse.json();

        console.log("Articles:", articles); 
        console.log("Users:", users);     
        showPostsTable(articles, users);
    } catch (error) {
        console.error("Error al obtener los posts:", error);
    }
}

function showPostsTable(articles, users) {
    postsTable.innerHTML = ""; 

    articles.forEach(article => {
        console.log(`Procesando artículo: ${article.title} con authorId: ${article.authorId}`);

        const author = users.find(user => {
            console.log(`Comparando user.id (${user.id}) con article.authorId (${article.authorId})`);
            return Number(user.id) === article.authorId;
        });

        console.log("Autor encontrado:", author);

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${article.title}</td>
            <td>${author ? author.name : "Desconocido"}</td>
            <td>
                <button class="view-details" data-id="${article.id}">Ver Detalles</button>
            </td>
        `;

        postsTable.appendChild(row);
    });

    document.querySelectorAll(".view-details").forEach(button => {
        button.addEventListener("click", () => {
            const postId = button.getAttribute("data-id");
            window.location.href = `post-details.html?articleId=${postId}`;
        });
    });
}


fetchPosts();

